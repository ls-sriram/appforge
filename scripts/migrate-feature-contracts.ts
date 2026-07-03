import fs from "node:fs";
import path from "node:path";
import { Project, ScriptKind, SyntaxKind } from "ts-morph";

type MigrationRule =
  | {
      kind:
        | "screen"
        | "view"
        | "scaffold"
        | "viewmodel"
        | "model"
        | "block"
        | "store"
        | "usecase"
        | "repository"
        | "datasource"
        | "service"
        | "runtime"
        | "mapper";
      nextRelativePath: string;
      reason: string;
    }
  | null;

interface PlannedRename {
  fromAbsolutePath: string;
  toAbsolutePath: string;
  fromRelativePath: string;
  toRelativePath: string;
  reason: string;
}

interface FeaturePlan {
  featureName: string;
  featureDirectory: string;
  renames: PlannedRename[];
  warnings: string[];
}

interface CliOptions {
  rootDir: string;
  featureSelectors: string[];
  apply: boolean;
}

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"] as const;
const CURRENT_SUFFIX_PATTERN =
  /^[a-z0-9-]+\.(screen|view|scaffold|viewmodel|store|usecase|repository|datasource|service|runtime(?:\.[^.]+)?|model|dto|mapper|block|stage|renderer|client|bridge|factory|adapter|capability|config|catalog|policy|handler|types|keys|contracts|styles|storage)\.(ts|tsx)$/;

main();

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const featureDirs = resolveFeatureDirectories(options.rootDir, options.featureSelectors);
  if (featureDirs.length === 0) {
    throw new Error("No feature directories matched.");
  }

  const plans = featureDirs.map((featureDirectory) => buildFeaturePlan(options.rootDir, featureDirectory));
  printPlans(plans, options.apply);

  if (!options.apply) {
    return;
  }

  applyPlans(options.rootDir, plans);
}

function parseArgs(args: string[]): CliOptions {
  const rootDir = process.cwd();
  const featureSelectors: string[] = [];
  let apply = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--apply") {
      apply = true;
      continue;
    }
    if (arg === "--feature") {
      const value = args[index + 1];
      if (!value) {
        throw new Error('Missing value for "--feature".');
      }
      featureSelectors.push(value);
      index += 1;
      continue;
    }
    if (arg === "--all") {
      featureSelectors.push("*");
      continue;
    }
    throw new Error(
      'Usage: node --import tsx scripts/migrate-feature-contracts.ts [--feature <name|path>] [--all] [--apply]',
    );
  }

  if (featureSelectors.length === 0) {
    throw new Error('Provide at least one "--feature" selector or use "--all".');
  }

  return { rootDir, featureSelectors, apply };
}

function resolveFeatureDirectories(rootDir: string, selectors: string[]): string[] {
  const featuresRoot = path.join(rootDir, "src", "features");
  const directories = new Set<string>();

  for (const selector of selectors) {
    if (selector === "*") {
      for (const entry of fs.readdirSync(featuresRoot, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          directories.add(path.join(featuresRoot, entry.name));
        }
      }
      continue;
    }

    const asPath = path.isAbsolute(selector)
      ? selector
      : selector.includes(path.sep) || selector.includes("/")
        ? path.join(rootDir, selector)
        : path.join(featuresRoot, selector);

    if (!fs.existsSync(asPath) || !fs.statSync(asPath).isDirectory()) {
      throw new Error(`Feature directory not found: ${selector}`);
    }
    directories.add(asPath);
  }

  return Array.from(directories).sort();
}

