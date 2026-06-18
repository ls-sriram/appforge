/**
 * Visualizer barrel — drop-in replacement for src/ui/index.ts.
 *
 * Aliased via Metro resolver.resolveRequest when VISUALIZER_BUILD=1 so
 * layout files' static `import { YStack } from '@app/ui'` get wrapped
 * implementations without any change to the layout source.
 *
 * Pass-through: all real-barrel exports not explicitly overridden.
 * Overridden: the core render primitives that need click-to-select + prop-override.
 */

// ── Pass-through — everything the real barrel exports that we don't wrap ─────
export {
  Text,
  Theme,
  styled,
  useTheme,
  TamaguiProvider,
  SafeAreaView,
  UIProvider,
  config,
  Input,
  TextArea,
  SelectableChip,
  ScrollView,
  Stack,
} from "../index";

export type {
  GetProps,
  SelectableChipSize,
  SelectableChipShape,
  SelectableChipFrame,
  TagProps,
  IconName,
  IconSize,
  IconTone,
} from "../index";

// ── Wrapped — visualizer-aware versions of the render primitives ─────────────
export {
  Body,
  Heading,
  Label,
  Display,
  Button,
  View,
  YStack,
  XStack,
  Tag,
  Icon,
} from "./wrapped";
