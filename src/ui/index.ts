import { styled, View } from "@tamagui/core";
import { ScrollView as RNScrollView } from "react-native";

export {
  Text,
  View,
  Theme,
  styled,
  useTheme,
  TamaguiProvider,
  type GetProps,
} from "@tamagui/core";
export { SafeAreaView } from "react-native-safe-area-context";
export { UIProvider } from "./Provider";
export { config } from "./config";
export { Display, Heading, Label, Body } from "./primitives/Text";
export { Button } from "./primitives/Button";
export { Input } from "./primitives/Input";
export { TextArea } from "./primitives/TextArea";
export { Icon, type IconName, type IconSize, type IconTone } from "./primitives/Icon";
export { SelectableChip } from "./primitives/SelectableChip";
export type {
  SelectableChipSize,
  SelectableChipShape,
  SelectableChipFrame,
} from "./primitives/SelectableChip";
export { Tag } from "./primitives/Tag";
export type { TagProps } from "./primitives/Tag";

export const Stack = View;
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