function buildFeaturePlan(rootDir: string, featureDirectory: string): FeaturePlan {
  const featureName = path.basename(featureDirectory);
  const warnings: string[] = [];
  const renames: PlannedRename[] = [];
  const files = walkFiles(featureDirectory);
  const destinations = new Map<string, string>();

  for (const absolutePath of files) {
    const relativeWithinFeature = toPosix(path.relative(featureDirectory, absolutePath));
    const rule = classifyLegacyPath(featureName, relativeWithinFeature);
    if (!rule) {
      if (shouldWarn(relativeWithinFeature)) {
        warnings.push(`No automatic mapping for ${relativeWithinFeature}`);
      }
      continue;
    }

    const toAbsolutePath = path.join(featureDirectory, rule.nextRelativePath);
    const toRelativePath = toPosix(path.relative(rootDir, toAbsolutePath));
    const fromRelativePath = toPosix(path.relative(rootDir, absolutePath));

    if (absolutePath === toAbsolutePath) {
      continue;
    }

    const existingSource = destinations.get(toAbsolutePath);
    if (existingSource) {
      warnings.push(
        `Collision: ${fromRelativePath} and ${toPosix(path.relative(rootDir, existingSource))} both map to ${toRelativePath}`,
      );
      continue;
    }
    destinations.set(toAbsolutePath, absolutePath);

    renames.push({
      fromAbsolutePath: absolutePath,
      toAbsolutePath,
      fromRelativePath,
      toRelativePath,
      reason: rule.reason,
    });
  }

  renames.sort((left, right) => left.fromRelativePath.localeCompare(right.fromRelativePath));
  warnings.sort();
  return { featureName, featureDirectory, renames, warnings };
}

