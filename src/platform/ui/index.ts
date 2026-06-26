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
  type ButtonVariant,
  type BadgeVariant,
  type TagVariant,
  type InputVariant,
  type AvatarVariant,
  type ImageVariant,
  type ProgressBarVariant,
  type Variants,
  type LayoutContract,
} from "./contracts";
export { Display, Heading, Label, Body } from "./primitives/Text";
export { Button } from "./primitives/Button";
export type { ButtonProps } from "./primitives/Button";
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
  SelectableChipShape,
  SelectableChipFrame,
} from "./primitives/SelectableChip";
export { SizingToolbar } from "./primitives/SizingToolbar";
export type { SizingToolbarProps, SizingToolbarValue } from "./primitives/SizingToolbar";
export { Tabs } from "./primitives/Tabs";
export type { TabsProps, TabOption } from "./primitives/Tabs";
export { TabbedPanel } from "./primitives/TabbedPanel";
export type {
  TabbedPanelMoveDirection,
  TabbedPanelProps,
  TabbedPanelTab,
} from "./primitives/TabbedPanel";
export { Tag } from "./primitives/Tag";
export type { TagProps } from "./primitives/Tag";
export { Avatar } from "./primitives/Avatar";
export { Badge } from "./primitives/Badge";
export { ProgressBar } from "./primitives/ProgressBar";
export { Table } from "./primitives/Table";
export type {
  TableAlign,
  TableCellSpec,
  TableColumn,
  TableColumnKind,
  ImageVariant as TableImageVariant,
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
export { createVariants, createLayouts } from "../theme";
export { DensityProvider, useLayout } from "../theme/DensityProvider";
export {
  CenteredPageScaffold,
  HeaderScaffold,
  SidebarScaffold,
  PanelScaffold,
  PanelCollectionScaffold,
  PageScaffold,
} from "./scaffolds";
export type {
  CenteredPageScaffoldProps,
  CenteredPageScaffoldWidth,
  HeaderScaffoldProps,
  SidebarScaffoldProps,
  PanelScaffoldProps,
  PanelCollectionScaffoldProps,
  PageScaffoldProps,
} from "./scaffolds";

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
