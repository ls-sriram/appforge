import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getFileContractMeta } from "./contracts.mjs";
import { classifyFileByConvention, loadContractSystem } from "./system.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SEARCH_ROOTS = ["app", "src"].map((segment) => path.join(ROOT, segment));
const SOURCE_FILE_PATTERN = /\.(ts|tsx)$/;
const NAMING_ALLOWLIST = new Set([
  "src/features/repo-handler/domain/local-workspace.ts",
  "src/ui/blocks/block-preview.config.ts",
]);
const system = loadContractSystem(ROOT);

function isWithinContractedModule(relativePath) {
  return system.modules.some(
    (moduleContract) =>
      relativePath === moduleContract.directory || relativePath.startsWith(`${moduleContract.directory}/`),
  );
}

function isNamingViolationIgnored(relativePath) {
  return (
    relativePath.includes("/__tests__/") ||
    relativePath.startsWith("src/features/shared/") ||
    NAMING_ALLOWLIST.has(relativePath)
  );
}

function walk(dir, output = []) {
  if (!fs.existsSync(dir)) return output;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(absolutePath, output);
      continue;
    }
    if (SOURCE_FILE_PATTERN.test(entry.name)) {
      output.push(absolutePath);
    }
  }

  return output;
}

function toRelative(absolutePath) {
  return path.relative(ROOT, absolutePath).replaceAll(path.sep, "/");
}

function readFile(absolutePath) {
  return fs.readFileSync(absolutePath, "utf8");
}

function collectImports(source) {
  const imports = [];
  const importPattern = /import\s+(type\s+)?[\s\S]*?\sfrom\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

  for (const match of source.matchAll(importPattern)) {
    const specifier = match[2] ?? match[3];
    if (!specifier) continue;
    imports.push({
      specifier,
      isTypeOnly: Boolean(match[1]),
    });
  }

  return imports;
}

function resolveImportTarget(filePath, specifier) {
  if (!specifier.startsWith(".")) return null;

  const candidates = [
    specifier,
    `${specifier}.ts`,
    `${specifier}.tsx`,
    `${specifier}.js`,
    `${specifier}.jsx`,
    path.join(specifier, "index.ts"),
    path.join(specifier, "index.tsx"),
    path.join(specifier, "index.js"),
    path.join(specifier, "index.jsx"),
  ];

  for (const candidate of candidates) {
    const absoluteCandidate = path.resolve(path.dirname(filePath), candidate);
    if (fs.existsSync(absoluteCandidate) && fs.statSync(absoluteCandidate).isFile()) {
      return absoluteCandidate;
    }
  }

  return null;
}

function hasViolationImport(meta, importRecord, resolvedTarget) {
  const { specifier } = importRecord;
  if (importRecord.isTypeOnly) {
    return null;
  }
  const sourceLayer = meta.fileType ? classifyFileByConvention(system, meta.relativePath) : null;
  const targetMeta = resolvedTarget ? getFileContractMeta(resolvedTarget) : null;
  const targetLayer = targetMeta?.fileType ? classifyFileByConvention(system, targetMeta.relativePath) : null;

  if (!sourceLayer || !targetLayer) {
    return null;
  }

  if (sourceLayer.layer === targetLayer.layer) {
    return null;
  }

  if (!sourceLayer.allowed_imports.includes(targetLayer.layer)) {
    return `${sourceLayer.layer} files may not import ${targetLayer.layer} files`;
  }

  return null;
}

function validateRouteFile(relativePath, source) {
  if (!relativePath.startsWith("app/")) return [];
  if (relativePath === "app/_layout.tsx") return [];

  const imports = collectImports(source);
  const violations = [];

  for (const { specifier } of imports) {
    if (
      specifier === "react" ||
      specifier === "expo-router" ||
      specifier === "../navigation/routes" ||
      specifier === "../../navigation/routes" ||
      specifier === "../src/navigation/routes" ||
      specifier.startsWith("../src/features/") ||
      specifier.startsWith("../../src/features/")
    ) {
      continue;
    }

    violations.push(`${relativePath}: route files must stay thin and only import feature screens or expo-router helpers (found '${specifier}')`);
  }

  return violations;
}

// Every primitive's style values must live in its own
// src/platform/ui/components/<name>/ folder (see .architecture/layers/styles.yaml)
// — nothing may define style values in a shared monolith again. The theme
// assembler (theme/definitions/factory.ts) is the one place allowed to
// import and combine them.
const COMPONENTS_DIR = path.join(ROOT, "src/platform/ui/components");
const STYLES_LOCATION_PATTERN = /^src\/platform\/ui\/components\/[^/]+\/[^/]+\.styles\.ts$/;

