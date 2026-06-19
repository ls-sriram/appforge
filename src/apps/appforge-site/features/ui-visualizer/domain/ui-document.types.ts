import type { IconName, IconSize } from "@ui";

export type UiEditorTab = "design" | "code" | "tokens";
export type UiPreviewState = "data" | "loading" | "empty" | "error";

export type UiComponentType =
  | "View"
  | "XStack"
  | "YStack"
  | "Display"
  | "Heading"
  | "Body"
  | "Label"
  | "Button"
  | "Tag"
  | "Icon"
  | "Avatar"
  | "Badge"
  | "Input"
  | "TextArea"
  | "SelectableChip"
  | "ProgressBar";

export type UiTone =
  | "primary"
  | "muted"
  | "secondary"
  | "accent"
  | "action"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "inverse"
  | "brand";

export type UiTextSize   = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "display";
export type UiTextWeight = "regular" | "bold";
export type UiButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type UiButtonSize    = "sm" | "md" | "lg";

export type UiFieldType = "text" | "token" | "number" | "enum" | "boolean";

export interface UiNodeProps {
  // Content
  text?: string;
  label?: string;
  icon?: IconName;
  initials?: string;
  placeholder?: string;
  // Variant contracts — the inspector's primary editing vocabulary
  tone?: UiTone;
  size?: IconSize | UiTextSize | UiButtonSize;
  weight?: UiTextWeight;
  variant?: UiButtonVariant;
  selected?: boolean;
  // ProgressBar
  value?: string | number;
  total?: number;
  // Raw style escape hatches
  bg?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  br?: string | number;
  m?: string;
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  p?: string;
  px?: string;
  py?: string;
  pt?: string;
  pb?: string;
  pl?: string;
  pr?: string;
  gap?: string;
  ai?: string;
  jc?: string;
  f?: number;
  flexWrap?: string;
  flexShrink?: number;
  w?: string | number;
  h?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  fontFamily?: string;
  fontSize?: string;
  ta?: string;
  tt?: string;
  letterSpacing?: number;
  opacity?: number;
}

export interface UiNode {
  id: string;
  type: UiComponentType;
  props: UiNodeProps;
  children: string[];
  parentId?: string;
}

export interface UiDocument {
  id: string;
  name: string;
  description: string;
  rootId: string;
  nodes: Record<string, UiNode>;
  stateLayouts?: Partial<Record<UiPreviewState, string[]>>;
  /** Repo-relative path to the source .layout.tsx file. Set by the scanner; used by the emit step. */
  sourcePath?: string;
}

export interface UiComponentLibraryItem {
  type: UiComponentType;
  label: string;
  icon: IconName;
  container: boolean;
  defaults: UiNodeProps;
}

export interface UiPropField {
  key: keyof UiNodeProps;
  label: string;
  type: UiFieldType;
  options?: string[];
}

// ── Custom blocks ─────────────────────────────────────────────────────────────
// A named, persistent subtree the user saved for reuse in a specific project.

export interface CustomBlockDef {
  id: string;
  label: string;
  appId: string;
  rootId: string;
  nodes: Record<string, UiNode>;
}

// ── File-backed blocks ────────────────────────────────────────────────────────
// Scanned from src/apps/{appId}/blocks/*.block.tsx by the scanner.
// sourcePath is repo-relative; used by the emit step to write changes back.

export interface UiBlock {
  id: string;
  label: string;
  appId: string;
  sourcePath: string;
  rootId: string;
  nodes: Record<string, UiNode>;
}
