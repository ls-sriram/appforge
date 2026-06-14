import React from "react";
import { MetricRow } from "./MetricRow";
import { Block } from "../primitives"
import { Panel } from "../panels";

/**
 * MetricCard — KPI display block with bold dark theme.
 *
 * API:
 *   config: { label, value, unit?, trend?, accentColor? }
 */

type AccentColor = "violet" | "emerald" | "amber" | "sky" | "rose";

export interface MetricCardConfig {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  accentColor?: AccentColor;
}

interface MetricCardProps {
  config: MetricCardConfig;
}

export function MetricCard({ config }: MetricCardProps) {
  return (
    <Block>
      <Panel>
        <MetricRow
          label={config.label}
          value={config.value}
          unit={config.unit}
          trend={config.trend}
          accentColor={config.accentColor}
        />
      </Panel>
    </Block>
  );
}
