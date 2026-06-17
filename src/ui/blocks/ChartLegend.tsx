import React from "react";
import { StyleSheet, View } from "react-native"; // View: 8×8 color dot (pixel-exact)
import { useTheme } from "../../theme/ThemeProvider";
import { Row, MetaText } from "../primitives"

/**
 * ChartLegend — color dot + label pairs for chart blocks.
 * API: { items: [{ color, label }] }
 */

export type ChartLegendTone = "primary" | "success" | "warning" | "error" | "info";

export interface LegendItem {
  tone: ChartLegendTone;
  label: string;
}

interface ChartLegendProps {
  items: LegendItem[];
}

function ColorDot({ color }: { color: string }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

export function ChartLegend({ items }: ChartLegendProps) {
  const theme = useTheme();
  const c = theme.colors;
  const toneColor: Record<ChartLegendTone, string> = {
    primary: c.primary,
    success: c.success,
    warning: c.warning,
    error: c.error,
    info: c.info,
  };

  return (
    <Row between="sm" flexWrap="wrap">
      {items.map((item, i) => (
        <Row key={i} centered between="xs">
          <ColorDot color={toneColor[item.tone]} />
          <MetaText>{item.label}</MetaText>
        </Row>
      ))}
    </Row>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});
