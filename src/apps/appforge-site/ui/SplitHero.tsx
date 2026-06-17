import React from "react";
import { View, StyleSheet } from "react-native";

// App-shared layout primitive (Layer 5). An asymmetric two-column split
// (value prop left, CTA right) that wraps to stacked on narrow viewports —
// flex weights the shared Block API doesn't express, so a named View +
// StyleSheet is the sanctioned escape hatch.
export function SplitHero({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>{left}</View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 48,
    alignItems: "flex-start",
  },
  left: { flexGrow: 1, flexBasis: 380, minWidth: 300 },
  right: { flexGrow: 1, flexBasis: 320, minWidth: 280 },
});