function classifyLegacyPath(featureName: string, relativePath: string): MigrationRule {
  const baseName = path.posix.basename(relativePath);
  const withoutExtension = baseName.replace(/\.(ts|tsx)$/, "");

  if (!relativePath.includes("/") && CURRENT_SUFFIX_PATTERN.test(baseName)) {
    return {
      kind: inferCurrentKind(baseName),
      nextRelativePath: baseName,
      reason: "File already matches current suffix conventions and moves to feature root",
    };
  }

  if (/^[A-Z].*RouteScreen\.tsx$/.test(baseName)) {
    return {
      kind: "screen",
      nextRelativePath: `${stripTrailingToken(baseName, "RouteScreen.tsx")}.screen.tsx`,
      reason: "Route screen becomes flat screen suffix",
    };
  }

  if (/^ui\/views\/.*View\.tsx$/.test(relativePath)) {
    return {
      kind: "view",
      nextRelativePath: `${stripTrailingToken(baseName, "View.tsx")}.view.tsx`,
      reason: "Feature view becomes flat view suffix",
    };
  }

  if (/^ui\/scaffolds\/.*Scaffold\.tsx$/.test(relativePath)) {
    return {
      kind: "scaffold",
      nextRelativePath: `${stripTrailingToken(baseName, "Scaffold.tsx")}.scaffold.tsx`,
      reason: "Scaffold component becomes flat scaffold suffix",
    };
  }

  if (/^[A-Z].*Controller\.ts$/.test(baseName)) {
    return {
      kind: "viewmodel",
      nextRelativePath: `${stripTrailingToken(baseName, "Controller.ts")}.viewmodel.ts`,
      reason: "Controller becomes viewmodel suffix",
    };
  }

  if (relativePath === "store/controller.ts") {
    return {
      kind: "store",
      nextRelativePath: `${featureName}.store.ts`,
      reason: "Feature store controller becomes flat store suffix",
    };
  }

  if (/^[A-Z].*Model\.ts$/.test(baseName)) {
    return {
      kind: "model",
      nextRelativePath: `${stripTrailingToken(baseName, "Model.ts")}.model.ts`,
      reason: "Pascal model becomes flat model suffix",
    };
  }

  if (/^ui\/.*Block\.tsx$/.test(relativePath)) {
    return {
      kind: "block",
      nextRelativePath: `${stripTrailingToken(baseName, "Block.tsx")}.block.tsx`,
      reason: "Block component becomes flat block suffix",
    };
  }

  if (/^renderers\/.*Renderer\.tsx$/.test(relativePath)) {
    return {
      kind: "block",
      nextRelativePath: `${stripTrailingToken(baseName, "Renderer.tsx")}.renderer.tsx`,
      reason: "Renderer component becomes explicit renderer suffix",
    };
  }

  if (/^ui\/contracts\/.*Contracts\.ts$/.test(relativePath)) {
    return {
      kind: "view",
      nextRelativePath: `${stripTrailingToken(baseName, "Contracts.ts")}.contracts.ts`,
      reason: "UI contract file becomes explicit contracts suffix",
    };
  }

  if (/^ui\/contracts\/.*Styles\.ts$/.test(relativePath)) {
    return {
      kind: "view",
      nextRelativePath: `${stripTrailingToken(baseName, "Styles.ts")}.styles.ts`,
      reason: "UI styles file becomes explicit styles suffix",
    };
  }

  if (/^ui\/.+\.tsx$/.test(relativePath)) {
    return {
      kind: "block",
      nextRelativePath: `${toKebabCase(withoutExtension)}.block.tsx`,
      reason: "Feature UI component becomes flat block suffix",
    };
  }

  if (relativePath === "viewmodel/store.ts") {
    return {
      kind: "store",
      nextRelativePath: `${featureName}.store.ts`,
      reason: "Nested viewmodel store becomes flat store suffix",
    };
  }

  if (/^viewmodel\/use-.*\.ts$/.test(relativePath)) {
    return {
      kind: "viewmodel",
      nextRelativePath: `${normalizeHookName(baseName)}.viewmodel.ts`,
      reason: "Viewmodel hook becomes flat viewmodel suffix",
    };
  }

  if (/^use-.*\.ts$/.test(relativePath)) {
    return {
      kind: "viewmodel",
      nextRelativePath: `${normalizeHookName(baseName)}.viewmodel.ts`,
      reason: "Feature hook becomes flat viewmodel suffix",
    };
  }

  if (/^usecases\/(?!__tests__\/).+\.ts$/.test(relativePath)) {
    return {
      kind: "usecase",
      nextRelativePath: baseName.endsWith(".usecase.ts")
        ? baseName
        : `${baseName.replace(/\.ts$/, "")}.usecase.ts`,
      reason: "Use case file gets explicit usecase suffix",
    };
  }

  if (relativePath === "domain/model.ts") {
    return {
      kind: "model",
      nextRelativePath: `${featureName}.model.ts`,
      reason: "Domain model becomes feature model suffix",
    };
  }

  if (relativePath === "domain/repository.ts") {
    return {
      kind: "repository",
      nextRelativePath: `${featureName}.repository.ts`,
      reason: "Repository abstraction becomes flat repository suffix",
    };
  }

  if (/^domain\/.+-model\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: `${baseName.replace(/-model\.ts$/, ".model.ts")}`,
      reason: "Named domain model becomes explicit model suffix",
    };
  }

  if (/^domain\/.+-repository\.ts$/.test(relativePath)) {
    return {
      kind: "repository",
      nextRelativePath: `${baseName.replace(/-repository\.ts$/, ".repository.ts")}`,
      reason: "Named repository abstraction becomes explicit repository suffix",
    };
  }

  if (/^domain\/feature-keys\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: "feature.keys.ts",
      reason: "Feature key set becomes explicit keys suffix",
    };
  }

  if (/^domain\/catalog\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: `${featureName}.catalog.ts`,
      reason: "Domain catalog becomes feature catalog suffix",
    };
  }

  if (/^domain\/policy\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: `${featureName}.policy.ts`,
      reason: "Domain policy becomes feature policy suffix",
    };
  }

  if (/^domain\/handler\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: `${featureName}.handler.ts`,
      reason: "Domain handler becomes feature handler suffix",
    };
  }

  if (/^domain\/types\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: `${featureName}.types.ts`,
      reason: "Domain type barrel becomes feature types suffix",
    };
  }

  if (/^domain\/plan\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: "plan.model.ts",
      reason: "Named domain model becomes explicit model suffix",
    };
  }

  if (/^domain\/upgrade-offers\.ts$/.test(relativePath)) {
    return {
      kind: "model",
      nextRelativePath: "upgrade-offers.catalog.ts",
      reason: "Upgrade offers become explicit catalog suffix",
    };
  }

  if (/^data\/.+\.repository\.ts$/.test(relativePath)) {
    return {
      kind: "datasource",
      nextRelativePath: `${baseName.replace(/\.repository\.ts$/, "")}.datasource.ts`,
      reason: "Repository implementation becomes datasource suffix",
    };
  }

  if (/^services\/.+\.service\.ts$/.test(relativePath)) {
    return {
      kind: "service",
      nextRelativePath: baseName,
      reason: "Service file keeps service suffix and moves to feature root",
    };
  }

  if (/^services\/.+\.client\.ts$/.test(relativePath)) {
    return {
      kind: "service",
      nextRelativePath: baseName,
      reason: "Client file keeps client suffix and moves to feature root",
    };
  }

  if (/^runtime\/.+\.runtime(\.[^.]+)?\.ts$/.test(relativePath)) {
    return {
      kind: "runtime",
      nextRelativePath: baseName,
      reason: "Runtime file keeps runtime suffix and moves to feature root",
    };
  }

  if (relativePath === "runtime/runtime.ts") {
    return {
      kind: "runtime",
      nextRelativePath: `${featureName}.runtime.ts`,
      reason: "Runtime capability contract becomes feature-named runtime suffix",
    };
  }

  if (/^runtime\/.+-runtime\.ts$/.test(relativePath)) {
    return {
      kind: "runtime",
      nextRelativePath: `${baseName.replace(/-runtime\.ts$/, ".runtime.ts")}`,
      reason: "Hyphen runtime file becomes explicit runtime suffix",
    };
  }

  if (/^runtime\/.+-client\.ts$/.test(relativePath)) {
    return {
      kind: "service",
      nextRelativePath: `${baseName.replace(/-client\.ts$/, ".client.ts")}`,
      reason: "Runtime client becomes explicit client suffix",
    };
  }

  if (/^runtime\/.+-bridge\.ts$/.test(relativePath)) {
    return {
      kind: "service",
      nextRelativePath: `${baseName.replace(/-bridge\.ts$/, ".bridge.ts")}`,
      reason: "Runtime bridge becomes explicit bridge suffix",
    };
  }

  if (/^runtime\/.+\.adapter\.ts$/.test(relativePath)) {
    return {
      kind: "service",
      nextRelativePath: baseName,
      reason: "Runtime adapter keeps adapter suffix and moves to feature root",
    };
  }

  if (relativePath === "runtime/adapter.ts") {
    return {
      kind: "service",
      nextRelativePath: `${featureName}.adapter.ts`,
      reason: "Runtime adapter contract becomes feature adapter suffix",
    };
  }

  if (/^runtime\/.+\.capability\.ts$/.test(relativePath)) {
    return {
      kind: "service",
      nextRelativePath: baseName,
      reason: "Runtime capability keeps capability suffix and moves to feature root",
    };
  }

  if (relativePath === "runtime/factory.ts") {
    return {
      kind: "service",
      nextRelativePath: "runtime.factory.ts",
      reason: "Runtime factory becomes explicit factory suffix",
    };
  }

  if (relativePath === "runtime/catalog.ts") {
    return {
      kind: "model",
      nextRelativePath: "runtime.catalog.ts",
      reason: "Runtime catalog becomes explicit catalog suffix",
    };
  }

  if (/^mapping\/.+\.ts$/.test(relativePath)) {
    return {
      kind: "mapper",
      nextRelativePath: `${baseName.replace(/\.ts$/, "")}.mapper.ts`,
      reason: "Mapping file becomes mapper suffix",
    };
  }

  if (relativePath === "bootstrap.ts") {
    return {
      kind: "service",
      nextRelativePath: `${featureName}.factory.ts`,
      reason: "Feature bootstrap becomes explicit factory suffix",
    };
  }

  if (relativePath === "storage.ts") {
    return {
      kind: "service",
      nextRelativePath: `${featureName}.storage.ts`,
      reason: "Feature storage helper becomes explicit storage suffix",
    };
  }

  return null;
}

