import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export const CONTRACT_SCHEMA = "v1";
export const ROOT = path.resolve(import.meta.dirname, "..");
export const ARCHITECTURE_ROOT = path.join(ROOT, ".architecture");
export const FEATURE_CONTRACTS_ROOT = path.join(ARCHITECTURE_ROOT, "features");
export const MODULE_CONTRACT_FILE = ".contract.yaml";

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function parseYamlFile(filePath) {
  return yaml.load(fs.readFileSync(filePath, "utf8"));
}

function walkFiles(rootDir, predicate, output = []) {
  if (!fs.existsSync(rootDir)) return output;
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(absolutePath, predicate, output);
      continue;
    }
    if (predicate(entry.name, absolutePath)) {
      output.push(absolutePath);
    }
  }
  return output;
}

function globToRegExp(glob) {
  let pattern = "^";

  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    const next = glob[index + 1];

    if (char === "*" && next === "*") {
      pattern += ".*";
      index += 1;
      continue;
    }
    if (char === "*") {
      pattern += "[^/]*";
      continue;
    }
    if (char === "{") {
      pattern += "(";
      continue;
    }
    if (char === "}") {
      pattern += ")";
      continue;
    }
    if (char === ",") {
      pattern += "|";
      continue;
    }
    if ("\\.[]()+?^$|".includes(char)) {
      pattern += `\\${char}`;
      continue;
    }
    pattern += char;
  }

  pattern += "$";
  return new RegExp(pattern);
}

function validateSchema(schema, filePath, errors) {
  if (schema !== CONTRACT_SCHEMA) {
    errors.push(`${filePath} must declare schema ${CONTRACT_SCHEMA}.`);
  }
}

function validateRepositoryGeneration(repository, errors) {
  const generation = repository.generation;
  if (!generation) return;
  if (!generation.feature_structure || typeof generation.feature_structure !== "object") {
    errors.push('Repository generation contract must define "feature_structure".');
  }
  if (typeof generation.feature_structure?.layout !== "string" || generation.feature_structure.layout.length === 0) {
    errors.push('Repository generation contract must define "feature_structure.layout".');
  }
  for (const key of ["required_dirs", "optional_dirs"]) {
    const value = generation.feature_structure?.[key];
    if (value !== undefined && !Array.isArray(value)) {
      errors.push(`Repository generation contract must define feature_structure.${key} as an array when present.`);
    }
  }
  if (!generation.file_suffixes || typeof generation.file_suffixes !== "object") {
    errors.push('Repository generation contract must define "file_suffixes".');
  }
  if (generation.classification !== undefined && typeof generation.classification !== "object") {
    errors.push('Repository generation contract must define "classification" as an object when present.');
  }
  if (generation.content_contracts !== undefined && typeof generation.content_contracts !== "object") {
    errors.push('Repository generation contract must define "content_contracts" as an object when present.');
  }
  if (generation.scaffolding) {
    for (const key of ["create_tests", "create_readme", "create_contract"]) {
      if (typeof generation.scaffolding[key] !== "boolean") {
        errors.push(`Repository generation contract must define scaffolding.${key} as a boolean.`);
      }
    }
  }
}

function validateMvvmArchitecture(layers, errors) {
  const mvvm = layers.architecture?.patterns?.mvvm;
  if (!mvvm) return;
  if (!Array.isArray(mvvm.layers) || mvvm.layers.length === 0) {
    errors.push('MVVM architecture contract must define "layers".');
    return;
  }
  for (const layerName of mvvm.layers) {
    if (!Array.isArray(mvvm.allowed_dependencies?.[layerName])) {
      errors.push(`MVVM architecture layer "${layerName}" is missing allowed dependency rules.`);
    }
  }
  for (const layerName of Object.keys(mvvm.allowed_dependencies ?? {})) {
    if (!mvvm.layers.includes(layerName)) {
      errors.push(`MVVM architecture declares unknown layer "${layerName}".`);
    }
  }
}

