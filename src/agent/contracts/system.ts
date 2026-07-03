import fs from "node:fs";
import path from "node:path";
import { dump, load } from "js-yaml";

export type ContractSchemaVersion = "v1";

export interface RepositoryContract {
  schema: ContractSchemaVersion;
  repository: string;
  invariants: string[];
  validation: Record<string, boolean>;
  checks?: Record<string, boolean>;
  generation?: RepositoryGenerationContract;
  documentation?: Record<string, string | boolean>;
  path_map?: Record<string, string>;
  contract_resolution: {
    order: string[];
    override_policy: string;
  };
}

export interface RepositoryGenerationContract {
  feature_structure: {
    layout: string;
    required_dirs?: string[];
    optional_dirs?: string[];
  };
  file_suffixes: Record<string, string>;
  classification?: Record<string, { layer: string; role?: string }>;
  content_contracts?: Record<
    string,
    {
      responsibilities: string[];
      must_not?: string[];
    }
  >;
  scaffolding?: {
    create_tests: boolean;
    create_readme: boolean;
    create_contract: boolean;
  };
}

export interface ArchitecturePatternContract {
  layers: string[];
  allowed_dependencies: Record<string, string[]>;
}

export interface LayerArchitectureContract {
  patterns?: {
    mvvm?: ArchitecturePatternContract;
  };
}

export interface LayerRule {
  can_import: string[];
}

export interface LayersContract {
  schema: ContractSchemaVersion;
  layers: Record<string, LayerRule>;
  architecture?: LayerArchitectureContract;
}

export interface CoupledFileRule {
  pattern: string;
  also_pulls: string[];
}

export interface ModuleContract {
  schema: ContractSchemaVersion;
  module: string;
  layer: string;
  owner: string;
  public_api: string[];
  documentation?: string[];
  invariants: string[];
  ownership?: {
    exclude?: string[];
  };
  coupled_files?: CoupledFileRule[];
  directory: string;
  filePath: string;
}

export interface FeatureContract {
  schema: ContractSchemaVersion;
  feature: string;
  touches: string[];
  success_criteria: string[];
  filePath: string;
}

export interface AgentRoleContract {
  schema: ContractSchemaVersion;
  role: string;
  capabilities: string[];
  cannot: string[];
  receives: string[];
  success_conditions: string[];
  filePath: string;
}

export interface ContractSystem {
  rootDir: string;
  repository: RepositoryContract;
  layers: LayersContract;
  modules: ModuleContract[];
  features: FeatureContract[];
  roles: AgentRoleContract[];
}

export interface ApplicableContractRef {
  kind: "task" | "module" | "feature" | "layer" | "repository";
  id: string;
  path: string;
}

export interface TaskContract {
  schema: ContractSchemaVersion;
  objective: string;
  allowed_files: string[];
  forbidden_files: string[];
  applicable_contracts: ApplicableContractRef[];
  success_criteria: string[];
  context: {
    changed_files: string[];
    matched_modules: string[];
    matched_features: string[];
    matched_layers: string[];
  };
}

export interface ResolvedContracts {
  modules: ModuleContract[];
  features: FeatureContract[];
  layers: string[];
}

export interface ClassifiedFile {
  file: string;
  layer: string;
  role?: string;
  responsibilities?: string[];
  prohibited_behaviors?: string[];
  allowed_imports: string[];
}

export interface ImportGraphEdge {
  from: string;
  specifier: string;
  to: string | null;
  kind: "internal" | "external" | "unresolved";
}

export interface ImportGraph {
  generated_at: string;
  edges: ImportGraphEdge[];
}

export interface OwnershipGraphNode {
  module: string;
  owner: string;
  layer: string;
  directory: string;
  public_api: string[];
}

export interface OwnershipGraph {
  generated_at: string;
  modules: OwnershipGraphNode[];
}

export interface ModuleDependencyEdge {
  from: string;
  to: string;
  import_count: number;
}

export interface DependencyGraph {
  generated_at: string;
  edges: ModuleDependencyEdge[];
}

export interface ModuleSummary {
  module: string;
  owner: string;
  layer: string;
  directory: string;
  file_count: number;
  exported_api_count: number;
  invariants: string[];
}

