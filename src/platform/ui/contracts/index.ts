export * from "./variants";
export * from "./scaffolds";

// ─── Primitive Registry ───────────────────────────────────────────
// Used by tooling (visualizer, codegen) to enumerate what AppForge owns.
// Layout primitives accept free composition; value primitives are shape-driven.

export const LAYOUT_PRIMITIVES = [
  "YStack",
  "XStack",
  "ScrollView",
] as const;

export const VALUE_PRIMITIVES = [
  "Body",
  "Heading",
  "Label",
  "Display",
  "Button",
  "Input",
  "TextArea",
  "Select",
  "MultiSelect",
  "ColorPalettePicker",
  "Icon",
  "SelectableChip",
  "SizingToolbar",
  "Tabs",
  "TabbedPanel",
  "Tag",
  "Avatar",
  "Badge",
  "ProgressBar",
  "Table",
  "dialog",
  "linking",
] as const;

export const PLATFORM_BYPASS_PROPS = [
  "style",
  "contentContainerStyle",
  "className",
] as const;

export type LayoutPrimitiveName = typeof LAYOUT_PRIMITIVES[number];
export type ValuePrimitiveName = typeof VALUE_PRIMITIVES[number];
export type PlatformBypassProp = typeof PLATFORM_BYPASS_PROPS[number];
