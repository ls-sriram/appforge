import fs from "node:fs";
import path from "node:path";
import {
  classifyFileByConvention,
  loadContractSystem,
  resolveContractsForPaths,
} from "./system.mjs";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const CONTRACTS_ROOT = path.join(ROOT, "docs", "contracts");
export const CONTRACT_APP_ROOT = path.join(CONTRACTS_ROOT, "app");
export const CONTRACT_ARCHITECTURE_ROOT = path.join(CONTRACTS_ROOT, "architecture");
export const CONTRACT_LAYER_ROOT = path.join(CONTRACTS_ROOT, "layers");
export const STRUCTURED_CONTRACT_ROOT = path.join(ROOT, ".architecture");
export const STRUCTURED_LAYER_CONTRACT = path.join(STRUCTURED_CONTRACT_ROOT, "layers.yaml");
export const STRUCTURED_REPOSITORY_CONTRACT = path.join(STRUCTURED_CONTRACT_ROOT, "repository.yaml");
let cachedSystem;

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

export const CONTRACT_ROOT = CONTRACT_LAYER_ROOT;

function getSystem() {
  if (!cachedSystem) {
    cachedSystem = loadContractSystem(ROOT);
  }
  return cachedSystem;
}

function detectExpectedLayer(meta) {
  if (meta.fileName === "model.ts") return "domain";
  if (meta.fileName === "repository.ts") return "repository";
  if (meta.effectiveLayerDir === "usecases") return "usecase";
  if (meta.effectiveLayerDir === "viewmodel") return "viewmodel";
  if (meta.effectiveLayerDir === "data") return "data";
  if (meta.featureUiKind === "views" || meta.featureUiKind === "blocks") return "ui";
  return undefined;
}

function detectNamingExpectation(meta) {
  if (meta.featureUiKind === "views") return "*View.tsx";
  if (meta.featureUiKind === "blocks") return "*Block.tsx";
  if (meta.effectiveLayerDir === "domain") return "model.ts or repository.ts";
  if (meta.effectiveLayerDir === "viewmodel") return "store.ts or use-*.ts";
  if (meta.effectiveLayerDir === "usecases") return "*.ts";
  if (meta.effectiveLayerDir === "data") return "*.repository.ts";
  return undefined;
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => path.join(dir, name));
}

export function getLayerContractPath(layerId) {
  return layerId ? STRUCTURED_LAYER_CONTRACT : undefined;
}

export function listLayerDirectoryContracts() {
  const system = getSystem();
  const mvvm = system.layers.architecture?.patterns?.mvvm;
  const layerNames = mvvm?.layers ?? [];
  return layerNames.map((layerId) => ({
    layerId,
    contractFile: "layers.yaml",
    contractPath: STRUCTURED_LAYER_CONTRACT,
    relativePath: rel(STRUCTURED_LAYER_CONTRACT),
  }));
}

export function listKnownContracts() {
  const entries = [];
  const rootGuide = path.join(ROOT, "CLAUDE.md");
  const appGuide = path.join(ROOT, "app", "AGENTS.md");
  const contractGuide = path.join(CONTRACTS_ROOT, "README.md");
  const appContract = path.join(CONTRACT_APP_ROOT, "README.md");

  if (fs.existsSync(rootGuide)) {
    entries.push({ kind: "root_guide", id: "root", path: rootGuide, relativePath: rel(rootGuide) });
  }
  if (fs.existsSync(appGuide)) {
    entries.push({ kind: "folder_guidance", id: "app", path: appGuide, relativePath: rel(appGuide) });
  }
  if (fs.existsSync(STRUCTURED_REPOSITORY_CONTRACT)) {
    entries.push({
      kind: "repository_contract",
      id: "repository",
      path: STRUCTURED_REPOSITORY_CONTRACT,
      relativePath: rel(STRUCTURED_REPOSITORY_CONTRACT),
    });
  }
  if (fs.existsSync(STRUCTURED_LAYER_CONTRACT)) {
    entries.push({
      kind: "layer_contract",
      id: "layers",
      path: STRUCTURED_LAYER_CONTRACT,
      relativePath: rel(STRUCTURED_LAYER_CONTRACT),
    });
  }

  const system = getSystem();
  for (const contract of system.modules) {
    entries.push({
      kind: "module_contract",
      id: contract.module,
      path: path.join(ROOT, contract.filePath),
      relativePath: contract.filePath,
    });
  }
  for (const contract of system.features) {
    entries.push({
      kind: "feature_contract",
      id: contract.feature,
      path: path.join(ROOT, contract.filePath),
      relativePath: contract.filePath,
    });
  }
  if (fs.existsSync(contractGuide)) {
    entries.push({ kind: "reference_doc", id: "contracts", path: contractGuide, relativePath: rel(contractGuide) });
  }
  if (fs.existsSync(appContract)) {
    entries.push({ kind: "reference_doc", id: "app", path: appContract, relativePath: rel(appContract) });
  }

  return entries;
}