function shouldWarn(relativePath: string): boolean {
  const baseName = path.posix.basename(relativePath);
  return (
    !CURRENT_SUFFIX_PATTERN.test(baseName) &&
    !relativePath.endsWith(".contract.yaml") &&
    !relativePath.includes("__tests__/") &&
    !relativePath.endsWith(".test.ts") &&
    !relativePath.endsWith(".test.tsx") &&
    !relativePath.endsWith("index.ts") &&
    !relativePath.endsWith(".DS_Store")
  );
}

function normalizeHookName(baseName: string): string {
  const withoutExtension = baseName.replace(/\.ts$/, "");
  const withoutUsePrefix = withoutExtension.replace(/^use-/, "");
  const withoutViewmodelSuffix = withoutUsePrefix.replace(/-viewmodel$/, "");
  return withoutViewmodelSuffix;
}

function inferCurrentKind(baseName: string): NonNullable<MigrationRule>["kind"] {
  if (baseName.endsWith(".screen.tsx")) return "screen";
  if (baseName.endsWith(".view.tsx")) return "view";
  if (baseName.endsWith(".scaffold.tsx")) return "scaffold";
  if (baseName.endsWith(".viewmodel.ts")) return "viewmodel";
  if (baseName.endsWith(".store.ts")) return "store";
  if (baseName.endsWith(".usecase.ts")) return "usecase";
  if (baseName.endsWith(".repository.ts")) return "repository";
  if (baseName.endsWith(".datasource.ts")) return "datasource";
  if (baseName.endsWith(".service.ts")) return "service";
  if (/\.runtime(\.[^.]+)?\.ts$/.test(baseName)) return "runtime";
  if (baseName.endsWith(".model.ts")) return "model";
  if (baseName.endsWith(".dto.ts")) return "model";
  if (baseName.endsWith(".mapper.ts")) return "mapper";
  if (baseName.endsWith(".block.tsx")) return "block";
  if (baseName.endsWith(".stage.tsx")) return "block";
  if (baseName.endsWith(".renderer.tsx")) return "block";
  if (baseName.endsWith(".client.ts")) return "service";
  if (baseName.endsWith(".bridge.ts")) return "service";
  if (baseName.endsWith(".factory.ts")) return "service";
  if (baseName.endsWith(".adapter.ts")) return "service";
  if (baseName.endsWith(".capability.ts")) return "service";
  if (baseName.endsWith(".catalog.ts")) return "model";
  if (baseName.endsWith(".policy.ts")) return "model";
  if (baseName.endsWith(".handler.ts")) return "model";
  if (baseName.endsWith(".types.ts")) return "model";
  if (baseName.endsWith(".keys.ts")) return "model";
  if (baseName.endsWith(".config.ts")) return "model";
  if (baseName.endsWith(".contracts.ts")) return "view";
  if (baseName.endsWith(".styles.ts")) return "view";
  if (baseName.endsWith(".storage.ts")) return "service";
  return "viewmodel";
}

