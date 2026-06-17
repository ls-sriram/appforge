import React from "react";
import { View, StyleSheet } from "react-native";

// App-shared layout primitive (Layer 5). Centers page content at a readable
// max width — pixel geometry the shared Block API doesn't express, so a named
// View + StyleSheet is the sanctioned escape hatch.
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
