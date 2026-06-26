import { styled, View } from "@tamagui/core";
import { ScrollView as RNScrollView } from "react-native";

export {
  Text,
  Theme,
  styled,
  useTheme,
  TamaguiProvider,
  type GetProps,
} from "@tamagui/core";
export { SafeAreaView } from "react-native-safe-area-context";
export { UIProvider } from "./Provider";
export { config } from "./config";
export {
  OPEN_LAYOUT_PRIMITIVES,
  CLOSED_VALUE_PRIMITIVES,
  PLATFORM_BYPASS_PROPS,
  CLOSED_WIDTH_PRESETS,
  CLOSED_MIN_HEIGHT_PRESETS,
  CLOSED_MAX_HEIGHT_PRESETS,
  CLOSED_OPACITY_PRESETS,
  CLOSED_BORDER_WIDTH_PRESETS,
  CLOSED_OVERLAY_PLACEMENTS,
  SCAFFOLD_KINDS,
  SCAFFOLD_SLOT_BEHAVIORS,
  SCAFFOLD_SLOT_PLACEMENTS,
  SCAFFOLD_GAP_PRESETS,
  SCAFFOLD_PADDING_PRESETS,
  SCAFFOLD_SEPARATION_PRESETS,
  PLATFORM_SCAFFOLDS,
  CLOSED_EDITABLE_ALLOWED_TAMAGUI_PROPS,
  CLOSED_EDITABLE_FORBIDDEN_TAMAGUI_PROPS,
  type OpenLayoutPrimitiveName,
  type ClosedValuePrimitiveName,
  type PlatformBypassProp,
  type ClosedWidthPreset,
  type ClosedMinHeightPreset,
  type ClosedMaxHeightPreset,
  type ClosedOpacityPreset,
  type ClosedBorderWidthPreset,
  type ClosedOverlayPlacement,
  type ScaffoldKind,
  type ScaffoldSlotBehavior,
  type ScaffoldSlotPlacement,
  type ScaffoldGapPreset,
  type ScaffoldPaddingPreset,
  type ScaffoldSeparationPreset,
  type ClosedEditableAllowedProp,
  type ClosedEditableForbiddenProp,
  type ScaffoldSlotContract,
  type ScaffoldContract,
} from "./contract";
export { Display, Heading, Label, Body } from "./primitives/Text";
export { Button } from "./primitives/Button";
export { Input } from "./primitives/Input";
export { TextArea } from "./primitives/TextArea";
export { ColorPalettePicker } from "./primitives/ColorPalettePicker";
export type { ColorPalettePickerProps } from "./primitives/ColorPalettePicker";
export { ColorSwatch } from "./primitives/ColorSwatch";
export type { ColorSwatchProps } from "./primitives/ColorSwatch";
export { Select } from "./primitives/Select";
export type { SelectOption, SelectProps } from "./primitives/Select";
export { MultiSelect } from "./primitives/MultiSelect";
export type { MultiSelectProps } from "./primitives/MultiSelect";
export { Icon, type IconName, type IconSize, type IconTone } from "./primitives/Icon";
export { SelectableChip } from "./primitives/SelectableChip";
export type {
  SelectableChipSize,
  SelectableChipShape,
  SelectableChipFrame,
} from "./primitives/SelectableChip";
export { Tag } from "./primitives/Tag";
export type { TagProps } from "./primitives/Tag";
export { Avatar } from "./primitives/Avatar";
export { Badge } from "./primitives/Badge";
export type { BadgeTone } from "./primitives/Badge";
export { ProgressBar } from "./primitives/ProgressBar";
export type { ProgressBarTone } from "./primitives/ProgressBar";
export { Table } from "./primitives/Table";
export type {
  TableAlign,
  TableCellSpec,
  TableColumn,
  TableColumnKind,
  TableDensity,
  TableProps,
  TableWidth,
} from "./primitives/Table";
export { dialog } from "./primitives/dialog";
export type { DialogButton } from "./primitives/dialog";
export { linking } from "./primitives/linking";
export { createUi, noopUi } from "./viz";
export type { UiStamp, UiStampAttrs } from "./viz";
export {
  useViewport,
  getViewportTier,
  type ViewportInfo,
  type ViewportTier,
} from "../theme/Viewport";
export { ViewportProvider } from "../theme/ViewportProvider";
export {
  CenteredPageLayout,
  HeaderScaffold,
  SidebarScaffold,
  PanelScaffold,
  PanelCollectionScaffold,
  PageScaffold,
} from "./layouts";
export type {
  HeaderScaffoldProps,
  SidebarScaffoldProps,
  PanelScaffoldProps,
  PanelCollectionScaffoldProps,
  PageScaffoldProps,
} from "./layouts";

// Semantic spacing constants — use instead of raw $1/$2/$3 etc.
// Maps to theme factory space scale: xxs=4 xs=6 sm=10 md=16 lg=22 xl=30 2xl=44 3xl=64
export const spacing = {
  xxs: '$xxs',
  xs:  '$xs',
  sm:  '$sm',
  md:  '$md',
  lg:  '$lg',
  xl:  '$xl',
  '2xl': '$2xl',
  '3xl': '$3xl',
} as const

// Semantic radius constants — use instead of raw $1/$2/$3 etc. on br/borderRadius props
// Maps to radius scale: sm=9 md=15 lg=20 xl=29 pill=9999
export const radii = {
  none: '$none',
  sm:   '$sm',
  md:   '$md',
  lg:   '$lg',
  xl:   '$xl',
  pill: '$pill',
} as const

export const YStack = styled(View, {
  name: "YStack",
  flexDirection: "column",
});
export const XStack = styled(View, {
  name: "XStack",
  flexDirection: "row",
});
export const ScrollView = styled(RNScrollView, {
  name: "ScrollView",
});
