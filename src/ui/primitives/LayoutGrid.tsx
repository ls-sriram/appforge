import React from "react";
import { View, ViewStyle } from "react-native";
import { useViewport } from "../../theme/Viewport";

/**
 * LayoutGrid — responsive grid for dashboard blocks.
 *
 * API:
 *   columns: number of columns (1–4, default 2)
 *   gap: spacing between blocks (default 12)
 *   width: intent for max width
 *     "full"    — fills the container (default)
 *     "narrow"  — caps at 500px (for metric cards)
 *   children: ReactNode (blocks)
 *
 * On mobile: always single column.
 * On tablet+: distributes across columns.
 */

type LayoutGridWidth = "full" | "narrow";

interface LayoutGridProps {
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  width?: LayoutGridWidth;
  children: React.ReactNode;
  testID?: string;
}

const WIDTH_MAP: Record<LayoutGridWidth, number | undefined> = {
  full: undefined,
  narrow: 500,
};

export function LayoutGrid({ columns = 2, gap = 12, width = "full", children, testID }: LayoutGridProps) {
  const viewport = useViewport();
  const cols = viewport.isMobile ? 1 : columns;
  const pct = 100 / cols;
  const maxWidth = WIDTH_MAP[width];
  const gridStyle: ViewStyle = {
    width: "100%",
    maxWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    gap,
  };
  const itemStyle: ViewStyle = {
    width: `${pct}%`,
    gap: gap / 2,
  };

  return (
    <View testID={testID} style={gridStyle}>
      {React.Children.map(children, (child) => (
        <View style={itemStyle}>
          {child}
        </View>
      ))}
    </View>
  );
}