export interface AnalysisArtifacts {
  importGraph: ImportGraph;
  ownershipGraph: OwnershipGraph;
  dependencyGraph: DependencyGraph;
  moduleSummaries: ModuleSummary[];
}

export interface DriftViolation {
  from_module: string;
  to_module: string;
  from_layer: string;
  to_layer: string;
  reason: string;
}

export interface DriftRecord {
  generated_at: string;
  drift_score: number;
  confidence_score: number;
  contract_divergence: DriftViolation[];
}

interface PathAlias {
  exact: boolean;
  key: string;
  target: string;
}

const CONTRACT_SCHEMA = "v1";
const MODULE_CONTRACT_FILE = ".contract.yaml";

export function loadContractSystem(rootDir = process.cwd()): ContractSystem {
  const repositoryPath = path.join(rootDir, ".architecture", "repository.yaml");
  const layersPath = path.join(rootDir, ".architecture", "layers.yaml");
  const featureDir = path.join(rootDir, ".architecture", "features");
  const rolesDir = path.join(rootDir, ".agent", "roles");
  const modulesRoot = path.join(rootDir, "src");

  const repository = parseYamlFile<RepositoryContract>(repositoryPath);
  const layers = parseYamlFile<LayersContract>(layersPath);
  const modules = walkFiles(modulesRoot, (entry) => entry === MODULE_CONTRACT_FILE).map((filePath) => {
    const contract = parseYamlFile<Omit<ModuleContract, "directory" | "filePath">>(filePath);
    return {
      ...contract,
      directory: toPosix(path.relative(rootDir, path.dirname(filePath))),
      filePath: toPosix(path.relative(rootDir, filePath)),
    };
  });
  const features = fs.existsSync(featureDir)
    ? walkFiles(featureDir, (entry) => entry.endsWith(".contract.yaml")).map((filePath) => {
        const contract = parseYamlFile<Omit<FeatureContract, "filePath">>(filePath);
        return { ...contract, filePath: toPosix(path.relative(rootDir, filePath)) };
      })
    : [];
  const roles = fs.existsSync(rolesDir)
    ? walkFiles(rolesDir, (entry) => entry.endsWith(".yaml")).map((filePath) => {
        const contract = parseYamlFile<Omit<AgentRoleContract, "filePath">>(filePath);
        return { ...contract, filePath: toPosix(path.relative(rootDir, filePath)) };
      })
    : [];

  const system = { rootDir, repository, layers, modules, features, roles };
  validateContractSystem(system);
  return system;
}

