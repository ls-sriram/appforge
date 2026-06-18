import type {
  CustomBlockDef,
  UiComponentLibraryItem,
  UiComponentType,
  UiDocument,
  UiNode,
  UiNodeProps,
  UiPreviewState,
  UiPropField,
} from "./ui-document.types";

const TONE_OPTIONS = [
  "muted",
  "secondary",
  "accent",
  "action",
  "success",
  "warning",
  "danger",
  "info",
  "inverse",
  "brand",
];

export const UI_COMPONENT_LIBRARY: UiComponentLibraryItem[] = [
  { type: "YStack",       label: "Y Stack",      icon: "list",     container: true,  defaults: { gap: "$3", p: "$3" } },
  { type: "XStack",       label: "X Stack",      icon: "list",     container: true,  defaults: { gap: "$3", p: "$3", ai: "center" } },
  { type: "View",         label: "Surface",      icon: "table",    container: true,  defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$3" } },
  { type: "Display",      label: "Display",      icon: "zap",      container: false, defaults: { text: "Display" } },
  { type: "Heading",      label: "Heading",      icon: "zap",      container: false, defaults: { text: "Section heading" } },
  { type: "Body",         label: "Body",         icon: "book",     container: false, defaults: { text: "Body copy", color: "$textMuted" } },
  { type: "Label",        label: "Label",        icon: "info",     container: false, defaults: { text: "Label", color: "$textMuted", tt: "uppercase" } },
  { type: "Button",       label: "Button",       icon: "check",    container: false, defaults: { text: "Continue", bg: "$primary" } },
  { type: "Tag",          label: "Tag",          icon: "shield",   container: false, defaults: { label: "Badge", tone: "info" } },
  { type: "Icon",         label: "Icon",         icon: "flask",    container: false, defaults: { icon: "flask", tone: "info", size: "lg" } },
  { type: "Avatar",       label: "Avatar",       icon: "user",     container: false, defaults: { initials: "AB" } },
  { type: "Badge",        label: "Badge",        icon: "shield",   container: false, defaults: { text: "New", tone: "info" } },
  { type: "Input",        label: "Input",        icon: "settings", container: false, defaults: { placeholder: "Enter text…" } },
  { type: "TextArea",     label: "Text Area",    icon: "settings", container: false, defaults: { placeholder: "Enter text…" } },
  { type: "SelectableChip", label: "Chip",       icon: "check",    container: false, defaults: { text: "Option", selected: false } },
  { type: "ProgressBar",  label: "Progress Bar", icon: "activity", container: false, defaults: { value: 60, tone: "primary" } },
];

export type SemanticBlockCategory = "layout" | "data" | "feedback" | "input" | "primitives";

export interface SemanticBlock {
  id: string;
  label: string;
  category: SemanticBlockCategory;
  type: UiComponentType;
  defaults: UiNodeProps;
}

export const UI_BLOCK_LIBRARY: SemanticBlock[] = [
  // ── Layout ──
  { id: "nav-bar",       label: "Nav bar",      category: "layout",     type: "XStack",       defaults: { ai: "center", gap: "$2", bg: "$surfaceAlt", px: "$3", py: "$2", borderColor: "$borderSubtle", borderWidth: 1, br: "$3" } },
  { id: "hero",          label: "Hero",         category: "layout",     type: "View",         defaults: { bg: "$surfaceStrong", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$4" } },
  { id: "section",       label: "Section",      category: "layout",     type: "YStack",       defaults: { gap: "$3", p: "$3" } },
  // ── Data ──
  { id: "list",          label: "List",         category: "data",       type: "YStack",       defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3" } },
  { id: "card",          label: "Card",         category: "data",       type: "View",         defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$3" } },
  { id: "table",         label: "Table",        category: "data",       type: "YStack",       defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", gap: "$1" } },
  // ── Feedback ──
  { id: "status",        label: "Status",       category: "feedback",   type: "View",         defaults: { bg: "$errorMuted", borderColor: "$error", borderWidth: 1, br: "$3", p: "$3" } },
  { id: "empty",         label: "Empty",        category: "feedback",   type: "YStack",       defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$5", ai: "center", gap: "$2" } },
  { id: "skeleton",      label: "Skeleton",     category: "feedback",   type: "YStack",       defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$3", gap: "$2" } },
  // ── Input ──
  { id: "form",          label: "Form",         category: "input",      type: "YStack",       defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$4", gap: "$3" } },
  { id: "action",        label: "Action",       category: "input",      type: "Button",       defaults: { text: "Continue", bg: "$primary" } },
  { id: "search",        label: "Search",       category: "input",      type: "XStack",       defaults: { bg: "$surfaceAlt", borderColor: "$border", borderWidth: 1, br: 999, px: "$3", py: "$2", ai: "center", gap: "$2" } },
  // ── Primitives ──
  { id: "avatar",        label: "Avatar",       category: "primitives", type: "Avatar",       defaults: { initials: "AB" } },
  { id: "badge",         label: "Badge",        category: "primitives", type: "Badge",        defaults: { text: "New", tone: "info" } },
  { id: "progress-bar",  label: "Progress bar", category: "primitives", type: "ProgressBar",  defaults: { value: 60, tone: "primary" } },
  { id: "input-field",   label: "Input",        category: "primitives", type: "Input",        defaults: { placeholder: "Enter text…" } },
  { id: "chip",          label: "Chip",         category: "primitives", type: "SelectableChip", defaults: { text: "Option", selected: false } },
  { id: "display-text",  label: "Display",      category: "primitives", type: "Display",      defaults: { text: "Display Heading" } },
];

const FIELD_MAP: Record<UiComponentType, UiPropField[]> = {
  View: [
    { key: "bg",          label: "Background",   type: "token" },
    { key: "borderColor", label: "Border",       type: "token" },
    { key: "borderWidth", label: "Border Width", type: "number" },
    { key: "br",          label: "Radius",       type: "token" },
    { key: "p",           label: "Padding",      type: "token" },
    { key: "px",          label: "Pad X",        type: "token" },
    { key: "py",          label: "Pad Y",        type: "token" },
    { key: "w",           label: "Width",        type: "text" },
    { key: "h",           label: "Height",       type: "text" },
  ],
  XStack: [
    { key: "gap", label: "Gap",     type: "token" },
    { key: "ai",  label: "Align",   type: "enum", options: ["flex-start", "center", "flex-end", "stretch"] },
    { key: "jc",  label: "Justify", type: "enum", options: ["flex-start", "center", "flex-end", "space-between"] },
    { key: "bg",  label: "Background", type: "token" },
    { key: "p",   label: "Padding", type: "token" },
    { key: "px",  label: "Pad X",   type: "token" },
    { key: "py",  label: "Pad Y",   type: "token" },
  ],
  YStack: [
    { key: "gap",         label: "Gap",          type: "token" },
    { key: "bg",          label: "Background",   type: "token" },
    { key: "p",           label: "Padding",      type: "token" },
    { key: "px",          label: "Pad X",        type: "token" },
    { key: "py",          label: "Pad Y",        type: "token" },
    { key: "borderColor", label: "Border",       type: "token" },
    { key: "borderWidth", label: "Border Width", type: "number" },
    { key: "br",          label: "Radius",       type: "token" },
  ],
  Display: [
    { key: "text",  label: "Text",  type: "text" },
    { key: "tone",  label: "Tone",  type: "enum", options: TONE_OPTIONS },
  ],
  Heading: [
    { key: "text",       label: "Text",  type: "text" },
    { key: "tone",       label: "Tone",  type: "enum", options: TONE_OPTIONS },
    { key: "size",       label: "Size",  type: "enum", options: ["sm", "md", "lg", "xl", "display"] },
    { key: "weight",     label: "Weight", type: "enum", options: ["regular", "bold"] },
  ],
  Body: [
    { key: "text",   label: "Text",   type: "text" },
    { key: "tone",   label: "Tone",   type: "enum", options: TONE_OPTIONS },
    { key: "size",   label: "Size",   type: "enum", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
    { key: "weight", label: "Weight", type: "enum", options: ["regular", "bold"] },
  ],
  Label: [
    { key: "text",          label: "Text",      type: "text" },
    { key: "tone",          label: "Tone",      type: "enum", options: TONE_OPTIONS },
    { key: "tt",            label: "Transform", type: "enum", options: ["none", "uppercase"] },
    { key: "letterSpacing", label: "Spacing",   type: "number" },
  ],
  Button: [
    { key: "text",        label: "Label",        type: "text" },
    { key: "bg",          label: "Background",   type: "token" },
    { key: "borderColor", label: "Border",       type: "token" },
    { key: "borderWidth", label: "Border Width", type: "number" },
    { key: "opacity",     label: "Opacity",      type: "number" },
  ],
  Tag: [
    { key: "label", label: "Label", type: "text" },
    { key: "tone",  label: "Tone",  type: "enum", options: TONE_OPTIONS },
  ],
  Icon: [
    { key: "icon", label: "Icon", type: "enum", options: ["flask", "home", "user", "table", "list", "check", "shield", "zap", "info", "settings", "activity", "mic", "calendar"] },
    { key: "tone", label: "Tone", type: "enum", options: TONE_OPTIONS },
    { key: "size", label: "Size", type: "enum", options: ["sm", "md", "lg", "xl", "2xl"] },
  ],
  Avatar: [
    { key: "initials", label: "Initials", type: "text" },
  ],
  Badge: [
    { key: "text", label: "Label", type: "text" },
    { key: "tone", label: "Tone",  type: "enum", options: ["success", "warning", "danger", "info", "muted"] },
  ],
  Input: [
    { key: "placeholder", label: "Placeholder", type: "text" },
  ],
  TextArea: [
    { key: "placeholder", label: "Placeholder", type: "text" },
  ],
  SelectableChip: [
    { key: "text",     label: "Label",    type: "text" },
    { key: "selected", label: "Selected", type: "boolean" },
    { key: "size",     label: "Size",     type: "enum", options: ["sm", "md"] },
  ],
  ProgressBar: [
    { key: "value", label: "Value (0–100)", type: "number" },
    { key: "tone",  label: "Tone",          type: "enum", options: ["primary", "success", "warning", "danger"] },
  ],
};

export function getPropFields(type: UiComponentType): UiPropField[] {
  return FIELD_MAP[type] ?? [];
}

export function getComponentDefinition(type: UiComponentType) {
  return UI_COMPONENT_LIBRARY.find((item) => item.type === type) ?? UI_COMPONENT_LIBRARY[0];
}

export function isContainerType(type: UiComponentType) {
  return getComponentDefinition(type).container;
}

export function materializeDocumentState(document: UiDocument, state: UiPreviewState): UiDocument {
  const layout = document.stateLayouts?.[state];
  if (!layout) return document;
  return {
    ...document,
    nodes: {
      ...document.nodes,
      [document.rootId]: {
        ...document.nodes[document.rootId],
        children: layout,
      },
    },
  };
}

export function getReachableNodeIds(document: UiDocument) {
  const visited = new Set<string>();
  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    const node = document.nodes[nodeId];
    if (!node) return;
    visited.add(nodeId);
    node.children.forEach(visit);
  }
  visit(document.rootId);
  return Array.from(visited);
}

export function getComponentUsage(document: UiDocument) {
  const counts = new Map<UiComponentType, number>();
  getReachableNodeIds(document).forEach((nodeId) => {
    const node = document.nodes[nodeId];
    if (!node) return;
    counts.set(node.type, (counts.get(node.type) ?? 0) + 1);
  });
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
}

export function createNode(type: UiComponentType): UiNode {
  const definition = getComponentDefinition(type);
  const id = `node_${Math.random().toString(36).slice(2, 9)}`;
  return { id, type, props: { ...definition.defaults }, children: [] };
}

function cloneDocument(document: UiDocument): UiDocument {
  return {
    ...document,
    nodes: Object.fromEntries(
      Object.entries(document.nodes).map(([id, node]) => [
        id,
        { ...node, props: { ...node.props }, children: [...node.children] },
      ]),
    ),
  };
}

export function addBlockNode(
  document: UiDocument,
  blockId: string,
  selectedNodeId?: string,
): UiDocument {
  const block = UI_BLOCK_LIBRARY.find((b) => b.id === blockId);
  if (!block) return document;
  const next = cloneDocument(document);
  const id = `node_${Math.random().toString(36).slice(2, 9)}`;
  const newNode: UiNode = { id, type: block.type, props: { ...block.defaults }, children: [] };
  const selected = selectedNodeId ? next.nodes[selectedNodeId] : undefined;
  const targetId =
    selected && isContainerType(selected.type)
      ? selected.id
      : selected?.parentId ?? next.rootId;
  const target = next.nodes[targetId];
  newNode.parentId = target.id;
  target.children = [...target.children, newNode.id];
  next.nodes[newNode.id] = newNode;
  return next;
}

export function addNode(document: UiDocument, type: UiComponentType, selectedNodeId?: string): UiDocument {
  const next = cloneDocument(document);
  const newNode = createNode(type);
  const selected = selectedNodeId ? next.nodes[selectedNodeId] : undefined;
  const targetId =
    selected && isContainerType(selected.type)
      ? selected.id
      : selected?.parentId ?? next.rootId;
  const target = next.nodes[targetId];
  newNode.parentId = target.id;
  target.children = [...target.children, newNode.id];
  next.nodes[newNode.id] = newNode;
  return next;
}

// ── Custom block operations ────────────────────────────────────────────────────

export function extractSubtreeAsBlock(
  document: UiDocument,
  nodeId: string,
): { rootId: string; nodes: Record<string, UiNode> } {
  const idMap: Record<string, string> = {};

  function assignIds(id: string) {
    idMap[id] = `b_${Math.random().toString(36).slice(2, 7)}`;
    const node = document.nodes[id];
    if (node) node.children.forEach(assignIds);
  }
  assignIds(nodeId);

  const nodes: Record<string, UiNode> = {};
  for (const [oldId, newId] of Object.entries(idMap)) {
    const node = document.nodes[oldId];
    if (!node) continue;
    nodes[newId] = {
      id: newId,
      type: node.type,
      props: { ...node.props },
      children: node.children.map((c) => idMap[c] ?? c),
      ...(oldId !== nodeId && node.parentId ? { parentId: idMap[node.parentId] ?? node.parentId } : {}),
    };
  }

  return { rootId: idMap[nodeId], nodes };
}

export function insertCustomBlockNode(
  document: UiDocument,
  block: CustomBlockDef,
  selectedNodeId?: string,
): UiDocument {
  const next = cloneDocument(document);
  const idMap: Record<string, string> = {};
  for (const id of Object.keys(block.nodes)) {
    idMap[id] = `node_${Math.random().toString(36).slice(2, 9)}`;
  }

  for (const [oldId, node] of Object.entries(block.nodes)) {
    const newId = idMap[oldId];
    next.nodes[newId] = {
      ...node,
      id: newId,
      children: node.children.map((c) => idMap[c] ?? c),
      ...(oldId !== block.rootId && node.parentId
        ? { parentId: idMap[node.parentId] ?? node.parentId }
        : {}),
    };
  }

  const newRootId = idMap[block.rootId];
  const selected = selectedNodeId ? next.nodes[selectedNodeId] : undefined;
  const targetId =
    selected && isContainerType(selected.type)
      ? selected.id
      : selected?.parentId ?? next.rootId;
  const target = next.nodes[targetId];
  next.nodes[newRootId].parentId = targetId;
  target.children = [...target.children, newRootId];
  return next;
}

export function removeNode(document: UiDocument, nodeId: string): UiDocument {
  if (nodeId === document.rootId) return document;
  const next = cloneDocument(document);
  const target = next.nodes[nodeId];
  if (!target) return document;
  const idsToRemove = new Set<string>();
  function collect(id: string) {
    idsToRemove.add(id);
    next.nodes[id]?.children.forEach(collect);
  }
  collect(nodeId);
  if (target.parentId && next.nodes[target.parentId]) {
    next.nodes[target.parentId].children = next.nodes[target.parentId].children.filter((c) => c !== nodeId);
  }
  idsToRemove.forEach((id) => { delete next.nodes[id]; });
  return next;
}

export function updateNodeProps(document: UiDocument, nodeId: string, patch: Partial<UiNodeProps>): UiDocument {
  const next = cloneDocument(document);
  if (!next.nodes[nodeId]) return document;
  next.nodes[nodeId] = {
    ...next.nodes[nodeId],
    props: { ...next.nodes[nodeId].props, ...patch },
  };
  return next;
}

export function serializeDocument(document: UiDocument) {
  function serializeNode(nodeId: string, depth: number): string[] {
    const node = document.nodes[nodeId];
    if (!node) return [];
    const indent = "  ".repeat(depth);
    const props = Object.entries(node.props)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) =>
        typeof value === "number" || typeof value === "boolean"
          ? `${key}={${value}}`
          : `${key}=${JSON.stringify(value)}`,
      );

    if (node.type === "Icon") return [`${indent}<Icon ${props.join(" ")} />`];
    if (node.type === "Tag")  return [`${indent}<Tag ${props.join(" ")} />`];
    if (node.type === "Avatar") return [`${indent}<Avatar ${props.join(" ")} />`];
    if (node.type === "Badge") {
      const label = node.props.text ?? "Badge";
      const rest = props.filter((p) => !p.startsWith("text="));
      return [`${indent}<Badge label=${JSON.stringify(label)} ${rest.join(" ")} />`];
    }
    if (node.type === "Input" || node.type === "TextArea") {
      return [`${indent}<${node.type} ${props.join(" ")} />`];
    }
    if (node.type === "SelectableChip") {
      const label = node.props.text ?? "Option";
      const rest = props.filter((p) => !p.startsWith("text="));
      return [`${indent}<SelectableChip label=${JSON.stringify(label)} ${rest.join(" ")} onPress={() => {}} />`];
    }
    if (node.type === "ProgressBar") return [`${indent}<ProgressBar ${props.join(" ")} />`];
    if (node.type === "Button") {
      return [
        `${indent}<Button ${props.filter((p) => !p.startsWith("text=")).join(" ")}>`,
        `${indent}  <Body color="$textInverse" fontFamily="$bold">${node.props.text ?? "Button"}</Body>`,
        `${indent}</Button>`,
      ];
    }
    if (node.type === "Display" || node.type === "Heading" || node.type === "Body" || node.type === "Label") {
      const text = node.props.text ?? node.type;
      return [`${indent}<${node.type} ${props.filter((p) => !p.startsWith("text=")).join(" ")}>${text}</${node.type}>`];
    }
    if (node.children.length === 0) return [`${indent}<${node.type} ${props.join(" ")} />`];
    return [
      `${indent}<${node.type} ${props.join(" ")}>`,
      ...node.children.flatMap((childId) => serializeNode(childId, depth + 1)),
      `${indent}</${node.type}>`,
    ];
  }

  return [
    'import { Avatar, Badge, Body, Button, Display, Heading, Icon, Input, Label, ProgressBar, SelectableChip, Tag, TextArea, View, XStack, YStack } from "src/ui";',
    "",
    "export function PlaygroundPreview() {",
    "  return (",
    ...serializeNode(document.rootId, 2),
    "  );",
    "}",
  ].join("\n");
}
