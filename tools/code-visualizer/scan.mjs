import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT = path.resolve(__dirname, "../..");

function readFile(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

function walk(rel, opts = {}) {
  const { exts = null, exclude = [] } = opts;
  const abs = path.join(ROOT, rel);
  const out = [];
  function rec(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const relFull = path.relative(ROOT, full);
      if (exclude.some((x) => relFull.includes(x))) continue;
      if (e.isDirectory()) {
        rec(full);
      } else if (!exts || exts.some((ext) => e.name.endsWith(ext))) {
        out.push(relFull);
      }
    }
  }
  rec(abs);
  return out;
}

// ─── Screens ───────────────────────────────────────────────────────────

function parseRouteConst(rel) {
  const src = readFile(rel);
  if (!src) return [];
  const routes = [];
  const re = /(\w+):\s*"([^"]+)"\s*as const/g;
  let m;
  while ((m = re.exec(src))) {
    routes.push({ name: m[1], path: m[2] });
  }
  return routes;
}

function scanScreens() {
  const apps = [];

  const manifestSrc = readFile("config/app-manifest.json");
  const manifest = manifestSrc ? JSON.parse(manifestSrc) : { apps: {} };

  const rootRoutes = parseRouteConst("src/navigation/routes.ts");
  const rootScreenFiles = walk("app-example-app", { exts: [".tsx"] })
    .filter((f) => !f.endsWith("_layout.tsx"))
    .map((f) => {
      const relToRouter = f.replace(/^app-example-app\//, "");
      const routePath =
        "/" +
        relToRouter
          .replace(/\.tsx$/, "")
          .replace(/\/index$/, "")
          .replace(/^index$/, "");
      return { file: f, routePath: routePath === "" ? "/" : routePath };
    });

  for (const [appId, appInfo] of Object.entries(manifest.apps || {})) {
    apps.push({
      appId,
      displayName: appInfo.displayName,
      routerRoot: appInfo.routerRoot,
      routeBase: appInfo.routeBase,
      isDefault: manifest.defaultAppId === appId,
      routes: rootRoutes,
      screenFiles: rootScreenFiles,
    });
  }

  const exampleRoutes = parseRouteConst("src/apps/example-app/navigation/routes.ts");
  if (exampleRoutes.length && apps.length) {
    apps[0].featureRoutes = exampleRoutes;
  }

  return { apps };
}

// ─── Design tokens ─────────────────────────────────────────────────────

function parseFlatTokenBlocks(src) {
  const blocks = [];
  const re = /export const (\w+) = \{([\s\S]*?)\n\} as const;/g;
  let m;
  while ((m = re.exec(src))) {
    const [, name, body] = m;
    const entries = [];
    const entryRe = /^\s*(?:"([^"]+)"|(\w+)):\s*(.+?),?\s*$/gm;
    let em;
    while ((em = entryRe.exec(body))) {
      const key = em[1] || em[2];
      const value = em[3];
      if (key && value) entries.push({ key, value: value.replace(/,$/, "") });
    }
    blocks.push({ name, entries });
  }
  return blocks;
}

function extractColorPalette(src) {
  // Pull the two literal palettes (dark/light base) defined under `const base = dark ? {...} : {...}`
  const palettes = [];
  const baseMatch = src.match(/const base = dark\s*\?\s*\{([\s\S]*?)\}\s*:\s*\{([\s\S]*?)\};/);
  if (baseMatch) {
    for (const [label, body] of [
      ["dark", baseMatch[1]],
      ["light", baseMatch[2]],
    ]) {
      const colors = {};
      const re = /(\w+):\s*"([^"]+)"/g;
      let m;
      while ((m = re.exec(body))) {
        colors[m[1]] = m[2];
      }
      palettes.push({ label, colors });
    }
  }

  const defaults = {};
  const defaultRe = /const (success|warning|error|info)\s*=\s*brand\.\1\s*\?\?\s*"([^"]+)"/g;
  let dm;
  while ((dm = defaultRe.exec(src))) {
    defaults[dm[1]] = dm[2];
  }

  return { palettes, defaults };
}

