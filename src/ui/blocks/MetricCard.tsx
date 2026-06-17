import React from "react";
import { MetricRow } from "./MetricRow";
import { Card } from "../primitives";

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
    <Card>
      <MetricRow
        label={config.label}
        value={config.value}
        unit={config.unit}
        trend={config.trend}
        accentColor={config.accentColor}
      />
    </Card>
  );
}
