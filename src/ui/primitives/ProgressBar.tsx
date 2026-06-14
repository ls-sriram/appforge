/**
 * ─────────────────────────────────────────────────────────────────
 * PROGRESS_BAR — Visual progress indicator.
 *
 * Shows completion percentage with optional label.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Text } from "./Text";

export type ProgressBarTone = "primary" | "success" | "warning" | "danger" | "info" | "action" | "neutral";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  tone?: ProgressBarTone;
  size?: "sm" | "md" | "lg";
}

const HEIGHT_MAP = { sm: 4, md: 8, lg: 12 } as const;

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  tone = "primary",
  size = "md",
}: ProgressBarProps) {
  const t = useTheme();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const height = HEIGHT_MAP[size];
  const barColor =
    tone === "success" ? t.colors.successAccent
      : tone === "warning" ? t.colors.warning
        : tone === "danger" ? t.colors.error
          : tone === "info" ? t.colors.info
            : tone === "action" ? t.colors.actionAccent
              : tone === "neutral" ? t.colors.textMuted
                : t.colors.primary;

  return (
    <View style={{ gap: t.colors.space.xs }}>
      {(label || showPercentage) && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {label && (
            <Text variant="bodySm" tone="secondary">
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text variant="caption" tone="muted">
              {Math.round(pct)}%
            </Text>
          )}
        </View>
      )}
      <View
        style={{
          height,
          borderRadius: t.colors.radii.full,
          backgroundColor: t.colors.surfaceAlt,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: t.colors.radii.full,
            backgroundColor: barColor,
          }}
        />
      </View>
    </View>
  );
}