function extractThemeShape(src) {
  // Extract the `Theme` interface's `colors` block field names, grouped by sub-object.
  const themeMatch = src.match(/export interface Theme \{\s*colors:\s*\{([\s\S]*?)\n\s*\};\s*\n\}/);
  if (!themeMatch) return [];
  const body = themeMatch[1];
  const groups = [];
  let depth = 0;
  let currentGroup = { name: "colors", fields: [] };
  const lines = body.split("\n");
  const stack = [currentGroup];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const groupOpen = trimmed.match(/^(\w+):\s*\{$/);
    if (groupOpen) {
      const g = { name: groupOpen[1], fields: [] };
      stack[stack.length - 1].fields.push({ group: g });
      stack.push(g);
      continue;
    }
    if (trimmed === "};" || trimmed === "}") {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const field = trimmed.match(/^"?([\w-]+)"?:\s*(.+?);?$/);
    if (field) {
      stack[stack.length - 1].fields.push({ name: field[1], type: field[2].replace(/;$/, "") });
    }
  }
  return stack[0] === currentGroup ? currentGroup.fields : [];
}

function scanDesignTokens() {
  const layoutSrc = readFile("src/theme/tokens.ts") || "";
  const factorySrc = readFile("src/theme/factory.ts") || "";

  return {
    layoutTokenBlocks: parseFlatTokenBlocks(layoutSrc),
    colorPalette: extractColorPalette(factorySrc),
    themeShape: extractThemeShape(factorySrc),
  };
}

// ─── UI components ─────────────────────────────────────────────────────

function extractPropsFields(src, propsTypeName) {
  const re = new RegExp(`interface ${propsTypeName}\\s*(?:extends [^\\{]+)?\\{([\\s\\S]*?)\\n\\}`);
  const m = src.match(re);
  if (!m) return [];
  const fields = [];
  const fieldRe = /^\s*(\w+)(\?)?:\s*(.+?);?\s*$/gm;
  let fm;
  while ((fm = fieldRe.exec(m[1]))) {
    fields.push({ name: fm[1], optional: !!fm[2], type: fm[3].replace(/;$/, "") });
  }
  return fields;
}

function scanUiLayer() {
  const categories = ["primitives", "blocks", "panels", "layouts"];
  const result = {};
  for (const cat of categories) {
    const files = walk(`src/ui/${cat}`, { exts: [".tsx"] }).filter((f) => !f.includes(".test."));
    result[cat] = files.map((f) => {
      const src = readFile(f) || "";
      const compName = path.basename(f, ".tsx");
      const exportFn = new RegExp(`export function ${compName}\\s*\\(`).test(src);
      const exportConst = new RegExp(`export const ${compName}\\s*[:=]`).test(src);
      const propsFields = extractPropsFields(src, `${compName}Props`);
      return {
        name: compName,
        file: f,
        exported: exportFn || exportConst,
        props: propsFields,
      };
    });
  }
  return result;
}

// ─── Service calls ─────────────────────────────────────────────────────

function scanServices() {
  const files = walk("src/services", { exts: [".ts"] }).filter((f) => !f.includes(".test."));
  const services = [];
  for (const f of files) {
    const src = readFile(f) || "";
    const className = path.basename(f, ".ts");

    const methods = [];
    // Matches only single-line signatures whose body brace opens at end of line,
    // so interface declarations (which end in `;`) are excluded even when their
    // return type itself contains literal `{ ... }` (e.g. Promise<Result<{ x: string }>>).
    const methodRe = /^\s{2}(?:async\s+)?(\w+)\(([^)]*)\):\s*(.+)\s\{$/gm;
    let mm;
    while ((mm = methodRe.exec(src))) {
      const [, name, , returnType] = mm;
      if (["constructor"].includes(name)) continue;
      methods.push({ name, returnType: returnType.trim() });
    }

    const protoCalls = [];
    const protoRe = /callProto<[^>]*>\(\s*\n?\s*["'`]([\w.]+)["'`]/g;
    let pm;
    while ((pm = protoRe.exec(src))) {
      protoCalls.push(pm[1]);
    }

    const directCalls = [];
    const directRe = /api\.(get|post|put|patch|delete)\(\s*["'`]([^"'`]+)["'`]/g;
    let dm;
    while ((dm = directRe.exec(src))) {
      directCalls.push({ method: dm[1].toUpperCase(), path: dm[2] });
    }

    if (methods.length || protoCalls.length || directCalls.length) {
      services.push({ name: className, file: f, methods, protoCalls, directCalls });
    }
  }
  return services;
}

// ─── Backend routes ─────────────────────────────────────────────────────

function scanProtoRouteManifest() {
  const src = readFile("src/generated/proto/route-manifest.json");
  if (!src) return [];
  const manifest = JSON.parse(src);
  return Object.entries(manifest).map(([key, def]) => ({
    key,
    service: key.split(".").slice(0, -1).join("."),
    method: def.method,
    path: def.path,
    requestType: def.requestType,
    responseType: def.responseType,
  }));
}

function scanKotlinRoutes() {
  const files = walk("server/src/main/kotlin/com/appforge/server/routing", { exts: [".kt"] });
  const routes = [];
  for (const f of files) {
    const src = readFile(f) || "";
    const baseMatches = [...src.matchAll(/route\("([^"]+)"\)/g)].map((m) => ({ path: m[1], index: m.index }));
    const verbRe = /\b(get|post|put|patch|delete)\((?:"([^"]*)")?\s*\)\s*\{/g;
    let vm;
    while ((vm = verbRe.exec(src))) {
      const [, verb, subPath] = vm;
      const preceding = baseMatches.filter((b) => b.index < vm.index);
      const nearest = preceding.length ? preceding[preceding.length - 1].path : null;
      routes.push({
        file: f,
        method: verb.toUpperCase(),
        path: subPath || "",
        baseHint: nearest,
      });
    }
  }
  return routes;
}

function scanBackendRoutes() {
  return {
    protoContract: scanProtoRouteManifest(),
    kotlinImplementation: scanKotlinRoutes(),
  };
}

// ─── Features (MVVM layers) ─────────────────────────────────────────────

function scanFeatures() {
  const featureDirs = fs
    .readdirSync(path.join(ROOT, "src/features"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  return featureDirs.map((name) => {
    const base = `src/features/${name}`;
    const layers = ["ui", "viewmodel", "usecases", "domain", "data", "services", "runtime"];
    const present = {};
    for (const layer of layers) {
      const dirPath = path.join(ROOT, base, layer);
      if (fs.existsSync(dirPath)) {
        present[layer] = walk(`${base}/${layer}`, { exts: [".ts", ".tsx"] }).filter(
          (f) => !f.includes(".test.") && !f.includes("__tests__"),
        );
      }
    }
    return { name, layers: present };
  });
}

// ─── Hooks ───────────────────────────────────────────────────────────

function scanHooks() {
  const files = walk("src/hooks", { exts: [".ts", ".tsx"] }).filter(
    (f) => !f.endsWith("index.ts") && !f.includes(".test."),
  );
  return files.map((f) => {
    const src = readFile(f) || "";
    const name = path.basename(f).replace(/\.tsx?$/, "");
    const fnMatch = src.match(new RegExp(`export function ${name}\\(([^)]*)\\)`));
    const params = fnMatch ? fnMatch[1].trim() : "";
    const returnFields = [];
    const returnMatch = src.match(/return\s*\{([^}]*)\}/);
    if (returnMatch) {
      const fieldRe = /(\w+)(?:,|\s*:)/g;
      let fm;
      while ((fm = fieldRe.exec(returnMatch[1]))) returnFields.push(fm[1]);
    }
    return { name, file: f, params, returnFields: [...new Set(returnFields)] };
  });
}

// ─── Providers ───────────────────────────────────────────────────────

function scanProviders() {
  const files = walk("src/providers", { exts: [".tsx"] }).filter((f) => !f.includes(".test."));
  return files.map((f) => {
    const src = readFile(f) || "";
    const name = path.basename(f, ".tsx");
    const hookExport = src.match(/export function (use\w+)\(/);
    const propsMatch = src.match(/export function \w+\(\{\s*([^}]*?)\s*\}:/);
    return {
      name,
      file: f,
      contextHook: hookExport ? hookExport[1] : null,
      props: propsMatch ? propsMatch[1].split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
  });
}

// ─── Core utilities ──────────────────────────────────────────────────

function scanCore() {
  const files = walk("src/core", { exts: [".ts"] }).filter(
    (f) => !f.endsWith("index.ts") && !f.includes(".test."),
  );
  const fns = [];
  for (const f of files) {
    const src = readFile(f) || "";
    const re = /export function (\w+)\(([^)]*)\)(?:\s*:\s*([^\{]+))?\{/g;
    let m;
    while ((m = re.exec(src))) {
      fns.push({ name: m[1], params: m[2].trim(), returnType: (m[3] || "").trim(), file: f });
    }
  }
  return fns;
}

// ─── Architecture (layering) ────────────────────────────────────────────
//
// Two independent layering systems are enforced in this repo:
//   1. UI composition layers   — docs/ui-layer-boundary.md
//   2. MVVM data-flow layers   — docs/mvvm-architecture-contract.md
// `npm run lint:arch` (scripts/check-layer-boundaries.js) enforces a subset
// of rule (2) plus app-scope isolation. We re-derive the same checks here,
// read-only, so violations show up in the visualizer instead of only at
// commit time.

function countFilesMatching(rel, exts) {
  return walk(rel, { exts }).filter((f) => !f.includes(".test.") && !f.includes("__tests__")).length;
}

function scanUiCompositionLayers() {
  return [
    {
      id: "tokens",
      label: "Design Tokens",
      path: "src/theme/**",
      rule: "Palette, spacing, typography, radii, elevation. No feature/route/service/viewmodel logic.",
      count: countFilesMatching("src/theme", [".ts", ".tsx"]),
    },
    {
      id: "shared-ui",
      label: "Shared UI",
      path: "src/ui/**",
      rule: "Tamagui config/provider, root barrel, and narrow behavior-oriented helpers. No repo-specific styling DSL.",
      count: countFilesMatching("src/ui", [".ts", ".tsx"]),
    },
    {
      id: "app-shared-ui",
      label: "App-Shared UI",
      path: "src/apps/<app>/ui/**",
      rule: "App-shared components, scaffolds, theme overrides. No repository/store/router imports.",
      count: countFilesMatching("src/apps", [".tsx"]) - countFilesMatching("src/apps/example-app/navigation", [".ts"]),
    },
    {
      id: "feature-ui",
      label: "Feature UI",
      path: "src/apps/<app>/features/**, src/features/**/ui",
      rule: "Feature composition and behavior wiring. Maps viewmodel state to visual layers.",
      count: countFilesMatching("src/features", [".tsx"]),
    },
    {
      id: "routes",
      label: "Routes",
      path: "app-example-app/**",
      rule: "Thin navigation wiring only. No visual styling or domain rendering.",
      count: countFilesMatching("app-example-app", [".tsx"]),
    },
  ];
}

function scanMvvmLayers() {
  return [
    {
      id: "view",
      label: "View",
      path: "src/features/*/views/*, src/features/*/ui/*",
      rule: "Dumb render only. Emits typed intents only. No service/API/storage imports.",
    },
    {
      id: "viewmodel",
      label: "ViewModel / Controller",
      path: "src/features/*/viewmodel/*, *Controller.ts",
      rule: "Owns UI state transitions. Calls use-cases only. No direct service/API imports.",
    },
    {
      id: "usecase",
      label: "UseCase",
      path: "src/features/*/usecases/*",
      rule: "One business action per use-case. Orchestrates repository methods. No UI imports.",
    },
    {
      id: "repository",
      label: "Repository",
      path: "src/features/*/data/*, src/features/*/domain/*",
      rule: "Stable feature data contract. Chooses datasource implementation(s). No view/viewmodel imports.",
    },
    {
      id: "datasource",
      label: "DataSource",
      path: "src/services/*",
      rule: "Transport/persistence details only. No feature UI imports.",
    },
    {
      id: "backend",
      label: "Backend (proto contract → Kotlin routes)",
      path: "src/generated/proto/route-manifest.json → server/.../routing/*.kt",
      rule: "Cross-process boundary. Client depends on the proto contract, not server internals.",
    },
  ];
}

const PROHIBITED_EDGES = [
  { from: "view", to: "datasource", reason: "view -> service: must go through viewmodel -> usecase -> repository" },
  { from: "view", to: "repository", reason: "view -> data layer: must go through viewmodel -> usecase" },
  { from: "viewmodel", to: "datasource", reason: "viewmodel -> service: must go through usecase -> repository" },
  { from: "viewmodel", to: "repository", reason: "viewmodel -> data layer: must go through usecase" },
  { from: "routes", to: "datasource", reason: "route -> service: routes must not import services directly" },
];

function detectFeatureLayers(featureName) {
  const base = `src/features/${featureName}`;
  const absBase = path.join(ROOT, base);
  const topLevelFiles = fs.existsSync(absBase)
    ? fs.readdirSync(absBase, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name)
    : [];

  const hasDir = (d) => fs.existsSync(path.join(absBase, d));

  return {
    view: hasDir("views") || hasDir("ui") || topLevelFiles.some((f) => /Surface\.tsx$|Screen\.tsx$/.test(f)),
    viewmodel: hasDir("viewmodel") || topLevelFiles.some((f) => /Controller\.ts$/.test(f)),
    usecase: hasDir("usecases"),
    repository: hasDir("domain") || hasDir("data"),
    datasource: hasDir("services"),
    runtime: hasDir("runtime"),
  };
}

function scanLayerViolations() {
  const violations = [];
  const roots = ["src", "app-example-app"];
  const files = roots.flatMap((r) => walk(r, { exts: [".ts", ".tsx"] }));

  for (const f of files) {
    const src = readFile(f) || "";
    // Matches scripts/check-layer-boundaries.js exactly: only `views/` is the
    // strictly-enforced View layer today. `src/features/**/ui` is the
    // documented Layer 6 in docs/ui-layer-boundary.md but lint:arch does not
    // yet check it — so it's excluded here to avoid false-positive violations.
    const isView = /src\/features\/.+\/views\/.+\.(ts|tsx)$/.test(f);
    const isViewModel = /src\/features\/.+\/viewmodel\/.+\.(ts|tsx)$/.test(f) || /Controller\.ts$/.test(f);
    const isRoute = /^app-example-app\/.+\.(ts|tsx)$/.test(f);

    if (isView) {
      if (/from\s+["'].*services\/.*["']/.test(src)) {
        violations.push({ file: f, edge: "view -> datasource", message: "view must not import services" });
      }
      if (/from\s+["'].*\/data\/.*["']/.test(src)) {
        violations.push({ file: f, edge: "view -> repository", message: "view must not import data layer" });
      }
    }
    if (isViewModel) {
      if (/from\s+["'].*services\/.*["']/.test(src)) {
        violations.push({ file: f, edge: "viewmodel -> datasource", message: "viewmodel/controller must not import services directly" });
      }
      if (/from\s+["'].*\/data\/.*["']/.test(src)) {
        violations.push({ file: f, edge: "viewmodel -> repository", message: "viewmodel/controller must not import data layer directly" });
      }
    }
    if (isRoute) {
      if (/from\s+["']\.\.\/(\.\.\/)?src\/services\/.*["']/.test(src)) {
        violations.push({ file: f, edge: "routes -> datasource", message: "route must not import services directly" });
      }
    }

    const appScope = (f.match(/^src\/apps\/([^/]+)\//) || [])[1] || null;
    const crossAppImport = (src.match(/from\s+["'][^"']*src\/apps\/([^/"']+)\//) || [])[1] || null;
    if (appScope && crossAppImport && crossAppImport !== appScope) {
      violations.push({ file: f, edge: "app-scope isolation", message: `app scope '${appScope}' must not import app scope '${crossAppImport}'` });
    }
    if (f.startsWith("src/") && !f.startsWith("src/apps/") && /from\s+["'][^"']*src\/apps\/[^/"']+\//.test(src)) {
      violations.push({ file: f, edge: "shared-src isolation", message: "shared src modules must not import app-specific src/apps modules" });
    }
  }

  return violations;
}

function scanArchitecture() {
  const featureDirs = fs
    .readdirSync(path.join(ROOT, "src/features"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  return {
    uiCompositionLayers: scanUiCompositionLayers(),
    mvvmLayers: scanMvvmLayers(),
    prohibitedEdges: PROHIBITED_EDGES,
    featureLayerMatrix: featureDirs.map((name) => ({ name, layers: detectFeatureLayers(name) })),
    violations: scanLayerViolations(),
  };
}

export function scanAll() {
  return {
    generatedAt: new Date().toISOString(),
    architecture: scanArchitecture(),
    screens: scanScreens(),
    designTokens: scanDesignTokens(),
    ui: scanUiLayer(),
    services: scanServices(),
    backendRoutes: scanBackendRoutes(),
    features: scanFeatures(),
    hooks: scanHooks(),
    providers: scanProviders(),
    core: scanCore(),
  };
}
