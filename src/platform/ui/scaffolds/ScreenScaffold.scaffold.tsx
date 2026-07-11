import React from "react";
import {
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { noopUi, type UiStamp } from "../viz";

export type ScreenScaffoldProps = {
  children: React.ReactNode;
  scroll?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  ui?: UiStamp;
  accessibilityLabel?: string;
};

function optionalSlot(
  content: React.ReactNode,
  ui: UiStamp,
  id: "header" | "footer",
  label: string,
) {
  if (content === undefined || content === null || content === false) {
    return null;
  }

  const uiid = ui(id, label).__uiid;
  return (
    <View nativeID={uiid} testID={uiid}>
      {content}
    </View>
  );
}

export function ScreenScaffold({
  children,
  scroll = false,
  header,
  footer,
  safeAreaTop = true,
  safeAreaBottom = true,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = true,
  ui = noopUi,
  accessibilityLabel,
}: ScreenScaffoldProps) {
  const theme = useTheme();
  const edges: Edge[] = [];

  if (safeAreaTop) edges.push("top");
  if (safeAreaBottom) edges.push("bottom");

  const rootUiid = ui("root", "Screen scaffold root").__uiid;
  const contentUiid = ui("content", "Screen scaffold content").__uiid;

  return (
    <SafeAreaView
      accessibilityLabel={accessibilityLabel}
      edges={edges}
      nativeID={rootUiid}
      testID={rootUiid}
      style={[styles.root, { backgroundColor: theme.palette.background }, style]}
    >
      {optionalSlot(header, ui, "header", "Screen scaffold header")}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          nativeID={contentUiid}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          style={styles.contentRegion}
          testID={contentUiid}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          nativeID={contentUiid}
          style={[styles.fillContent, contentContainerStyle]}
          testID={contentUiid}
        >
          {children}
        </View>
      )}
      {optionalSlot(footer, ui, "footer", "Screen scaffold footer")}
    </SafeAreaView>
  );
}

const styles = {
  root: {
    flex: 1,
    minHeight: 0,
  } satisfies ViewStyle,
  contentRegion: {
    flex: 1,
    minHeight: 0,
  } satisfies ViewStyle,
  scrollContent: {
    flexGrow: 1,
  } satisfies ViewStyle,
  fillContent: {
    flex: 1,
    minHeight: 0,
  } satisfies ViewStyle,
};