function stripTrailingToken(baseName: string, token: string): string {
  return toKebabCase(baseName.slice(0, -token.length));
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function applyPlans(rootDir: string, plans: FeaturePlan[]): void {
  const renameMap = new Map<string, string>();
  for (const plan of plans) {
    for (const rename of plan.renames) {
      renameMap.set(rename.fromAbsolutePath, rename.toAbsolutePath);
    }
  }

  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: true,
    },
  });

  const sourceFiles = walkFiles(path.join(rootDir, "src")).filter((filePath) =>
    /\.(ts|tsx|js|jsx)$/.test(filePath),
  );
  const originalTextByPath = new Map<string, string>();

  for (const filePath of sourceFiles) {
    const text = fs.readFileSync(filePath, "utf8");
    originalTextByPath.set(filePath, text);
    project.createSourceFile(filePath, text, { overwrite: true, scriptKind: inferScriptKind(filePath) });
  }

  for (const sourceFile of project.getSourceFiles()) {
    rewriteModuleSpecifiers(sourceFile, renameMap, originalTextByPath);
  }

  const emitted = new Set<string>();
  for (const sourceFile of project.getSourceFiles()) {
    const oldPath = sourceFile.getFilePath();
    const nextPath = renameMap.get(oldPath) ?? oldPath;
    ensureDirectory(path.dirname(nextPath));
    fs.writeFileSync(nextPath, sourceFile.getFullText(), "utf8");
    emitted.add(nextPath);
  }

  for (const [oldPath, nextPath] of renameMap.entries()) {
    if (oldPath !== nextPath && fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  cleanupEmptyDirectories(path.join(rootDir, "src", "features"));
}

function rewriteModuleSpecifiers(
  sourceFile: import("ts-morph").SourceFile,
  renameMap: Map<string, string>,
  originalTextByPath: Map<string, string>,
): void {
  const oldSourcePath = sourceFile.getFilePath();
  const nextSourcePath = renameMap.get(oldSourcePath) ?? oldSourcePath;

  for (const declaration of sourceFile.getImportDeclarations()) {
    updateLiteralSpecifier(
      declaration.getModuleSpecifierValue(),
      (value) => declaration.setModuleSpecifier(value),
      oldSourcePath,
      nextSourcePath,
      renameMap,
    );
  }

  for (const declaration of sourceFile.getExportDeclarations()) {
    const value = declaration.getModuleSpecifierValue();
    if (!value) {
      continue;
    }
    updateLiteralSpecifier(
      value,
      (specifier) => declaration.setModuleSpecifier(specifier),
      oldSourcePath,
      nextSourcePath,
      renameMap,
    );
  }

  for (const callExpression of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    if (!callExpression.getExpression().getText().endsWith("require")) {
      continue;
    }
    const [argument] = callExpression.getArguments();
    if (!argument || !argument.asKind(SyntaxKind.StringLiteral)) {
      continue;
    }
    const literal = argument.asKindOrThrow(SyntaxKind.StringLiteral);
    updateLiteralSpecifier(
      literal.getLiteralValue(),
      (value) => literal.setLiteralValue(value),
      oldSourcePath,
      nextSourcePath,
      renameMap,
    );
  }

  const originalText = originalTextByPath.get(oldSourcePath);
  if (originalText === undefined) {
    return;
  }
}

function updateLiteralSpecifier(
  specifier: string,
  apply: (value: string) => void,
  oldSourcePath: string,
  nextSourcePath: string,
  renameMap: Map<string, string>,
): void {
  if (!specifier.startsWith(".")) {
    return;
  }
  const resolvedTarget = resolveModuleTarget(oldSourcePath, specifier);
  if (!resolvedTarget) {
    return;
  }
  const nextTargetPath = renameMap.get(resolvedTarget) ?? resolvedTarget;
  const nextSpecifier = toRelativeModuleSpecifier(nextSourcePath, nextTargetPath);
  if (nextSpecifier !== specifier) {
    apply(nextSpecifier);
  }
}

function resolveModuleTarget(sourcePath: string, specifier: string): string | null {
  const candidate = path.resolve(path.dirname(sourcePath), specifier);
  for (const extension of SOURCE_EXTENSIONS) {
    const withExtension = `${candidate}${extension}`;
    if (fs.existsSync(withExtension) && fs.statSync(withExtension).isFile()) {
      return withExtension;
    }
  }
  for (const extension of SOURCE_EXTENSIONS) {
    const asIndex = path.join(candidate, `index${extension}`);
    if (fs.existsSync(asIndex) && fs.statSync(asIndex).isFile()) {
      return asIndex;
    }
  }
  return null;
}

function toRelativeModuleSpecifier(fromFilePath: string, toFilePath: string): string {
  const withoutExtension = toFilePath.replace(/\.(ts|tsx|js|jsx)$/, "");
  let relative = toPosix(path.relative(path.dirname(fromFilePath), withoutExtension));
  if (!relative.startsWith(".")) {
    relative = `./${relative}`;
  }
  return relative;
}

function inferScriptKind(filePath: string): ScriptKind {
  if (filePath.endsWith(".tsx")) {
    return ScriptKind.TSX;
  }
  if (filePath.endsWith(".ts")) {
    return ScriptKind.TS;
  }
  if (filePath.endsWith(".jsx")) {
    return ScriptKind.JSX;
  }
  return ScriptKind.JS;
}

function printPlans(plans: FeaturePlan[], apply: boolean): void {
  for (const plan of plans) {
    console.log(`${apply ? "Applying" : "Planned"} migration for ${plan.featureName}`);
    if (plan.renames.length === 0) {
      console.log("  No mechanical renames found.");
    }
    for (const rename of plan.renames) {
      console.log(`  RENAME ${rename.fromRelativePath} -> ${rename.toRelativePath}`);
      console.log(`    ${rename.reason}`);
    }
    for (const warning of plan.warnings) {
      console.log(`  WARN ${warning}`);
    }
  }
}

function walkFiles(rootDir: string): string[] {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const results: string[] = [];
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(absolutePath));
    } else {
      results.push(absolutePath);
    }
  }
  return results.sort();
}

function cleanupEmptyDirectories(rootDir: string): void {
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const absolutePath = path.join(rootDir, entry.name);
    cleanupEmptyDirectories(absolutePath);
    if (fs.readdirSync(absolutePath).length === 0) {
      fs.rmdirSync(absolutePath);
    }
  }
}

function ensureDirectory(directoryPath: string): void {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}
