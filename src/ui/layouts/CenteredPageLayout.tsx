import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { useViewport } from "../../theme/Viewport";
import { Block } from "../primitives";

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
    <Block frame="fill" paint="page" safeArea="all">
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
    </Block>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    width: "100%",
  },
});
