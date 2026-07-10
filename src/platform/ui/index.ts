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
  type InteractionContract,
  type ButtonContract,
  type PressableContract,
  type ListItemContract,
  type ChipContract,
  type SegmentedTabContract,
  type IconButtonContract,
  type CardContract,
  type MenuItemContract,
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
export { Display, Heading, Label, Body, Logo } from "./components/text/Text";
export { DisplaySchema, HeadingSchema, LabelSchema, BodySchema, LogoSchema } from "./components/text/text.contract";
export { Button } from "./components/button/Button";
export type { ButtonProps } from "./components/button/Button";
export { ButtonSchema } from "./components/button/button.contract";
export { Pressable } from "./components/pressable/Pressable";
export type { PressableProps } from "./components/pressable/Pressable";
export { PressableSchema, PressableRoleSchema } from "./components/pressable/pressable.contract";
export { ListItem } from "./components/list-item/ListItem";
export type { ListItemProps } from "./components/list-item/ListItem";
export { ListItemSchema, ListItemVariantSchema } from "./components/list-item/list-item.contract";
export { Chip } from "./components/chip/Chip";
export type { ChipShape, ChipFrame, ChipProps } from "./components/chip/Chip";
export { ChipSchema, ChipShapeSchema, ChipFrameSchema } from "./components/chip/chip.contract";
// Named Tab (not AppTab) at the file/component level, matching this
// module's unprefixed convention; re-exported as SegmentedTab here since
// "Tab" and the existing "Tabs" (tab strip) read as near-duplicates at the
// platform's flat public surface.
export { Tab as SegmentedTab } from "./components/tab/Tab";
export type { TabProps as SegmentedTabProps, TabSegmentOption } from "./components/tab/Tab";
export { TabSchema as SegmentedTabSchema, TabOptionSchema as SegmentedTabOptionSchema } from "./components/tab/tab.contract";
export { IconButton, ToolbarButton } from "./components/icon-button/IconButton";
export type { IconButtonProps } from "./components/icon-button/IconButton";
export { IconButtonSchema } from "./components/icon-button/icon-button.contract";
export { Card } from "./components/card/Card";
export type { CardProps } from "./components/card/Card";
export { CardSchema } from "./components/card/card.contract";
export { MenuItem } from "./components/menu-item/MenuItem";
export type { MenuItemProps } from "./components/menu-item/MenuItem";
export { MenuItemSchema } from "./components/menu-item/menu-item.contract";
export { Input } from "./components/input/Input";
export { InputSchema } from "./components/input/input.contract";
export { TextArea } from "./components/text-area/TextArea";
export { TextAreaSchema } from "./components/text-area/text-area.contract";
export { ColorPalettePicker } from "./components/color-palette-picker/ColorPalettePicker";
export type { ColorPalettePickerProps } from "./components/color-palette-picker/ColorPalettePicker";
export { ColorPalettePickerSchema } from "./components/color-palette-picker/color-palette-picker.contract";
export { ColorSwatch } from "./components/color-swatch/ColorSwatch";
export type { ColorSwatchProps } from "./components/color-swatch/ColorSwatch";
export { ColorSwatchSchema } from "./components/color-swatch/color-swatch.contract";
export { Select } from "./components/select/Select";
export type { SelectOption, SelectProps } from "./components/select/Select";
export { SelectSchema, SelectOptionSchema } from "./components/select/select.contract";
export { MultiSelect } from "./components/multi-select/MultiSelect";
export type { MultiSelectProps } from "./components/multi-select/MultiSelect";
export { MultiSelectSchema } from "./components/multi-select/multi-select.contract";
export { Icon, type IconName } from "./components/icon/Icon";
export { IconSchema } from "./components/icon/icon.contract";
export { SelectableChip } from "./components/selectable-chip/SelectableChip";
export type {
  SelectableChipShape,
  SelectableChipFrame,
  SelectableChipProps,
} from "./components/selectable-chip/SelectableChip";
export { SelectableChipSchema } from "./components/selectable-chip/selectable-chip.contract";
export { SizingToolbar } from "./components/sizing-toolbar/SizingToolbar";
export type { SizingToolbarProps, SizingToolbarValue } from "./components/sizing-toolbar/SizingToolbar";
export { SizingToolbarSchema } from "./components/sizing-toolbar/sizing-toolbar.contract";
export { Tabs } from "./components/tabs/Tabs";
export type { TabsProps, TabOption } from "./components/tabs/Tabs";
export { TabsSchema, TabOptionSchema } from "./components/tabs/tabs.contract";
export { TabbedPanel } from "./components/tabbed-panel/TabbedPanel";
export type {
  TabbedPanelMoveDirection,
  TabbedPanelProps,
  TabbedPanelTab,
} from "./components/tabbed-panel/TabbedPanel";
export {
  TabbedPanelSchema,
  TabbedPanelTabSchema,
  TabbedPanelMoveDirectionSchema,
} from "./components/tabbed-panel/tabbed-panel.contract";
export { DockPanel } from "./components/dock-panel/DockPanel";
export type {
  DockPanelDisplayMode,
  DockPanelPlacement,
  DockPanelMoveDirection,
  DockPanelProps,
  DockPanelItem,
} from "./components/dock-panel/DockPanel";
export {
  DockPanelSchema,
  DockPanelItemSchema,
  DockPanelDisplayModeSchema,
  DockPanelPlacementSchema,
  DockPanelMoveDirectionSchema,
} from "./components/dock-panel/dock-panel.contract";
export { DockSplitter } from "./components/dock-splitter/DockSplitter";
export type {
  DockSplitterDragEvent,
  DockSplitterOrientation,
  DockSplitterProps,
} from "./components/dock-splitter/DockSplitter";
export { DockSplitterSchema, DockSplitterDragEventSchema } from "./components/dock-splitter/dock-splitter.contract";
export { Tag } from "./components/tag/Tag";
export type { TagProps } from "./components/tag/Tag";
export { TagSchema } from "./components/tag/tag.contract";
export { Avatar } from "./components/avatar/Avatar";
export type { AvatarProps } from "./components/avatar/Avatar";
export { AvatarSchema } from "./components/avatar/avatar.contract";
export { Badge } from "./components/badge/Badge";
export type { BadgeProps } from "./components/badge/Badge";
export { BadgeSchema } from "./components/badge/badge.contract";
export { ProgressBar } from "./components/progress-bar/ProgressBar";
export type { ProgressBarProps } from "./components/progress-bar/ProgressBar";
export { ProgressBarSchema } from "./components/progress-bar/progress-bar.contract";
export { Table } from "./components/table/Table";
export type {
  TableAlign,
  TableCellSpec,
  TableColumn,
  TableColumnKind,
  ImageContract as TableImageContract,
  TableProps,
  TableWidth,
} from "./components/table/Table";
export { TableSchema } from "./components/table/table.contract";
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
export { centeredPageWidths, pageShell } from "./scaffolds/defaults";

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

export { YStackSchema, XStackSchema } from "./stack.contract";

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