export function validateContractSystem(system: ContractSystem): void {
  const errors: string[] = [];

  if (system.repository.schema !== CONTRACT_SCHEMA) {
    errors.push(`Repository contract must use schema ${CONTRACT_SCHEMA}.`);
  }
  validateRepositoryGeneration(system.repository, errors);
  if (system.layers.schema !== CONTRACT_SCHEMA) {
    errors.push(`Layer contract must use schema ${CONTRACT_SCHEMA}.`);
  }
  validateMvvmArchitecture(system.layers, errors);

  const layerNames = new Set(Object.keys(system.layers.layers));
  for (const [layerName, rule] of Object.entries(system.layers.layers)) {
    for (const target of rule.can_import) {
      if (!layerNames.has(target)) {
        errors.push(`Layer "${layerName}" imports unknown layer "${target}".`);
      }
    }
  }

  const moduleNames = new Set<string>();
  for (const moduleContract of system.modules) {
    validateSchema(moduleContract.schema, moduleContract.filePath, errors);
    if (!moduleContract.module) {
      errors.push(`Module contract ${moduleContract.filePath} is missing "module".`);
    }
    if (moduleNames.has(moduleContract.module)) {
      errors.push(`Duplicate module contract name "${moduleContract.module}".`);
    }
    moduleNames.add(moduleContract.module);
    if (!layerNames.has(moduleContract.layer)) {
      errors.push(
        `Module "${moduleContract.module}" references unknown layer "${moduleContract.layer}".`,
      );
    }
  }

  for (const featureContract of system.features) {
    validateSchema(featureContract.schema, featureContract.filePath, errors);
    for (const moduleName of featureContract.touches) {
      if (!moduleNames.has(moduleName)) {
        errors.push(
          `Feature "${featureContract.feature}" references unknown module "${moduleName}".`,
        );
      }
    }
  }

  for (const roleContract of system.roles) {
    validateSchema(roleContract.schema, roleContract.filePath, errors);
    if (!roleContract.role) {
      errors.push(`Role contract ${roleContract.filePath} is missing "role".`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

export function getRepositoryGenerationContract(
  system: ContractSystem,
): RepositoryGenerationContract | null {
  return system.repository.generation ?? null;
}

export function getMvvmArchitecturePattern(
  system: ContractSystem,
): ArchitecturePatternContract | null {
  return system.layers.architecture?.patterns?.mvvm ?? null;
}

export function classifyFileByConvention(
  system: ContractSystem,
  filePath: string,
): ClassifiedFile | null {
  const generation = getRepositoryGenerationContract(system);
  const architecturePattern = getMvvmArchitecturePattern(system);
  if (!generation?.classification || !architecturePattern) {
    return null;
  }

  const normalizedFile = toPosix(filePath);
  const fileName = normalizedFile.split("/").pop() ?? normalizedFile;
  for (const [globPattern, classification] of Object.entries(generation.classification)) {
    if (matchesPathGlob(normalizedFile, fileName, globPattern)) {
      const contentContract = classification.role
        ? generation.content_contracts?.[classification.role]
        : undefined;
      return {
        file: normalizedFile,
        layer: classification.layer,
        role: classification.role,
        responsibilities: contentContract?.responsibilities ?? [],
        prohibited_behaviors: contentContract?.must_not ?? [],
        allowed_imports: architecturePattern.allowed_dependencies[classification.layer] ?? [],
      };
    }
  }

  return null;
}

export function resolveContractsForPaths(
  system: ContractSystem,
  changedFiles: string[],
): ResolvedContracts {
  const changed = changedFiles.map((file) => toPosix(stripRoot(system.rootDir, file)));
  const matchedModules = dedupeBy(
    changed
      .map((file) => findModuleForPath(system.modules, file))
      .filter((moduleContract): moduleContract is ModuleContract => moduleContract !== null),
    (moduleContract) => moduleContract.module,
  );
  const matchedModuleNames = new Set(matchedModules.map((moduleContract) => moduleContract.module));
  const matchedFeatures = system.features.filter((featureContract) => {
    const overlapCount = featureContract.touches.filter((moduleName) => matchedModuleNames.has(moduleName))
      .length;
    return overlapCount >= 2;
  });
  const matchedLayers = Array.from(
    new Set(matchedModules.map((moduleContract) => moduleContract.layer)),
  );

  return {
    modules: matchedModules,
    features: matchedFeatures,
    layers: matchedLayers,
  };
}

export function buildTaskContract(
  system: ContractSystem,
  options: {
    objective: string;
    changedFiles: string[];
    taskPath?: string;
    allowedFiles?: string[];
    forbiddenFiles?: string[];
  },
): TaskContract {
  const resolved = resolveContractsForPaths(system, options.changedFiles);
  const allowedFromModules = resolved.modules.map((moduleContract) => `${moduleContract.directory}/**`);
  const narrowedAllowedFiles = options.allowedFiles?.map(toPosix) ?? allowedFromModules;

  for (const allowedFile of narrowedAllowedFiles) {
    if (!isWithinAllowedScopes(allowedFile, allowedFromModules)) {
      throw new Error(
        `Task scope "${allowedFile}" widens beyond matched module boundaries.`,
      );
    }
  }

  const defaultForbidden = system.modules
    .filter(
      (moduleContract) =>
        !resolved.modules.some((matchedModule) => matchedModule.module === moduleContract.module),
    )
    .map((moduleContract) => `${moduleContract.directory}/**`);

  const successCriteria = Array.from(
    new Set([
      ...resolved.modules.flatMap((moduleContract) => moduleContract.invariants),
      ...resolved.features.flatMap((featureContract) => featureContract.success_criteria),
    ]),
  );

  return {
    schema: CONTRACT_SCHEMA,
    objective: options.objective,
    allowed_files: narrowedAllowedFiles,
    forbidden_files: dedupe([...(options.forbiddenFiles ?? []), ...defaultForbidden].map(toPosix)),
    applicable_contracts: [
      {
        kind: "task",
        id: "task",
        path: options.taskPath ?? ".agent/runs/<run-id>/task.yaml",
      },
      ...resolved.modules.map((moduleContract) => ({
        kind: "module" as const,
        id: moduleContract.module,
        path: moduleContract.filePath,
      })),
      ...resolved.features.map((featureContract) => ({
        kind: "feature" as const,
        id: featureContract.feature,
        path: featureContract.filePath,
      })),
      ...resolved.layers.map((layerName) => ({
        kind: "layer" as const,
        id: layerName,
        path: ".architecture/layers.yaml",
      })),
      {
        kind: "repository",
        id: system.repository.repository,
        path: ".architecture/repository.yaml",
      },
    ],
    success_criteria: successCriteria,
    context: {
      changed_files: options.changedFiles.map((file) => toPosix(stripRoot(system.rootDir, file))),
      matched_modules: resolved.modules.map((moduleContract) => moduleContract.module),
      matched_features: resolved.features.map((featureContract) => featureContract.feature),
      matched_layers: resolved.layers,
    },
  };
}

export function generateAnalysisArtifacts(system: ContractSystem): AnalysisArtifacts {
  const aliases = loadPathAliases(system.rootDir);
  const files = walkFiles(path.join(system.rootDir, "src"), (entry) => /\.(ts|tsx)$/.test(entry));
  const importEdges: ImportGraphEdge[] = [];

  for (const filePath of files) {
    const relativeFile = toPosix(path.relative(system.rootDir, filePath));
    const imports = extractImportSpecifiers(fs.readFileSync(filePath, "utf8"));
    for (const specifier of imports) {
      const resolvedPath = resolveImportSpecifier(system.rootDir, filePath, specifier, aliases);
      importEdges.push({
        from: relativeFile,
        specifier,
        to: resolvedPath ? toPosix(path.relative(system.rootDir, resolvedPath)) : null,
        kind: resolvedPath
          ? "internal"
          : isLikelyInternal(specifier)
            ? "unresolved"
            : "external",
      });
    }
  }

  const dependencyCounts = new Map<string, number>();
  for (const edge of importEdges) {
    if (!edge.to) {
      continue;
    }
    const fromModule = findModuleForPath(system.modules, edge.from);
    const toModule = findModuleForPath(system.modules, edge.to);
    if (!fromModule || !toModule || fromModule.module === toModule.module) {
      continue;
    }
    const key = `${fromModule.module}->${toModule.module}`;
    dependencyCounts.set(key, (dependencyCounts.get(key) ?? 0) + 1);
  }

  const dependencyGraph: DependencyGraph = {
    generated_at: new Date().toISOString(),
    edges: Array.from(dependencyCounts.entries())
      .map(([key, count]) => {
        const [from, to] = key.split("->");
        return { from, to, import_count: count };
      })
      .sort((left, right) => left.from.localeCompare(right.from) || left.to.localeCompare(right.to)),
  };

  const ownershipGraph: OwnershipGraph = {
    generated_at: new Date().toISOString(),
    modules: system.modules
      .map((moduleContract) => ({
        module: moduleContract.module,
        owner: moduleContract.owner,
        layer: moduleContract.layer,
        directory: moduleContract.directory,
        public_api: moduleContract.public_api,
      }))
      .sort((left, right) => left.module.localeCompare(right.module)),
  };

  const moduleSummaries: ModuleSummary[] = system.modules
    .map((moduleContract) => ({
      module: moduleContract.module,
      owner: moduleContract.owner,
      layer: moduleContract.layer,
      directory: moduleContract.directory,
      file_count: walkFiles(path.join(system.rootDir, moduleContract.directory), (entry) =>
        /\.(ts|tsx)$/.test(entry),
      ).length,
      exported_api_count: moduleContract.public_api.length,
      invariants: moduleContract.invariants,
    }))
    .sort((left, right) => left.module.localeCompare(right.module));

  return {
    importGraph: {
      generated_at: new Date().toISOString(),
      edges: importEdges.sort(
        (left, right) =>
          left.from.localeCompare(right.from) || left.specifier.localeCompare(right.specifier),
      ),
    },
    ownershipGraph,
    dependencyGraph,
    moduleSummaries,
  };
}

export function generateDriftRecord(
  system: ContractSystem,
  analysis: AnalysisArtifacts,
): DriftRecord {
  const divergence: DriftViolation[] = [];

  for (const edge of analysis.dependencyGraph.edges) {
    const fromModule = system.modules.find((moduleContract) => moduleContract.module === edge.from);
    const toModule = system.modules.find((moduleContract) => moduleContract.module === edge.to);
    if (!fromModule || !toModule) {
      continue;
    }
    const canImport = system.layers.layers[fromModule.layer]?.can_import ?? [];
    if (!canImport.includes(toModule.layer)) {
      divergence.push({
        from_module: fromModule.module,
        to_module: toModule.module,
        from_layer: fromModule.layer,
        to_layer: toModule.layer,
        reason: `${fromModule.layer} cannot import ${toModule.layer}`,
      });
    }
  }

  const internalEdges = analysis.importGraph.edges.filter((edge) => edge.kind === "internal").length;
  const unresolvedEdges = analysis.importGraph.edges.filter((edge) => edge.kind === "unresolved").length;

  return {
    generated_at: new Date().toISOString(),
    drift_score:
      analysis.dependencyGraph.edges.length === 0
        ? 0
        : Number((divergence.length / analysis.dependencyGraph.edges.length).toFixed(4)),
    confidence_score:
      internalEdges + unresolvedEdges === 0
        ? 1
        : Number((internalEdges / (internalEdges + unresolvedEdges)).toFixed(4)),
    contract_divergence: divergence,
  };
}

export function writeAnalysisArtifacts(rootDir: string, analysis: AnalysisArtifacts): void {
  writeJson(path.join(rootDir, ".agent-cache", "manifests", "import_graph.json"), analysis.importGraph);
  writeJson(
    path.join(rootDir, ".agent-cache", "manifests", "ownership_graph.json"),
    analysis.ownershipGraph,
  );
  writeJson(
    path.join(rootDir, ".agent-cache", "manifests", "dependency_graph.json"),
    analysis.dependencyGraph,
  );
  writeJson(
    path.join(rootDir, ".agent-cache", "analysis", "module_summaries.json"),
    analysis.moduleSummaries,
  );
}

export function writeTaskRun(
  rootDir: string,
  runId: string,
  taskContract: TaskContract,
): { taskPath: string; bundlePath: string; tracePath: string } {
  const runDir = path.join(rootDir, ".agent", "runs", runId);
  fs.mkdirSync(runDir, { recursive: true });

  const taskPath = path.join(runDir, "task.yaml");
  const bundlePath = path.join(runDir, "bundle.md");
  const tracePath = path.join(runDir, "trace.json");

  fs.writeFileSync(taskPath, dump(taskContract, { noRefs: true }), "utf8");
  fs.writeFileSync(bundlePath, renderTaskBundle(taskContract), "utf8");
  fs.writeFileSync(
    tracePath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        objective: taskContract.objective,
        applicable_contracts: taskContract.applicable_contracts,
        context: taskContract.context,
      },
      null,
      2,
    ),
    "utf8",
  );

  return {
    taskPath: toPosix(path.relative(rootDir, taskPath)),
    bundlePath: toPosix(path.relative(rootDir, bundlePath)),
    tracePath: toPosix(path.relative(rootDir, tracePath)),
  };
}

export function writeDriftRecord(rootDir: string, fileName: string, drift: DriftRecord): string {
  const filePath = path.join(rootDir, ".agent-drift", fileName);
  writeJson(filePath, drift);
  return toPosix(path.relative(rootDir, filePath));
}

function renderTaskBundle(taskContract: TaskContract): string {
  const lines = [
    "# Task Bundle",
    "",
    `Objective: ${taskContract.objective}`,
    "",
    "## Allowed Files",
    ...taskContract.allowed_files.map((entry) => `- ${entry}`),
    "",
    "## Forbidden Files",
    ...taskContract.forbidden_files.map((entry) => `- ${entry}`),
    "",
    "## Applicable Contracts",
    ...taskContract.applicable_contracts.map(
      (contractRef) => `- ${contractRef.kind}: ${contractRef.id} (${contractRef.path})`,
    ),
    "",
    "## Success Criteria",
    ...taskContract.success_criteria.map((criteria) => `- ${criteria}`),
  ];

  return `${lines.join("\n")}\n`;
}

function parseYamlFile<T>(filePath: string): T {
  return load(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function validateSchema(schema: string | undefined, filePath: string, errors: string[]): void {
  if (schema !== CONTRACT_SCHEMA) {
    errors.push(`${filePath} must use schema ${CONTRACT_SCHEMA}.`);
  }
}

function validateRepositoryGeneration(
  repository: RepositoryContract,
  errors: string[],
): void {
  const generation = repository.generation;
  if (!generation) {
    return;
  }

  const featureStructure = generation.feature_structure;
  if (!featureStructure || typeof featureStructure !== "object") {
    errors.push('Repository generation contract must define "feature_structure".');
  } else {
    if (typeof featureStructure.layout !== "string" || featureStructure.layout.length === 0) {
      errors.push('Repository generation contract must define "feature_structure.layout".');
    }
    const requiredDirs = featureStructure.required_dirs;
    if (requiredDirs !== undefined && !Array.isArray(requiredDirs)) {
      errors.push(
        'Repository generation contract "feature_structure.required_dirs" must be an array.',
      );
    }
    const optionalDirs = featureStructure.optional_dirs;
    if (optionalDirs !== undefined && !Array.isArray(optionalDirs)) {
      errors.push(
        'Repository generation contract "feature_structure.optional_dirs" must be an array.',
      );
    }
  }

  const fileSuffixes = generation.file_suffixes;
  if (!fileSuffixes || typeof fileSuffixes !== "object") {
    errors.push('Repository generation contract must define "file_suffixes".');
  } else {
    for (const [key, value] of Object.entries(fileSuffixes)) {
      if (typeof value !== "string" || value.length === 0) {
        errors.push(`Repository generation suffix "${key}" must be a non-empty string.`);
      }
    }
  }

  const classification = generation.classification;
  if (!classification || typeof classification !== "object") {
    errors.push('Repository generation contract must define "classification".');
  } else {
    for (const [pattern, value] of Object.entries(classification)) {
      if (typeof value?.layer !== "string" || value.layer.length === 0) {
        errors.push(`Repository classification "${pattern}" must define a non-empty layer.`);
      }
    }
  }

  const contentContracts = generation.content_contracts;
  if (contentContracts !== undefined) {
    if (!contentContracts || typeof contentContracts !== "object") {
      errors.push('Repository generation "content_contracts" must be an object.');
    } else {
      for (const [role, contract] of Object.entries(contentContracts)) {
        if (!Array.isArray(contract?.responsibilities) || contract.responsibilities.length === 0) {
          errors.push(
            `Repository content contract "${role}" must define non-empty responsibilities.`,
          );
        }
        if (contract?.must_not !== undefined && !Array.isArray(contract.must_not)) {
          errors.push(`Repository content contract "${role}" must define "must_not" as an array.`);
        }
      }
    }
  }

  const scaffolding = generation.scaffolding;
  if (!scaffolding || typeof scaffolding !== "object") {
    errors.push('Repository generation contract must define "scaffolding".');
  } else {
    for (const key of ["create_tests", "create_readme", "create_contract"] as const) {
      if (typeof scaffolding[key] !== "boolean") {
        errors.push(`Repository scaffolding flag "${key}" must be boolean.`);
      }
    }
  }
}

function validateMvvmArchitecture(layers: LayersContract, errors: string[]): void {
  const mvvm = layers.architecture?.patterns?.mvvm;
  if (!mvvm) {
    return;
  }

  if (!Array.isArray(mvvm.layers) || mvvm.layers.length === 0) {
    errors.push('Layer architecture pattern "mvvm.layers" must be a non-empty array.');
    return;
  }
  if (!mvvm.allowed_dependencies || typeof mvvm.allowed_dependencies !== "object") {
    errors.push('Layer architecture pattern "mvvm.allowed_dependencies" must be an object.');
    return;
  }

  const knownLayers = new Set(mvvm.layers);
  for (const layer of mvvm.layers) {
    if (!(layer in mvvm.allowed_dependencies)) {
      errors.push(`MVVM architecture layer "${layer}" is missing allowed dependency rules.`);
    }
  }

  for (const [layer, allowedDependencies] of Object.entries(mvvm.allowed_dependencies)) {
    if (!knownLayers.has(layer)) {
      errors.push(`MVVM architecture declares unknown layer "${layer}".`);
      continue;
    }
    if (!Array.isArray(allowedDependencies)) {
      errors.push(`MVVM architecture dependencies for "${layer}" must be an array.`);
      continue;
    }
    for (const dependency of allowedDependencies) {
      if (!knownLayers.has(dependency)) {
        errors.push(`MVVM architecture layer "${layer}" depends on unknown layer "${dependency}".`);
      }
    }
  }
}

function matchesPathGlob(fullPath: string, fileName: string, pattern: string): boolean {
  const normalizedPattern = toPosix(pattern);
  const escaped = normalizedPattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
  const regex = new RegExp(normalizedPattern.includes("/") ? `${escaped}$` : `^${escaped}$`);
  return normalizedPattern.includes("/") ? regex.test(fullPath) : regex.test(fileName);
}

function walkFiles(rootDir: string, predicate: (entry: string) => boolean): string[] {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const results: string[] = [];
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(absolutePath, predicate));
      continue;
    }
    if (predicate(entry.name)) {
      results.push(absolutePath);
    }
  }
  return results.sort();
}

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function stripRoot(rootDir: string, filePath: string): string {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
  return path.relative(rootDir, absolutePath);
}

function findModuleForPath(modules: ModuleContract[], filePath: string): ModuleContract | null {
  const normalized = toPosix(filePath);
  const matching = modules
    .filter((moduleContract) => normalized === moduleContract.directory || normalized.startsWith(`${moduleContract.directory}/`))
    .sort((left, right) => right.directory.length - left.directory.length);
  return matching[0] ?? null;
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

function dedupeBy<T>(values: T[], getKey: (value: T) => string): T[] {
  const seen = new Set<string>();
  const results: T[] = [];
  for (const value of values) {
    const key = getKey(value);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    results.push(value);
  }
  return results;
}

function isWithinAllowedScopes(candidate: string, scopes: string[]): boolean {
  return scopes.some((scope) => {
    const prefix = scope.endsWith("/**") ? scope.slice(0, -3) : scope;
    return candidate === scope || candidate.startsWith(prefix);
  });
}

function extractImportSpecifiers(source: string): string[] {
  const matches = source.matchAll(
    /(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["'`]([^"'`]+)["'`]|import\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
  );
  const specifiers: string[] = [];
  for (const match of matches) {
    const specifier = match[1] ?? match[2];
    if (specifier) {
      specifiers.push(specifier);
    }
  }
  return specifiers;
}

function loadPathAliases(rootDir: string): PathAlias[] {
  const tsconfigPath = path.join(rootDir, "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) {
    return [];
  }
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8")) as {
    compilerOptions?: { paths?: Record<string, string[]> };
  };
  const paths = tsconfig.compilerOptions?.paths ?? {};
  return Object.entries(paths).flatMap(([key, targets]) =>
    targets.map((target) => ({
      exact: !key.includes("*"),
      key,
      target,
    })),
  );
}

function resolveImportSpecifier(
  rootDir: string,
  importerFile: string,
  specifier: string,
  aliases: PathAlias[],
): string | null {
  if (specifier.startsWith(".")) {
    return resolveCandidate(path.resolve(path.dirname(importerFile), specifier));
  }

  for (const alias of aliases) {
    if (alias.exact && specifier === alias.key) {
      return resolveCandidate(path.join(rootDir, alias.target));
    }
    if (!alias.exact) {
      const [prefix, suffix = ""] = alias.key.split("*");
      if (specifier.startsWith(prefix) && specifier.endsWith(suffix)) {
        const middle = specifier.slice(prefix.length, specifier.length - suffix.length);
        return resolveCandidate(path.join(rootDir, alias.target.replace("*", middle)));
      }
    }
  }

  return null;
}

function resolveCandidate(candidate: string): string | null {
  const candidates = [
    candidate,
    `${candidate}.ts`,
    `${candidate}.tsx`,
    `${candidate}.d.ts`,
    path.join(candidate, "index.ts"),
    path.join(candidate, "index.tsx"),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }
  return null;
}

function isLikelyInternal(specifier: string): boolean {
  return specifier.startsWith(".") || specifier.startsWith("@");
}
