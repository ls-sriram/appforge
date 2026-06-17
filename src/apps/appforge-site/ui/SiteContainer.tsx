import React from "react";
import { View, StyleSheet } from "react-native";

// App-shared layout primitive. Centers page content at a readable max width.
// The fixed geometry is specific enough that a named RN View wrapper is
// clearer than broadening the shared Tamagui surface.
const MAX_WIDTH = 1040;

export function SiteContainer({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { width: "100%", alignItems: "center" },
  inner: { width: "100%", maxWidth: MAX_WIDTH },
});