export function loadContractSystem(rootDir = ROOT) {
  const repositoryPath = path.join(rootDir, ".architecture", "repository.yaml");
  const layersPath = path.join(rootDir, ".architecture", "layers.yaml");
  const modulesRoot = path.join(rootDir, "src");
  const featureRoot = path.join(rootDir, ".architecture", "features");

  const repository = parseYamlFile(repositoryPath);
  const layers = parseYamlFile(layersPath);
  const modules = walkFiles(modulesRoot, (entry) => entry === MODULE_CONTRACT_FILE)
    .sort()
    .map((filePath) => ({
      ...parseYamlFile(filePath),
      directory: toPosix(path.relative(rootDir, path.dirname(filePath))),
      filePath: toPosix(path.relative(rootDir, filePath)),
    }));
  const features = walkFiles(featureRoot, (entry) => entry.endsWith(".contract.yaml"))
    .sort()
    .map((filePath) => ({
      ...parseYamlFile(filePath),
      filePath: toPosix(path.relative(rootDir, filePath)),
    }));

  const system = { rootDir, repository, layers, modules, features, roles: [] };
  validateContractSystem(system);
  return system;
}

export function validateContractSystem(system) {
  const errors = [];
  validateSchema(system.repository.schema, ".architecture/repository.yaml", errors);
  validateSchema(system.layers.schema, ".architecture/layers.yaml", errors);
  validateRepositoryGeneration(system.repository, errors);
  validateMvvmArchitecture(system.layers, errors);

  const moduleNames = new Set();
  const knownLayers = new Set(Object.keys(system.layers.layers ?? {}));

  for (const [layerName, rule] of Object.entries(system.layers.layers ?? {})) {
    for (const target of rule.can_import ?? []) {
      if (!knownLayers.has(target)) {
        errors.push(`Layer "${layerName}" imports unknown layer "${target}".`);
      }
    }
  }

  for (const contract of system.modules) {
    validateSchema(contract.schema, contract.filePath, errors);
    if (!contract.module) errors.push(`${contract.filePath} is missing "module".`);
    if (moduleNames.has(contract.module)) errors.push(`Duplicate module contract name "${contract.module}".`);
    moduleNames.add(contract.module);
    if (!knownLayers.has(contract.layer)) {
      errors.push(`Module "${contract.module}" references unknown layer "${contract.layer}".`);
    }
  }

  for (const contract of system.features) {
    validateSchema(contract.schema, contract.filePath, errors);
    for (const moduleName of contract.touches ?? []) {
      if (!moduleNames.has(moduleName)) {
        errors.push(`Feature "${contract.feature}" references unknown module "${moduleName}".`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

function findNearestModule(system, relativePath) {
  const normalized = toPosix(relativePath);
  return system.modules
    .filter((moduleContract) => normalized === moduleContract.directory || normalized.startsWith(`${moduleContract.directory}/`))
    .sort((left, right) => right.directory.length - left.directory.length)[0];
}

export function getRepositoryGenerationContract(system) {
  return system.repository.generation ?? null;
}

export function getMvvmArchitecturePattern(system) {
  return system.layers.architecture?.patterns?.mvvm ?? null;
}

export function classifyFileByConvention(system, filePath) {
  const relativePath = toPosix(path.isAbsolute(filePath) ? path.relative(system.rootDir, filePath) : filePath);
  const classification = system.repository.generation?.classification ?? {};
  const fileName = relativePath.split("/").pop() ?? relativePath;
  for (const [pattern, definition] of Object.entries(classification)) {
    if (globToRegExp(pattern).test(relativePath) || globToRegExp(pattern).test(fileName)) {
      const contentContract = definition.role
        ? system.repository.generation?.content_contracts?.[definition.role]
        : undefined;
      return {
        file: relativePath,
        layer: definition.layer,
        role: definition.role,
        responsibilities: contentContract?.responsibilities ?? [],
        prohibited_behaviors: contentContract?.must_not ?? [],
        allowed_imports: getMvvmArchitecturePattern(system)?.allowed_dependencies?.[definition.layer] ?? [],
      };
    }
  }

  return null;
}

export function resolveContractsForPaths(system, filePaths) {
  const modules = new Map();
  const layers = new Set();

  for (const filePath of filePaths) {
    const relativePath = toPosix(path.isAbsolute(filePath) ? path.relative(system.rootDir, filePath) : filePath);
    const moduleContract = findNearestModule(system, relativePath);
    if (moduleContract) modules.set(moduleContract.module, moduleContract);
    const classification = classifyFileByConvention(system, relativePath);
    if (classification?.layer) layers.add(classification.layer);
  }

  const features = system.features.filter((featureContract) => {
    const overlap = featureContract.touches.filter((moduleName) => modules.has(moduleName)).length;
    return overlap >= 2;
  });

  return {
    modules: [...modules.values()],
    features,
    layers: [...layers],
  };
}
