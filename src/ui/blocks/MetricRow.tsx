import React from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { Block, Icon, Text } from "../primitives"
import type { TextTone } from "../primitives";

/**
 * MetricRow — label + value + trend for metric cards.
 * API: { label, value, unit?, trend?, accentColor? }
 */

interface MetricRowProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  accentColor?: "violet" | "emerald" | "amber" | "sky" | "rose";
}

export function MetricRow({ label, value, unit, trend, accentColor = "sky" }: MetricRowProps) {
  const theme = useTheme();
  const c = theme.colors;
  const accentToneMap = {
    violet: "brand",
    emerald: "successAccent",
    amber: "warning",
    sky: "action",
    rose: "alert",
  } as const satisfies Record<NonNullable<MetricRowProps["accentColor"]>, TextTone>;
  const accentTone = accentToneMap[accentColor];

  const trendIconName: "trending-up" | "trending-down" | "minus" =
    trend !== undefined
      ? trend > 0
        ? "trending-up"
        : trend < 0
          ? "trending-down"
          : "minus"
      : "minus";

  const trendColor =
    trend !== undefined
      ? trend > 0
        ? c.success
        : trend < 0
          ? c.error
          : c.textMuted
      : c.textMuted;

  return (
    <Block space="xs">
      <Text variant="caption" tone={accentTone}>{label}</Text>
      <Block direction="horizontal" align="end" space="xs">
        <Text variant="h3">
          {value}
        </Text>
        {unit && (
          <Text variant="caption" tone="muted">{unit}</Text>
        )}
      </Block>
      {trend !== undefined && (
        <Block direction="horizontal" align="center" space="xs">
          <Block direction="horizontal" align="center" space="none">
            <Icon
              name={trendIconName}
              size="2xs"
              tone={trend > 0 ? "success" : trend < 0 ? "danger" : "muted"}
            />
          </Block>
          <Text
            variant="caption"
            tone={trend > 0 ? "success" : trend < 0 ? "danger" : "muted"}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </Text>
        </Block>
      )}
    </Block>
  );
}
