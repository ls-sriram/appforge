import React from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { Col, Row, Icon, Label, Heading } from "../primitives";
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

  const accentLabelTone = accentTone === "brand" || accentTone === "action" ? "primary" as const : undefined;

  return (
    <Col between="xs">
      <Label size="xs" dim upper tracking="xs">{label}</Label>
      <Row centered between="xs" ai="flex-end">
        <Heading>{String(value)}</Heading>
        {unit && <Label size="xs" dim>{unit}</Label>}
      </Row>
      {trend !== undefined && (
        <Row centered between="xs">
          <Icon
            name={trendIconName}
            size="2xs"
            tone={trend > 0 ? "success" : trend < 0 ? "danger" : "muted"}
          />
          <Label
            size="xs"
            success={trend > 0}
            error={trend < 0}
            dim={trend === 0}
          >
            {trend > 0 ? "+" : ""}{trend}%
          </Label>
        </Row>
      )}
    </Col>
  );
}
