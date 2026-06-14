const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const APP_EXAMPLE = path.join(ROOT, "app-example-app");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

function hasImport(src, pattern) {
  return pattern.test(src);
}

function getAppScopeFromPath(relPath) {
  const m = relPath.match(/^src\/apps\/([^/]+)\//);
  return m ? m[1] : null;
}

function getRouteAppScopeFromPath(relPath) {
  if (relPath.startsWith("app-example-app/")) return "example-app";
  return null;
}

const APP_SCOPES = fs.existsSync(path.join(ROOT, "src", "apps"))
  ? fs
      .readdirSync(path.join(ROOT, "src", "apps"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : [];

if (fs.existsSync(path.join(ROOT, "app"))) {
  console.error("MVVM boundary violations:");
  console.error("- app/: legacy route root is not allowed. Use app-example-app/ only.");
  process.exit(1);
}

const roots = [SRC, APP_EXAMPLE].filter((dir) => fs.existsSync(dir));
const files = roots.flatMap((dir) => walk(dir));
const violations = [];
const nullabilityPolicyViolations = [];

const STRICT_NO_NULL_UNION_PATHS = [
  /^src\/features\/auth\/.+\.(ts|tsx)$/,
  /^src\/features\/login\/.+\.(ts|tsx)$/,
  /^src\/features\/register\/.+\.(ts|tsx)$/,
  /^src\/features\/settings\/.+\.(ts|tsx)$/,
  /^src\/features\/upgrade\/.+\.(ts|tsx)$/,
  /^src\/features\/entitlements\/.+\.(ts|tsx)$/,
  /^src\/services\/BackendAuthService\.ts$/,
  /^src\/services\/AuthService\.ts$/,
];
const NULLABILITY_GLOBAL_ALLOWLIST = [
  /^src\/generated\/.+$/,
  /^src\/types\/api\.d\.ts$/,
  /^src\/features\/recordings\/runtime\/__tests__\/native-audio-recording\.capability\.test\.ts$/,
  /^src\/features\/recordings\/runtime\/audio-recording\.capability\.ts$/,
  /^src\/features\/shared-entity\/renderers\/AudioSharedEntityRenderer\.tsx$/,
  /^src\/providers\/EntitlementProvider\.tsx$/,
  /^src\/providers\/SessionProvider\.tsx$/,
  /^src\/services\/SessionClient\.ts$/,
  /^src\/services\/TaskService\.ts$/,
  /^src\/services\/UserProfileService\.ts$/,
];

for (const file of files) {
  const r = rel(file);
  const txt = read(file);

  const isView = /src\/features\/.+\/views\/.+\.(ts|tsx)$/.test(r);
  const isViewModel = /src\/features\/.+\/viewmodel\/.+\.(ts|tsx)$/.test(r) || /Controller\.ts$/.test(r);
  const isRoute = /app-example-app\/.+\.(ts|tsx)$/.test(r);

  if (isView) {
    if (hasImport(txt, /from\s+["'].*services\/.*["']/)) {
      violations.push(`${r}: view must not import services`);
    }
    if (hasImport(txt, /from\s+["'].*\/data\/.*["']/)) {
      violations.push(`${r}: view must not import data layer`);
    }
  }

  if (isViewModel) {
    if (hasImport(txt, /from\s+["'].*services\/.*["']/)) {
      violations.push(`${r}: viewmodel/controller must not import services directly`);
    }
    if (hasImport(txt, /from\s+["'].*\/data\/.*["']/)) {
      violations.push(`${r}: viewmodel/controller must not import data layer directly`);
    }
  }

  if (isRoute) {
    if (hasImport(txt, /from\s+["']\.\.\/src\/services\/.*["']/) || hasImport(txt, /from\s+["']\.\.\/\.\.\/src\/services\/.*["']/)) {
      violations.push(`${r}: route must not import services directly`);
    }
  }

  const appScope = getAppScopeFromPath(r);
  const crossAppImportMatch = txt.match(/from\s+["'][^"']*src\/apps\/([^/"']+)\//);
  if (appScope && crossAppImportMatch && crossAppImportMatch[1] !== appScope) {
    violations.push(`${r}: app scope '${appScope}' must not import app scope '${crossAppImportMatch[1]}'`);
  }
  if (r.startsWith("src/") && !r.startsWith("src/apps/") && hasImport(txt, /from\s+["'][^"']*src\/apps\/[^/"']+\//)) {
    violations.push(`${r}: shared src modules must not import app-specific src/apps modules`);
  }

  const routeAppScopeRaw = getRouteAppScopeFromPath(r);
  const routeAppScope = routeAppScopeRaw && APP_SCOPES.includes(routeAppScopeRaw) ? routeAppScopeRaw : null;
  const routeCrossAppImportMatch = txt.match(/from\s+["'][^"']*src\/apps\/([^/"']+)\//);
  if (routeAppScope && routeCrossAppImportMatch && routeCrossAppImportMatch[1] !== routeAppScope) {
    violations.push(`${r}: app route scope '${routeAppScope}' must not import app scope '${routeCrossAppImportMatch[1]}'`);
  }

  const enforceNoNullUnion = STRICT_NO_NULL_UNION_PATHS.some((pattern) => pattern.test(r));
  if (enforceNoNullUnion && txt.includes("| null")) {
    nullabilityPolicyViolations.push(`${r}: '| null' is disallowed in strict auth/onboarding domain paths`);
  }

  const isGlobalNullabilityTarget = r.startsWith("src/") || r.startsWith("app-example-app/");
  const isAllowlisted = NULLABILITY_GLOBAL_ALLOWLIST.some((pattern) => pattern.test(r));
  if (isGlobalNullabilityTarget && !isAllowlisted && txt.includes("| null")) {
    nullabilityPolicyViolations.push(`${r}: '| null' is disallowed in app/domain code; use optional fields, unions, or Result errors`);
  }
}

if (violations.length) {
  console.error("MVVM boundary violations:");
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

if (nullabilityPolicyViolations.length) {
  console.error("Nullability policy violations:");
  for (const v of nullabilityPolicyViolations) console.error(`- ${v}`);
  process.exit(1);
}

console.log("MVVM boundary check passed.");
