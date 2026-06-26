/**
 * Platform UI contract manifest.
 *
 * This file makes the repo's "open authoring" vs "closed editable"
 * distinction explicit so tooling and docs share one source of truth.
 */

export const OPEN_LAYOUT_PRIMITIVES = [
  "YStack",
  "XStack",
  "ScrollView",
] as const;

export const CLOSED_VALUE_PRIMITIVES = [
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

export const CLOSED_WIDTH_PRESETS = {
  content: "content",
  narrow: 280,
  regular: 360,
  wide: 480,
  sidebar: 232,
  rail: 72,
  fill: "100%",
} as const;

export const CLOSED_MIN_HEIGHT_PRESETS = {
  none: 0,
  chip: 32,
  controlSm: 36,
  controlMd: 54,
  controlLg: 64,
  panelSm: 80,
  panelMd: 120,
  panelLg: 160,
  panelXl: 220,
  panel2xl: 260,
  panel3xl: 320,
} as const;

export const CLOSED_MAX_HEIGHT_PRESETS = {
  panelSm: 160,
  panelMd: 220,
  panelLg: 320,
  panelXl: 480,
  viewport: 640,
} as const;

export const CLOSED_OPACITY_PRESETS = {
  default: 1,
  muted: 0.72,
  disabled: 0.5,
  overlay: 0.6,
  backdrop: 0.8,
} as const;

export const CLOSED_BORDER_WIDTH_PRESETS = {
  none: 0,
  thin: 0.5,
  normal: 1,
  thick: 2,
} as const;

export const CLOSED_OVERLAY_PLACEMENTS = {
  inline: { position: "relative" },
  attached: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  floating: { position: "absolute", top: 16, right: 16 },
  fullscreen: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
} as const;

export const SCAFFOLD_KINDS = [
  "page",
  "centeredPage",
  "header",
  "sidebar",
  "panel",
  "panelCollection",
] as const;

export const SCAFFOLD_SLOT_BEHAVIORS = [
  "flow",
  "sticky",
  "fixed",
] as const;

export const SCAFFOLD_SLOT_PLACEMENTS = [
  "inline",
  "top",
  "bottom",
  "left",
  "right",
  "center",
  "leading",
  "trailing",
] as const;

export const SCAFFOLD_GAP_PRESETS = [
  "none",
  "tight",
  "default",
  "loose",
] as const;

export const SCAFFOLD_PADDING_PRESETS = [
  "none",
  "sm",
  "md",
  "lg",
] as const;

export const SCAFFOLD_SEPARATION_PRESETS = [
  "flush",
  "separated",
] as const;

export const CLOSED_EDITABLE_ALLOWED_TAMAGUI_PROPS = [
  "ai",
  "jc",
  "fd",
  "f",
  "gap",
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "bg",
  "color",
  "borderColor",
  "borderWidth",
  "borderTopWidth",
  "borderBottomWidth",
  "overflow",
  "br",
  "minHeight",
  "maxWidth",
  "w",
  "h",
  "flexBasis",
] as const;

export const CLOSED_EDITABLE_FORBIDDEN_TAMAGUI_PROPS = [
  "opacity",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "zIndex",
  "minWidth",
  "maxHeight",
  "letterSpacing",
  "pressStyle",
  "hoverStyle",
  "focusStyle",
  "animation",
  "transform",
] as const;

export type ClosedWidthPreset = keyof typeof CLOSED_WIDTH_PRESETS;
export type ClosedMinHeightPreset = keyof typeof CLOSED_MIN_HEIGHT_PRESETS;
export type ClosedMaxHeightPreset = keyof typeof CLOSED_MAX_HEIGHT_PRESETS;
export type ClosedOpacityPreset = keyof typeof CLOSED_OPACITY_PRESETS;
export type ClosedBorderWidthPreset = keyof typeof CLOSED_BORDER_WIDTH_PRESETS;
export type ClosedOverlayPlacement = keyof typeof CLOSED_OVERLAY_PLACEMENTS;
export type ScaffoldKind = typeof SCAFFOLD_KINDS[number];
export type ScaffoldSlotBehavior = typeof SCAFFOLD_SLOT_BEHAVIORS[number];
export type ScaffoldSlotPlacement = typeof SCAFFOLD_SLOT_PLACEMENTS[number];
export type ScaffoldGapPreset = typeof SCAFFOLD_GAP_PRESETS[number];
export type ScaffoldPaddingPreset = typeof SCAFFOLD_PADDING_PRESETS[number];
export type ScaffoldSeparationPreset = typeof SCAFFOLD_SEPARATION_PRESETS[number];

export type OpenLayoutPrimitiveName = typeof OPEN_LAYOUT_PRIMITIVES[number];
export type ClosedValuePrimitiveName = typeof CLOSED_VALUE_PRIMITIVES[number];
export type PlatformBypassProp = typeof PLATFORM_BYPASS_PROPS[number];
export type ClosedEditableAllowedProp = typeof CLOSED_EDITABLE_ALLOWED_TAMAGUI_PROPS[number];
export type ClosedEditableForbiddenProp = typeof CLOSED_EDITABLE_FORBIDDEN_TAMAGUI_PROPS[number];

export interface ScaffoldSlotContract {
  name: string;
  placement: ScaffoldSlotPlacement;
  behavior: ScaffoldSlotBehavior;
  required?: boolean;
  multiple?: boolean;
}

export interface ScaffoldContract {
  kind: ScaffoldKind;
  slots: readonly ScaffoldSlotContract[];
  gap?: ScaffoldGapPreset;
  padding?: ScaffoldPaddingPreset;
  separation?: ScaffoldSeparationPreset;
}

export const PLATFORM_SCAFFOLDS = {
  page: {
    kind: "page",
    gap: "default",
    padding: "md",
    separation: "separated",
    slots: [
      { name: "header", placement: "top", behavior: "sticky", required: false },
      { name: "sidebar", placement: "left", behavior: "sticky", required: false },
      { name: "content", placement: "center", behavior: "flow", required: true },
      { name: "footer", placement: "bottom", behavior: "flow", required: false },
    ],
  },
  centeredPage: {
    kind: "centeredPage",
    gap: "default",
    padding: "md",
    separation: "flush",
    slots: [
      { name: "header", placement: "top", behavior: "flow", required: false },
      { name: "content", placement: "center", behavior: "flow", required: true },
      { name: "footer", placement: "bottom", behavior: "flow", required: false },
    ],
  },
  header: {
    kind: "header",
    gap: "tight",
    padding: "md",
    separation: "flush",
    slots: [
      { name: "leading", placement: "leading", behavior: "flow", required: false },
      { name: "title", placement: "center", behavior: "flow", required: true },
      { name: "actions", placement: "trailing", behavior: "flow", required: false, multiple: true },
    ],
  },
  sidebar: {
    kind: "sidebar",
    gap: "default",
    padding: "md",
    separation: "separated",
    slots: [
      { name: "header", placement: "top", behavior: "sticky", required: false },
      { name: "content", placement: "inline", behavior: "flow", required: true },
      { name: "footer", placement: "bottom", behavior: "sticky", required: false },
    ],
  },
  panel: {
    kind: "panel",
    gap: "default",
    padding: "md",
    separation: "separated",
    slots: [
      { name: "header", placement: "top", behavior: "flow", required: false },
      { name: "content", placement: "center", behavior: "flow", required: true },
      { name: "footer", placement: "bottom", behavior: "flow", required: false },
      { name: "actions", placement: "trailing", behavior: "flow", required: false, multiple: true },
    ],
  },
  panelCollection: {
    kind: "panelCollection",
    gap: "loose",
    padding: "md",
    separation: "separated",
    slots: [
      { name: "header", placement: "top", behavior: "flow", required: false },
      { name: "items", placement: "inline", behavior: "flow", required: true, multiple: true },
      { name: "actions", placement: "trailing", behavior: "flow", required: false, multiple: true },
    ],
  },
} as const satisfies Record<ScaffoldKind, ScaffoldContract>;
