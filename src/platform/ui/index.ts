import { styled, View } from "@tamagui/core";
import { ScrollView as RNScrollView } from "react-native";

export {
  Text,
  Theme,
  styled,
  TamaguiProvider,
  type GetProps,
} from "@tamagui/core";
export { SafeAreaView } from "react-native-safe-area-context";
export { UIProvider } from "./Provider";
export { config } from "./config";
export {
  type ButtonContract,
  type BadgeContract,
  type TagContract,
  type InputContract,
  type AvatarContract,
  type ImageContract,
  type TableContract,
  type ProgressBarContract,
  type TabsContract,
  type SizingToolbarContract,
  type TabbedPanelContract,
  type DockPanelContract,
  type DockSplitterContract,
  type ColorPalettePickerContract,
  type PrimitiveContracts,
  type LayoutContract,
  type LayoutProfileName,
} from "./contracts/index";
export {
  layoutContractDefinition,
} from "./contracts/index";
export {
  platformLayoutDefaults,
  defaultContracts,
} from "./theme/index";
export { Display, Heading, Label, Body } from "./primitives/Text";
export { Button } from "./primitives/Button";
export type { ButtonProps } from "./primitives/Button";
export { ButtonSchema } from "./primitives/Button";
export { Input } from "./primitives/Input";
export { InputSchema } from "./primitives/Input";
export { TextArea } from "./primitives/TextArea";
export { TextAreaSchema } from "./primitives/TextArea";
export { ColorPalettePicker } from "./primitives/ColorPalettePicker";
export type { ColorPalettePickerProps } from "./primitives/ColorPalettePicker";
export { ColorPalettePickerSchema } from "./primitives/ColorPalettePicker";
export { ColorSwatch } from "./primitives/ColorSwatch";
export type { ColorSwatchProps } from "./primitives/ColorSwatch";
export { Select } from "./primitives/Select";
export type { SelectOption, SelectProps } from "./primitives/Select";
export { SelectSchema, SelectOptionSchema } from "./primitives/Select";
export { MultiSelect } from "./primitives/MultiSelect";
export type { MultiSelectProps } from "./primitives/MultiSelect";
export { MultiSelectSchema } from "./primitives/MultiSelect";
export { Icon, type IconName } from "./primitives/Icon";
export { SelectableChip } from "./primitives/SelectableChip";
export type {
  SelectableChipShape,
  SelectableChipFrame,
  SelectableChipProps,
} from "./primitives/SelectableChip";
export { SelectableChipSchema } from "./primitives/SelectableChip";
export { SizingToolbar } from "./primitives/SizingToolbar";
export type { SizingToolbarProps, SizingToolbarValue } from "./primitives/SizingToolbar";
export { SizingToolbarSchema } from "./primitives/SizingToolbar";
export { Tabs } from "./primitives/Tabs";
export type { TabsProps, TabOption } from "./primitives/Tabs";
export { TabsSchema, TabOptionSchema } from "./primitives/Tabs";
export { TabbedPanel } from "./primitives/TabbedPanel";
export type {
  TabbedPanelMoveDirection,
  TabbedPanelProps,
  TabbedPanelTab,
} from "./primitives/TabbedPanel";
export {
  TabbedPanelSchema,
  TabbedPanelTabSchema,
  TabbedPanelMoveDirectionSchema,
} from "./primitives/TabbedPanel";
export { DockPanel } from "./primitives/DockPanel";
export type {
  DockPanelDisplayMode,
  DockPanelPlacement,
  DockPanelMoveDirection,
  DockPanelProps,
  DockPanelItem,
} from "./primitives/DockPanel";
export { DockSplitter } from "./primitives/DockSplitter";
export type {
  DockSplitterDragEvent,
  DockSplitterOrientation,
  DockSplitterProps,
} from "./primitives/DockSplitter";
export { DockSplitterSchema, DockSplitterDragEventSchema } from "./primitives/DockSplitter";
export { Tag } from "./primitives/Tag";
export type { TagProps } from "./primitives/Tag";
export { TagSchema } from "./primitives/Tag";
export { Avatar } from "./primitives/Avatar";
export type { AvatarProps } from "./primitives/Avatar";
export { AvatarSchema } from "./primitives/Avatar";
export { Badge } from "./primitives/Badge";
export type { BadgeProps } from "./primitives/Badge";
export { BadgeSchema } from "./primitives/Badge";
export { ProgressBar } from "./primitives/ProgressBar";
export type { ProgressBarProps } from "./primitives/ProgressBar";
export { ProgressBarSchema } from "./primitives/ProgressBar";
export { Table } from "./primitives/Table";
export type {
  TableAlign,
  TableCellSpec,
  TableColumn,
  TableColumnKind,
  ImageContract as TableImageContract,
  TableProps,
  TableWidth,
} from "./primitives/Table";
export { TableSchema } from "./primitives/Table";
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
} from "./theme/Viewport";
export { ViewportProvider } from "./theme/ViewportProvider";
export { ThemeProvider, useUI, useTheme, useThemeTokens } from "./theme/ThemeProvider";
export {
  createContracts,
  createLayouts,
  uiRuntime,
  type UiRuntime,
} from "./theme/index";
export type { ElevationPreset, ThemeElevationOverride } from "./theme/index";
export { LayoutProvider, DensityProvider, useLayout } from "./theme/DensityProvider";
export {
  CenteredPageScaffold,
  HeaderScaffold,
  SidebarScaffold,
  PanelScaffold,
  PanelCollectionScaffold,
  PageScaffold,
} from "./scaffolds/index";
export type {
  CenteredPageScaffoldProps,
  CenteredPageScaffoldWidth,
  HeaderScaffoldProps,
  SidebarScaffoldProps,
  PanelScaffoldProps,
  PanelCollectionScaffoldProps,
  PageScaffoldProps,
} from "./scaffolds/index";

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
export const ZStack = styled(View, {
  name: "ZStack",
});
export const ScrollView = styled(RNScrollView, {
  name: "ScrollView",
});
