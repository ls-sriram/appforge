import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { useViewport } from "../../theme/Viewport";
import { SafeAreaView } from "react-native-safe-area-context";

type CenteredPageLayoutWidth = "narrow" | "regular";

type Props = {
  children: React.ReactNode;
  width?: CenteredPageLayoutWidth;
};

const MAX_WIDTH: Record<CenteredPageLayoutWidth, number> = {
  narrow: 480,
  regular: 640,
};

export function CenteredPageLayout({ children, width = "narrow" }: Props) {
  const theme = useTheme();
  const viewport = useViewport();
  const horizontalPadding = viewport.isMobile ? theme.colors.space.md : theme.colors.space.xl;
  const verticalPadding = viewport.isMobile ? theme.colors.space.lg : theme.colors.space["2xl"];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.bg }]} edges={["top", "bottom", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          flexGrow: 1,
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { maxWidth: MAX_WIDTH[width] }]}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: "100%",
  },
});
