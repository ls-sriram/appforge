import fs from "node:fs";
import path from "node:path";
import {
  classifyFileByConvention,
  loadContractSystem,
  resolveContractsForPaths,
} from "./system.mjs";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const STRUCTURED_CONTRACT_ROOT = path.join(ROOT, ".architecture");
export const STRUCTURED_LAYER_CONTRACT = path.join(STRUCTURED_CONTRACT_ROOT, "layers.yaml");
export const STRUCTURED_REPOSITORY_CONTRACT = path.join(STRUCTURED_CONTRACT_ROOT, "repository.yaml");
export const AGENT_BEHAVIOR_PATH = path.join(ROOT, ".agent", "agent_behavior.md");
let cachedSystem;

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

export const CONTRACT_ROOT = STRUCTURED_CONTRACT_ROOT;

function getSystem() {
  if (!cachedSystem) {
    cachedSystem = loadContractSystem(ROOT);
  }
  return cachedSystem;
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
  const agentsGuide = path.join(ROOT, "AGENTS.md");

  if (fs.existsSync(rootGuide)) {
    entries.push({ kind: "root_guide", id: "root", path: rootGuide, relativePath: rel(rootGuide) });
  }
  if (fs.existsSync(agentsGuide)) {
    entries.push({ kind: "root_guide", id: "agents", path: agentsGuide, relativePath: rel(agentsGuide) });
  }
  if (fs.existsSync(AGENT_BEHAVIOR_PATH)) {
    entries.push({
      kind: "agent_behavior",
      id: "agent_behavior",
      path: AGENT_BEHAVIOR_PATH,
      relativePath: rel(AGENT_BEHAVIOR_PATH),
    });
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

  const classification = classifyFileByConvention(getSystem(), relativePath);
  const fileType = classification?.layer;
  const isContractScopedSource =
    relativePath.startsWith("src/features/") &&
    /\.(ts|tsx)$/.test(relativePath) &&
    !relativePath.includes("/__tests__/") &&
    !relativePath.endsWith(".test.ts") &&
    !relativePath.endsWith(".test.tsx") &&
    !relativePath.endsWith("/index.ts") &&
    !relativePath.endsWith(".d.ts");
  const namingViolation = isContractScopedSource && !fileType
    ? "File does not match any repository naming convention."
    : undefined;
  const contractFile = fileType ? "layers.yaml" : undefined;
  const contractPath = contractFile ? STRUCTURED_LAYER_CONTRACT : undefined;

  return {
    ...meta,
    fileType,
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
