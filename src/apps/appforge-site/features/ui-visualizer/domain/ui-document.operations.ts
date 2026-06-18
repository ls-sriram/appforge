import type {
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
  { type: "YStack", label: "Y Stack", icon: "list", container: true, defaults: { gap: "$3", p: "$3" } },
  { type: "XStack", label: "X Stack", icon: "list", container: true, defaults: { gap: "$3", p: "$3", ai: "center" } },
  { type: "View", label: "Surface", icon: "table", container: true, defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$3" } },
  { type: "Heading", label: "Heading", icon: "zap", container: false, defaults: { text: "Section heading" } },
  { type: "Body", label: "Body", icon: "book", container: false, defaults: { text: "Body copy", color: "$textMuted" } },
  { type: "Label", label: "Label", icon: "info", container: false, defaults: { text: "Label", color: "$textMuted", tt: "uppercase" } },
  { type: "Button", label: "Button", icon: "check", container: false, defaults: { text: "Continue", bg: "$primary" } },
  { type: "Tag", label: "Tag", icon: "shield", container: false, defaults: { label: "Badge", tone: "info" } },
  { type: "Icon", label: "Icon", icon: "flask", container: false, defaults: { icon: "flask", tone: "info", size: "lg" } },
];

// Semantic block library — PM-readable names, mapped to underlying component types.
export interface SemanticBlock {
  id: string;
  label: string;
  category: "layout" | "data" | "feedback" | "input";
  type: UiComponentType;
  defaults: UiNodeProps;
}

export const UI_BLOCK_LIBRARY: SemanticBlock[] = [
  // ── Layout ──
  { id: "nav-bar",  label: "Nav bar",  category: "layout",   type: "XStack", defaults: { ai: "center", gap: "$2", bg: "$surfaceAlt", px: "$3", py: "$2", borderColor: "$borderSubtle", borderWidth: 1, br: "$3" } },
  { id: "hero",     label: "Hero",     category: "layout",   type: "View",   defaults: { bg: "$surfaceStrong", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$4" } },
  { id: "section",  label: "Section",  category: "layout",   type: "YStack", defaults: { gap: "$3", p: "$3" } },
  // ── Data ──
  { id: "list",     label: "List",     category: "data",     type: "YStack", defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3" } },
  { id: "card",     label: "Card",     category: "data",     type: "View",   defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$3" } },
  { id: "table",    label: "Table",    category: "data",     type: "YStack", defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", gap: "$1" } },
  // ── Feedback ──
  { id: "status",   label: "Status",   category: "feedback", type: "View",   defaults: { bg: "$errorMuted", borderColor: "$error", borderWidth: 1, br: "$3", p: "$3" } },
  { id: "empty",    label: "Empty",    category: "feedback", type: "YStack", defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$5", ai: "center", gap: "$2" } },
  { id: "skeleton", label: "Skeleton", category: "feedback", type: "YStack", defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$3", gap: "$2" } },
  // ── Input ──
  { id: "form",     label: "Form",     category: "input",    type: "YStack", defaults: { bg: "$surface", borderColor: "$borderSubtle", borderWidth: 1, br: "$3", p: "$4", gap: "$3" } },
  { id: "action",   label: "Action",   category: "input",    type: "Button", defaults: { text: "Continue", bg: "$primary" } },
  { id: "search",   label: "Search",   category: "input",    type: "XStack", defaults: { bg: "$surfaceAlt", borderColor: "$border", borderWidth: 1, br: 999, px: "$3", py: "$2", ai: "center", gap: "$2" } },
];

const FIELD_MAP: Record<UiComponentType, UiPropField[]> = {
  View: [
    { key: "bg", label: "Background", type: "token" },
    { key: "borderColor", label: "Border", type: "token" },
    { key: "borderWidth", label: "Border Width", type: "number" },
    { key: "br", label: "Radius", type: "token" },
    { key: "p", label: "Padding", type: "token" },
    { key: "px", label: "Pad X", type: "token" },
    { key: "py", label: "Pad Y", type: "token" },
    { key: "w", label: "Width", type: "text" },
    { key: "h", label: "Height", type: "text" },
  ],
  XStack: [
    { key: "gap", label: "Gap", type: "token" },
    { key: "ai", label: "Align", type: "enum", options: ["flex-start", "center", "flex-end", "stretch"] },
    { key: "jc", label: "Justify", type: "enum", options: ["flex-start", "center", "flex-end", "space-between"] },
    { key: "bg", label: "Background", type: "token" },
    { key: "p", label: "Padding", type: "token" },
    { key: "px", label: "Pad X", type: "token" },
    { key: "py", label: "Pad Y", type: "token" },
  ],
  YStack: [
    { key: "gap", label: "Gap", type: "token" },
    { key: "bg", label: "Background", type: "token" },
    { key: "p", label: "Padding", type: "token" },
    { key: "px", label: "Pad X", type: "token" },
    { key: "py", label: "Pad Y", type: "token" },
    { key: "borderColor", label: "Border", type: "token" },
    { key: "borderWidth", label: "Border Width", type: "number" },
    { key: "br", label: "Radius", type: "token" },
  ],
  Heading: [
    { key: "text", label: "Text", type: "text" },
    { key: "color", label: "Color", type: "token" },
    { key: "fontSize", label: "Size", type: "token" },
    { key: "fontFamily", label: "Font", type: "token" },
  ],
  Body: [
    { key: "text", label: "Text", type: "text" },
    { key: "color", label: "Color", type: "token" },
    { key: "fontSize", label: "Size", type: "token" },
    { key: "fontFamily", label: "Font", type: "token" },
  ],
  Label: [
    { key: "text", label: "Text", type: "text" },
    { key: "color", label: "Color", type: "token" },
    { key: "tt", label: "Transform", type: "enum", options: ["none", "uppercase"] },
    { key: "letterSpacing", label: "Spacing", type: "number" },
  ],
  Button: [
    { key: "text", label: "Label", type: "text" },
    { key: "bg", label: "Background", type: "token" },
    { key: "borderColor", label: "Border", type: "token" },
    { key: "borderWidth", label: "Border Width", type: "number" },
    { key: "opacity", label: "Opacity", type: "number" },
  ],
  Tag: [
    { key: "label", label: "Label", type: "text" },
    { key: "tone", label: "Tone", type: "enum", options: TONE_OPTIONS },
  ],
  Icon: [
    { key: "icon", label: "Icon", type: "enum", options: ["flask", "home", "user", "table", "list", "check", "shield", "zap", "info", "settings"] },
    { key: "tone", label: "Tone", type: "enum", options: TONE_OPTIONS },
    { key: "size", label: "Size", type: "enum", options: ["sm", "md", "lg", "xl", "2xl"] },
  ],
};

export function getPropFields(type: UiComponentType): UiPropField[] {
  return FIELD_MAP[type];
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
    if (!node) return; // guard before adding — avoids phantom IDs in the set
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
  return {
    id,
    type,
    props: { ...definition.defaults },
    children: [],
  };
}

function cloneDocument(document: UiDocument): UiDocument {
  return {
    ...document,
    nodes: Object.fromEntries(Object.entries(document.nodes).map(([id, node]) => [id, { ...node, props: { ...node.props }, children: [...node.children] }])),
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
    next.nodes[target.parentId].children = next.nodes[target.parentId].children.filter((childId) => childId !== nodeId);
  }
  idsToRemove.forEach((id) => {
    delete next.nodes[id];
  });
  return next;
}

export function updateNodeProps(document: UiDocument, nodeId: string, patch: Partial<UiNodeProps>): UiDocument {
  const next = cloneDocument(document);
  if (!next.nodes[nodeId]) return document;
  next.nodes[nodeId] = {
    ...next.nodes[nodeId],
    props: {
      ...next.nodes[nodeId].props,
      ...patch,
    },
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
        typeof value === "number" ? `${key}={${value}}` : `${key}=${JSON.stringify(value)}`,
      );

    if (node.type === "Icon") {
      return [`${indent}<Icon ${props.join(" ")} />`];
    }
    if (node.type === "Tag") {
      return [`${indent}<Tag ${props.join(" ")} />`];
    }
    if (node.type === "Button") {
      return [
        `${indent}<Button ${props.filter((entry) => !entry.startsWith("text=")).join(" ")}>`,
        `${indent}  <Body color="$textInverse" fontFamily="$bold">${node.props.text ?? "Button"}</Body>`,
        `${indent}</Button>`,
      ];
    }
    if (node.type === "Heading" || node.type === "Body" || node.type === "Label") {
      const text = node.props.text ?? node.type;
      return [`${indent}<${node.type} ${props.filter((entry) => !entry.startsWith("text=")).join(" ")}>${text}</${node.type}>`];
    }
    if (node.children.length === 0) {
      return [`${indent}<${node.type} ${props.join(" ")} />`];
    }
    return [
      `${indent}<${node.type} ${props.join(" ")}>`,
      ...node.children.flatMap((childId) => serializeNode(childId, depth + 1)),
      `${indent}</${node.type}>`,
    ];
  }

  return [
    'import { Body, Button, Heading, Icon, Label, Tag, View, XStack, YStack } from "src/ui";',
    "",
    "export function PlaygroundPreview() {",
    "  return (",
    ...serializeNode(document.rootId, 2),
    "  );",
    "}",
  ].join("\n");
}