function findStylesLocationViolation(relativePath) {
  // Scoped to the platform UI surface only — feature-level *.styles.ts files
  // (e.g. src/features/auth/auth.styles.ts) are an unrelated, pre-existing
  // convention for screen layout, not primitive theme contracts.
  if (!relativePath.startsWith("src/platform/ui/")) return null;
  if (!relativePath.endsWith(".styles.ts")) return null;
  if (STYLES_LOCATION_PATTERN.test(relativePath)) return null;
  return `${relativePath}: style files must live under src/platform/ui/components/<name>/ — do not define style values outside a component folder`;
}

// Mirror of the platform-primitives styles rule above, scoped to
// src/features/ instead: a feature's *.styles.ts must either be the
// feature's own named assembler (<feature>/<feature>.styles.ts, e.g.
// auth/auth.styles.ts) or a per-block sibling (<name>.styles.ts next to
// <name>.block.tsx / <name>.scaffold.tsx in the same folder) — never a
// shared monolith holding every block's style values again.
const FEATURE_STYLES_PATTERN = /^src\/features\/([^/]+)\/([^/]+)\.styles\.ts$/;
const STYLES_COMPANION_SUFFIXES = [".block.tsx", ".block.web.tsx", ".block.native.tsx", ".scaffold.tsx"];

function findFeatureStylesLocationViolation(relativePath) {
  const match = relativePath.match(FEATURE_STYLES_PATTERN);
  if (!match) return null;
  const [, feature, stem] = match;
  if (stem === feature) return null;

  const dir = path.dirname(path.join(ROOT, relativePath));
  const hasCompanion = STYLES_COMPANION_SUFFIXES.some((suffix) => fs.existsSync(path.join(dir, `${stem}${suffix}`)));
  if (hasCompanion) return null;

  return `${relativePath}: feature style files must either be the feature's own assembler (<feature>.styles.ts) or a sibling of ${stem}.block.tsx / ${stem}.scaffold.tsx`;
}

// Every component folder must carry both an implementation and its styles
// side by side — a folder with one but not the other means the co-location
// migration was left half-done for that component.
//
// A small number of components genuinely have no themed style-values
// contract to extract: they take raw, non-themed props directly (a color
// string, a size number, free-form text styling) rather than a resolved
// `XContract` object from the theme. Requiring a `.styles.ts` for these
// would mean inventing a themed contract that doesn't otherwise exist,
// which is the opposite of what the rule is protecting against.
const NO_STYLES_CONTRACT_COMPONENTS = new Set(["icon", "color-swatch", "text"]);

function findComponentFolderPresenceViolations() {
  if (!fs.existsSync(COMPONENTS_DIR)) return [];

  const violations = [];
  for (const entry of fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folderPath = path.join(COMPONENTS_DIR, entry.name);
    const files = fs.readdirSync(folderPath);
    const relativeFolder = `src/platform/ui/components/${entry.name}`;

    const hasImplementation = files.some(
      (name) => /\.tsx?$/.test(name) && !name.endsWith(".styles.ts") && !name.endsWith(".test.tsx") && !name.endsWith(".test.ts") && name !== "index.ts",
    );
    const hasStyles = files.some((name) => name.endsWith(".styles.ts"));

    if (!hasImplementation) {
      violations.push(`${relativeFolder}: component folder has no implementation file`);
    }
    if (!hasStyles && !NO_STYLES_CONTRACT_COMPONENTS.has(entry.name)) {
      violations.push(`${relativeFolder}: component folder has no *.styles.ts file`);
    }
  }
  return violations;
}

const files = SEARCH_ROOTS.flatMap((dir) => walk(dir)).sort();
const violations = [...findComponentFolderPresenceViolations()];

for (const absolutePath of files) {
  const relativePath = toRelative(absolutePath);
  const source = readFile(absolutePath);
  const meta = getFileContractMeta(absolutePath);

  if (meta.namingViolation && isWithinContractedModule(relativePath) && !isNamingViolationIgnored(relativePath)) {
    violations.push(`${relativePath}: ${meta.namingViolation}`);
  }

  for (const routeViolation of validateRouteFile(relativePath, source)) {
    violations.push(routeViolation);
  }

  const stylesLocationViolation = findStylesLocationViolation(relativePath);
  if (stylesLocationViolation) {
    violations.push(stylesLocationViolation);
  }

  const featureStylesLocationViolation = findFeatureStylesLocationViolation(relativePath);
  if (featureStylesLocationViolation) {
    violations.push(featureStylesLocationViolation);
  }

  for (const importRecord of collectImports(source)) {
    const resolvedTarget = resolveImportTarget(absolutePath, importRecord.specifier);
    const importViolation = hasViolationImport(meta, importRecord, resolvedTarget);
    if (importViolation) {
      violations.push(`${relativePath}: ${importViolation} (found '${importRecord.specifier}')`);
    }
  }
}

if (violations.length > 0) {
  console.error("Architecture contract violations:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`Architecture contracts passed for ${files.length} files.`);
