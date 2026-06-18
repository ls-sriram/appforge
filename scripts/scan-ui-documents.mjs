/**
 * scan-ui-documents.mjs
 *
 * Scans *.layout.tsx files in a target app and emits a typed UiDocument[]
 * snapshot for the visual editor.
 *
 * Layout files use only AppForge primitives + block references (from
 * src/blocks/index.tsx). The scanner:
 *   1. Pre-scans src/blocks/index.tsx to build a block registry
 *   2. Scans *.layout.tsx files — one UiDocument per file
 *   3. Expands block references inline using the registry
 *
 * Usage:
 *   node scripts/scan-ui-documents.mjs [appId]
 *
 * Output: src/generated/ui-documents.<appId>.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Component type map ────────────────────────────────────────────────────────

const COMPONENT_MAP = {
  YStack:       "YStack",
  XStack:       "XStack",
  View:         "View",
  Heading:      "Heading",
  Display:      "Heading",
  Body:         "Body",
  Label:        "Label",
  Button:       "Button",
  Tag:          "Tag",
  Icon:         "Icon",
  SafeAreaView: "YStack",
};

const VISUAL_PROPS = new Set([
  "bg", "color", "borderColor", "borderWidth",
  "br", "p", "px", "py", "pt", "pb", "pl", "pr",
  "gap", "ai", "jc", "f", "flexWrap", "flexShrink",
  "w", "h", "maxWidth", "minWidth", "maxHeight", "minHeight",
  "fontFamily", "fontSize", "ta", "tt", "letterSpacing", "opacity",
  "tone", "size", "weight", "variant", "label",
]);

// Populated by buildBlockRegistry() before layout scanning begins.
let BLOCK_REGISTRY = {};

// Populated per-file: maps destructured param name → default string value.
let PARAM_DEFAULTS = {};

// ── AST helpers ───────────────────────────────────────────────────────────────

function getElementName(nameNode) {
  if (nameNode.type === "JSXIdentifier") return nameNode.name;
  if (nameNode.type === "JSXMemberExpression") return nameNode.property.name;
  return "";
}

function extractPropValue(attr) {
  if (attr.type !== "JSXAttribute") return null;
  const name = typeof attr.name.name === "string" ? attr.name.name : null;
  if (!name || !VISUAL_PROPS.has(name)) return null;
  if (!attr.value) return { name, value: true };
  if (attr.value.type === "StringLiteral") return { name, value: attr.value.value };
  if (attr.value.type === "JSXExpressionContainer") {
    const expr = attr.value.expression;
    if (expr.type === "NumericLiteral") return { name, value: expr.value };
    if (expr.type === "StringLiteral")  return { name, value: expr.value };
    if (expr.type === "UnaryExpression" && expr.operator === "-" && expr.argument.type === "NumericLiteral") {
      return { name, value: -expr.argument.value };
    }
    const resolved = resolveExpressionText(expr);
    if (resolved !== null) return { name, value: resolved };
  }
  return null;
}

function resolveExpressionText(expr) {
  if (expr.type === "StringLiteral") return expr.value;
  if (expr.type === "NumericLiteral") return String(expr.value);
  if (expr.type === "Identifier" && PARAM_DEFAULTS[expr.name] !== undefined) {
    return PARAM_DEFAULTS[expr.name];
  }
  // "saving ? savingLabel : saveLabel" — pick consequent default
  if (expr.type === "ConditionalExpression") {
    const alt = resolveExpressionText(expr.alternate);
    return alt ?? resolveExpressionText(expr.consequent) ?? "[dynamic]";
  }
  // template literal with no expressions
  if (expr.type === "TemplateLiteral" && expr.expressions.length === 0) {
    return expr.quasis[0]?.value.cooked ?? "[dynamic]";
  }
  return null;
}

function extractTextFromChildren(children) {
  const parts = [];
  for (const child of children) {
    if (child.type === "JSXText") {
      const t = child.value.replace(/\s+/g, " ");
      if (t !== " " || parts.length > 0) parts.push(t);
    } else if (child.type === "JSXExpressionContainer") {
      if (child.expression.type === "JSXEmptyExpression") continue;
      const resolved = resolveExpressionText(child.expression);
      parts.push(resolved ?? "[dynamic]");
    } else if (child.type === "JSXElement") {
      const t = extractTextFromChildren(child.children);
      if (t) parts.push(t);
    }
  }
  return parts.join("").trim() || undefined;
}

// ── JSX walker ────────────────────────────────────────────────────────────────

let idCounter = 0;

// Unwraps ui("id", <Element />) → <Element />, transparently for the scanner.
function unwrapUi(node) {
  if (
    node &&
    node.type === "CallExpression" &&
    node.callee.type === "Identifier" &&
    node.callee.name === "ui" &&
    node.arguments.length >= 2
  ) {
    return node.arguments[1];
  }
  return node;
}

function walkJsxChildren(children, parentId, nodes, prefix) {
  const childIds = [];
  for (const child of children) {
    if (child.type === "JSXElement" || child.type === "JSXFragment") {
      const id = walkJsxElement(child, parentId, nodes, prefix);
      if (id) childIds.push(id);
    } else if (child.type === "JSXExpressionContainer") {
      const expr = child.expression;
      if (expr.type === "JSXEmptyExpression" || expr.type === "NullLiteral") continue;
      const unwrapped = unwrapUi(expr);
      if (unwrapped && (unwrapped.type === "JSXElement" || unwrapped.type === "JSXFragment")) {
        const id = walkJsxElement(unwrapped, parentId, nodes, prefix);
        if (id) childIds.push(id);
      } else {
        const id = `${prefix}-${idCounter++}`;
        nodes[id] = { id, type: "View", props: { bg: "$surfaceAlt", h: 32, br: "$2", opacity: 0.3 }, children: [], parentId };
        childIds.push(id);
      }
    }
  }
  return childIds;
}

function walkJsxElement(jsxElement, parentId, nodes, prefix) {
  if (jsxElement.type === "JSXFragment") {
    const id = `${prefix}-${idCounter++}`;
    const childIds = walkJsxChildren(jsxElement.children, id, nodes, prefix);
    nodes[id] = { id, type: "View", props: {}, children: childIds, parentId };
    return id;
  }

  const openEl = jsxElement.openingElement;
  const elementName = getElementName(openEl.name);

  // ── Block expansion ──
  if (BLOCK_REGISTRY[elementName]) {
    return expandBlock(elementName, parentId, nodes, prefix);
  }

  const mappedType = COMPONENT_MAP[elementName];

  // ── Unknown component → dim placeholder ──
  if (!mappedType) {
    const id = `${prefix}-${idCounter++}`;
    nodes[id] = { id, type: "View", props: { bg: "$surfaceAlt", h: 40, br: "$2", opacity: 0.35 }, children: [], parentId };
    return id;
  }

  const id = `${prefix}-${idCounter++}`;
  const props = {};
  for (const attr of openEl.attributes) {
    const extracted = extractPropValue(attr);
    if (extracted) props[extracted.name] = extracted.value;
  }

  // Leaf nodes
  if (mappedType === "Heading" || mappedType === "Body" || mappedType === "Label") {
    const text = extractTextFromChildren(jsxElement.children);
    if (text) props.text = text;
    nodes[id] = { id, type: mappedType, props, children: [], parentId };
    return id;
  }

  if (mappedType === "Button") {
    // Prefer label prop (semantic API); fall back to first Body/Label child (legacy).
    if (props.label !== undefined) {
      props.text = props.label;
      delete props.label;
    } else {
      for (const child of jsxElement.children) {
        if (child.type !== "JSXElement") continue;
        const childName = getElementName(child.openingElement.name);
        if (childName === "Body" || childName === "Label") {
          const text = extractTextFromChildren(child.children);
          if (text) props.text = text;
          break;
        }
      }
    }
    if (!props.variant) props.variant = "primary";
    nodes[id] = { id, type: "Button", props, children: [], parentId };
    return id;
  }

  if (mappedType === "Tag" || mappedType === "Icon") {
    for (const attr of openEl.attributes) {
      if (attr.type === "JSXAttribute" && attr.name.name === "name" && attr.value?.type === "StringLiteral") {
        props.icon = attr.value.value;
      }
    }
    nodes[id] = { id, type: mappedType, props, children: [], parentId };
    return id;
  }

  // Container nodes
  const childIds = walkJsxChildren(jsxElement.children, id, nodes, prefix);
  nodes[id] = { id, type: mappedType, props, children: childIds, parentId };
  return id;
}

// ── Block expansion ───────────────────────────────────────────────────────────

function expandBlock(blockName, parentId, nodes, prefix) {
  const block = BLOCK_REGISTRY[blockName];
  const idMap = {};

  // Assign new scoped IDs
  for (const oldId of Object.keys(block.nodes)) {
    idMap[oldId] = `${prefix}-${idCounter++}`;
  }

  // Insert remapped nodes
  for (const [oldId, bNode] of Object.entries(block.nodes)) {
    const newId = idMap[oldId];
    nodes[newId] = {
      ...bNode,
      id: newId,
      children: bNode.children.map((c) => idMap[c] ?? c),
      parentId: bNode.parentId ? (idMap[bNode.parentId] ?? bNode.parentId) : parentId,
    };
  }

  return idMap[block.rootId];
}

// ── Block registry builder ────────────────────────────────────────────────────
// Parses src/blocks/index.tsx and pre-builds a node tree for each exported
// function. Layout files can then reference <ProfileCard /> and the scanner
// expands it inline — no import following needed at scan time.

function buildBlockRegistry() {
  const blocksFile = path.join(ROOT, "src/blocks/index.tsx");
  if (!fs.existsSync(blocksFile)) return {};

  const source = fs.readFileSync(blocksFile, "utf-8");
  let ast;
  try {
    ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (e) {
    console.warn(`[scan] Could not parse blocks/index.tsx: ${e.message}`);
    return {};
  }

  const registry = {};

  for (const node of ast.program.body) {
    if (node.type !== "ExportNamedDeclaration" || !node.declaration) continue;
    const decl = node.declaration;

    let componentName = null;
    let returnJsx = null;

    if (decl.type === "FunctionDeclaration") {
      componentName = decl.id?.name;
      returnJsx = findMainReturn(decl.body);
    } else if (decl.type === "VariableDeclaration") {
      for (const declarator of decl.declarations) {
        const init = declarator.init;
        if (!init) continue;
        if (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression") {
          componentName = declarator.id.name;
          returnJsx = init.body.type === "BlockStatement"
            ? findMainReturn(init.body)
            : init.body;
        }
      }
    }

    if (!componentName || !returnJsx) continue;

    const nodes = {};
    idCounter = 0;
    const rootId = walkJsxElement(returnJsx, undefined, nodes, componentName.toLowerCase().replace(/[^a-z0-9]/g, "-"));

    // Strip parentId from root so it connects correctly when expanded
    if (nodes[rootId]) delete nodes[rootId].parentId;

    registry[componentName] = { rootId, nodes };
    console.log(`[scan]  block: ${componentName} (${Object.keys(nodes).length} nodes)`);
  }

  return registry;
}

// ── Param default extractor ───────────────────────────────────────────────────
// Reads destructured defaults from the first ObjectPattern param, e.g.:
//   function Foo({ title = "Login", loading = false }: Props)
// Produces { title: "Login" } — string defaults only.

function extractParamDefaults(funcNode) {
  const defaults = {};
  const params = funcNode.params ?? [];
  for (const param of params) {
    if (param.type !== "ObjectPattern") continue;
    for (const prop of param.properties) {
      if (prop.type !== "ObjectProperty") continue;
      const key = prop.key?.name;
      const val = prop.value;
      if (!key || !val) continue;
      // { title = "Login" } → AssignmentPattern { left: Identifier, right: StringLiteral }
      if (val.type === "AssignmentPattern" && val.right.type === "StringLiteral") {
        defaults[key] = val.right.value;
      }
    }
  }
  return defaults;
}

// ── Return finder ─────────────────────────────────────────────────────────────

function findMainReturn(blockStatement) {
  let last = null;
  for (const stmt of blockStatement.body) {
    if (stmt.type === "ReturnStatement" && stmt.argument) {
      last = stmt.argument;
    }
  }
  return last;
}

// ── File discovery ────────────────────────────────────────────────────────────

function findLayoutFiles(appDir) {
  const results = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".layout.tsx")) results.push(full);
    }
  }
  walk(appDir);
  return results;
}

function screenIdFromFile(filePath) {
  // home.layout.tsx → "home", forgot-password.layout.tsx → "forgotpassword"
  const base = path.basename(filePath, ".layout.tsx");
  return base.replace(/-/g, "").toLowerCase();
}

function screenNameFromId(id) {
  const overrides = { forgotpassword: "Forgot Password" };
  return overrides[id] ?? (id.charAt(0).toUpperCase() + id.slice(1));
}

// ── Layout file parser ────────────────────────────────────────────────────────

function parseLayoutFile(filePath) {
  idCounter = 0;
  const source = fs.readFileSync(filePath, "utf-8");
  const screenId = screenIdFromFile(filePath);
  const prefix = screenId;

  let ast;
  try {
    ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (e) {
    console.warn(`[scan] Parse error in ${path.relative(ROOT, filePath)}: ${e.message}`);
    return null;
  }

  let returnJsx = null;
  PARAM_DEFAULTS = {};

  for (const node of ast.program.body) {
    if (node.type !== "ExportNamedDeclaration" || !node.declaration) continue;
    const decl = node.declaration;

    if (decl.type === "FunctionDeclaration" && decl.body) {
      PARAM_DEFAULTS = extractParamDefaults(decl);
      returnJsx = findMainReturn(decl.body);
    } else if (decl.type === "VariableDeclaration") {
      for (const declarator of decl.declarations) {
        const init = declarator.init;
        if (!init) continue;
        if (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression") {
          PARAM_DEFAULTS = extractParamDefaults(init);
          returnJsx = init.body.type === "BlockStatement" ? findMainReturn(init.body) : init.body;
        }
      }
    }
    if (returnJsx) break;
  }

  if (!returnJsx) {
    console.warn(`[scan] No JSX return in ${path.relative(ROOT, filePath)}`);
    return null;
  }

  // Unwrap top-level ui("id", <Element />) call if present.
  returnJsx = unwrapUi(returnJsx) ?? returnJsx;

  const nodes = {};
  const rootId = walkJsxElement(returnJsx, undefined, nodes, prefix);

  return {
    id: screenId,
    name: screenNameFromId(screenId),
    description: `Scanned from ${path.basename(filePath)}`,
    rootId,
    nodes,
  };
}

// ── Code generation ───────────────────────────────────────────────────────────

function generateTs(documents) {
  const body = JSON.stringify(documents, null, 2)
    .replace(/"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:/g, "$1:");
  return `// AUTO-GENERATED by scripts/scan-ui-documents.mjs — do not edit manually.
// Run: node scripts/scan-ui-documents.mjs <appId>
import type { UiDocument } from "../apps/appforge-site/features/ui-visualizer/domain/ui-document.types";

export const SCANNED_UI_DOCUMENTS: UiDocument[] = ${body};
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const appId = process.argv[2] ?? process.env.npm_config_app ?? "example-app";
const appDir = path.join(ROOT, "src", "apps", appId);

if (!fs.existsSync(appDir)) {
  console.error(`[scan] App directory not found: ${appDir}`);
  process.exit(1);
}

console.log(`[scan] Building block registry from src/blocks/index.tsx…`);
BLOCK_REGISTRY = buildBlockRegistry();

const layoutFiles = findLayoutFiles(appDir);
console.log(`[scan] Found ${layoutFiles.length} layout files in ${appId}/`);

const documents = [];
for (const file of layoutFiles) {
  const rel = path.relative(ROOT, file);
  const doc = parseLayoutFile(file);
  if (doc) {
    const nodeCount = Object.keys(doc.nodes).length;
    console.log(`[scan]  ✓ ${rel} → ${doc.id} (${nodeCount} nodes)`);
    documents.push(doc);
  } else {
    console.log(`[scan]  ✗ ${rel} — skipped`);
  }
}

const outPath = path.join(ROOT, "src", "generated", `ui-documents.${appId}.ts`);
fs.writeFileSync(outPath, generateTs(documents), "utf-8");
console.log(`[scan] Wrote ${path.relative(ROOT, outPath)} (${documents.length} documents)`);