export function getFileContractMeta(filePath) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
  const relativePath = rel(absolutePath);
  const segments = relativePath.split("/");
  const fileName = path.basename(relativePath);
  const featureIndex = segments.indexOf("features");
  const featureName = featureIndex >= 0 ? segments[featureIndex + 1] : undefined;
  const featureScopedSegments = featureIndex >= 0 ? segments.slice(featureIndex + 2) : [];
  const isFeatureFile = segments[0] === "src" && segments[1] === "features" && Boolean(featureName);
  const isFeatureRootFile = isFeatureFile && featureScopedSegments.length === 1;
  const firstLayerDir = featureScopedSegments[0];
  const featureUiKind = firstLayerDir === "ui" ? featureScopedSegments[1] : undefined;
  const effectiveLayerDir =
    firstLayerDir === "features" && featureScopedSegments.length >= 3
      ? featureScopedSegments[2]
      : firstLayerDir;

  const meta = {
    absolutePath,
    relativePath,
    segments,
    fileName,
    featureName,
    featureScopedSegments,
    isFeatureFile,
    isFeatureRootFile,
    firstLayerDir,
    effectiveLayerDir,
    featureUiKind,
  };

  const fileType = classifyFileByConvention(getSystem(), relativePath)?.layer;
  const expectedLayer = detectExpectedLayer(meta);
  const namingExpectation = detectNamingExpectation(meta);
  const namingViolation = Boolean(expectedLayer && !fileType && namingExpectation)
    ? `Expected ${namingExpectation} for ${relativePath}`
    : undefined;
  const contractFile = fileType ? "layers.yaml" : undefined;
  const contractPath = contractFile ? STRUCTURED_LAYER_CONTRACT : undefined;

  return {
    ...meta,
    fileType,
    expectedLayer,
    namingExpectation,
    namingViolation,
    contractFile,
    contractPath,
  };
}

function resolveFolderGuidanceFiles(dir) {
  const guidance = [];
  const claudePath = path.join(dir, "CLAUDE.md");
  const agentsPath = path.join(dir, "AGENTS.md");
  if (fs.existsSync(claudePath)) guidance.push(claudePath);
  if (fs.existsSync(agentsPath)) guidance.push(agentsPath);
  return guidance;
}

function samePath(left, right) {
  return Boolean(left && right && path.resolve(left) === path.resolve(right));
}

function pushChainEntry(chain, entry) {
  if (!entry?.path || !fs.existsSync(entry.path)) return;
  if (chain.some((current) => samePath(current.path, entry.path))) return;
  chain.push({ ...entry, relativePath: rel(entry.path) });
}

function getArchitectureContractNames(meta) {
  const classification = classifyFileByConvention(getSystem(), meta.relativePath);
  return classification?.layer ? [classification.layer] : [];
}

export function resolveEffectiveContractChain(filePath) {
  const meta = getFileContractMeta(filePath);
  const chain = [];
  const rootGuide = path.join(ROOT, "CLAUDE.md");
  const system = getSystem();
  const resolved = resolveContractsForPaths(system, [meta.relativePath]);

  pushChainEntry(chain, { kind: "root_guide", path: rootGuide });

  const targetDir = path.dirname(meta.absolutePath);
  const dirs = [];
  let current = targetDir;
  while (current.startsWith(ROOT)) {
    dirs.push(current);
    if (current === ROOT) break;
    current = path.dirname(current);
  }

  for (const dir of dirs.reverse()) {
    for (const guidance of resolveFolderGuidanceFiles(dir)) {
      if (samePath(guidance, rootGuide)) continue;
      pushChainEntry(chain, { kind: "folder_guidance", path: guidance });
    }
  }

  for (const moduleContract of resolved.modules) {
    pushChainEntry(chain, {
      kind: "module_contract",
      moduleId: moduleContract.module,
      path: path.join(ROOT, moduleContract.filePath),
    });
  }

  for (const featureContract of resolved.features) {
    pushChainEntry(chain, {
      kind: "feature_contract",
      featureId: featureContract.feature,
      path: path.join(ROOT, featureContract.filePath),
    });
  }

  if (resolved.layers.length > 0 || getArchitectureContractNames(meta).length > 0) {
    pushChainEntry(chain, {
      kind: "layer_contract",
      path: STRUCTURED_LAYER_CONTRACT,
    });
  }
  pushChainEntry(chain, {
    kind: "repository_contract",
    path: STRUCTURED_REPOSITORY_CONTRACT,
  });

  return { file: meta, chain };
}
