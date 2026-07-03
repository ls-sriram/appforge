/**
 * Visualizer barrel — drop-in replacement for src/ui/index.ts.
 *
 * Aliased via Metro resolver.resolveRequest when building appforge-site so
 * layout files' static `import { YStack } from '@appforge/platform/ui'` get
 * wrapped implementations without any change to the layout source.
 *
 * Pass-through: all real-barrel exports not explicitly overridden.
 * Overridden: the core render primitives that need click-to-select + prop-override.
 */

// ── Pass-through — everything the real barrel exports that we don't wrap ─────
export {
  Text,
  Theme,
  styled,
  TamaguiProvider,
  SafeAreaView,
  UIProvider,
  config,
  ScrollView,
  ZStack,
  Table,
  createUi,
  noopUi,
  spacing,
  radii,
  // Theme system
  ThemeProvider,
  useUI,
  useTheme,
  useThemeTokens,
  // Layout / density
  LayoutProvider,
  DensityProvider,
  useLayout,
  // Viewport
  ViewportProvider,
  useViewport,
  getViewportTier,
  // Theme factories
  createContracts,
  createLayouts,
  uiRuntime,
  platformLayoutDefaults,
  layoutContractDefinition,
  // Primitives not wrapped
  ColorPalettePicker,
  ColorSwatch,
  Select,
  MultiSelect,
  dialog,
  linking,
  // Scaffolds
  CenteredPageScaffold,
  HeaderScaffold,
  SidebarScaffold,
  PanelScaffold,
  PanelCollectionScaffold,
  PageScaffold,
} from "../index";

export type {
  GetProps,
  UiStamp,
  UiStampAttrs,
  // Primitive contracts
  ButtonContract,
  BadgeContract,
  TagContract,
  InputContract,
  AvatarContract,
  ImageContract,
  TableContract,
  ProgressBarContract,
  TabsContract,
  SizingToolbarContract,
  TabbedPanelContract,
  ColorPalettePickerContract,
  PrimitiveContracts,
  LayoutContract,
  LayoutProfileName,
  // Primitive types
  ButtonProps,
  ColorPalettePickerProps,
  ColorSwatchProps,
  SelectOption,
  SelectProps,
  MultiSelectProps,
  IconName,
  SelectableChipShape,
  SelectableChipFrame,
  SizingToolbarProps,
  SizingToolbarValue,
  TabsProps,
  TabOption,
  TabbedPanelMoveDirection,
  TabbedPanelProps,
  TabbedPanelTab,
  TagProps,
  TableAlign,
  TableCellSpec,
  TableColumn,
  TableColumnKind,
  TableImageContract,
  TableProps,
  TableWidth,
  DialogButton,
  // Viewport
  ViewportInfo,
  ViewportTier,
  // Theme
  UiRuntime,
  ElevationPreset,
  ThemeElevationOverride,
  // Scaffolds
  CenteredPageScaffoldProps,
  CenteredPageScaffoldWidth,
  HeaderScaffoldProps,
  SidebarScaffoldProps,
  PanelScaffoldProps,
  PanelCollectionScaffoldProps,
  PageScaffoldProps,
} from "../index";

// ── Wrapped — visualizer-aware versions of the render primitives ─────────────
export {
  Body,
  Heading,
  Label,
  Display,
  Button,
  YStack,
  XStack,
  Tag,
  Icon,
  Avatar,
  Badge,
  Input,
  ProgressBar,
  SelectableChip,
  SizingToolbar,
  TabbedPanel,
  Tabs,
  TextArea,
} from "./wrapped";
