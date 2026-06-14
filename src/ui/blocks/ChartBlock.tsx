import React from "react";
import Svg, { Rect as SvgRect } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";
import { ChartLegend } from "./ChartLegend";
import { Block, Skeleton, Text } from "../primitives"
import { Panel } from "../panels";

export type ChartType = "bar" | "line" | "area";
export type ChartTheme = "primary" | "success" | "warning" | "error" | "info";
export type ChartSize = "sm" | "md" | "lg";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartBlockConfig {
  type: ChartType;
  data: ChartDataPoint[];
  title?: string;
  theme?: ChartTheme;
  size?: ChartSize;
  legend?: { theme: ChartTheme; label: string }[];
}

interface ChartBlockProps {
  config: ChartBlockConfig;
  loading?: boolean;
}

const SIZE_MAP: Record<ChartSize, number> = {
  sm: 120,
  md: 180,
  lg: 240,
};

export function ChartBlock({ config, loading = false }: ChartBlockProps) {
  const c = useTheme().colors;
  const height = SIZE_MAP[config.size ?? "md"];
  const themeColors: Record<ChartTheme, string> = {
    primary: c.primary,
    success: c.success,
    warning: c.warning,
    error: c.error,
    info: c.info,
  };

  if (loading) {
    return (
      <Block>
        <Panel>
          <Block space="sm">
            <Skeleton height={20} variant="text" width="60%" />
            <Skeleton height={height} />
          </Block>
        </Panel>
      </Block>
    );
  }

  if (!config.data.length) {
    return (
      <Block>
        <Panel>
          <Text variant="bodySm">No data</Text>
        </Panel>
      </Block>
    );
  }

  const maxValue = Math.max(...config.data.map((d) => d.value), 1);
  const width = 300;
  const barWidth = Math.max(12, Math.floor(width / (config.data.length * 2)));
  const color = themeColors[config.theme ?? "primary"];

  return (
    <Block>
      <Panel>
        <Block space="sm">
          {config.title ? <Text variant="bodySm">{config.title}</Text> : null}
          <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {config.data.map((d, i) => {
              const h = (d.value / maxValue) * (height - 12);
              const x = i * (barWidth * 2) + 8;
              const y = height - h;
              return <SvgRect key={d.label} x={x} y={y} width={barWidth} height={h} rx={3} fill={color} />;
            })}
          </Svg>
          {config.legend ? <ChartLegend items={config.legend.map((l) => ({ tone: l.theme, label: l.label }))} /> : null}
        </Block>
      </Panel>
    </Block>
  );
}
