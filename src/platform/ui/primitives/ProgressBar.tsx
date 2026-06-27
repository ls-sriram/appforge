import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface ProgressBarVariant {
  trackColor: string;
  fillColor: string;
  height: number;
  borderRadius: number;
  interaction?: InteractionContract;
}

interface ProgressBarProps {
  value: number;
  total?: number;
  variant: string;
}

export function ProgressBar({ value, total = 100, variant }: ProgressBarProps) {
  const theme = useTheme();
  const s = theme.variants.progressBar?.[variant];
  if (!s) throw new Error(`Unknown progressBar variant "${variant}"`);

  const pct = Math.min(Math.max((value / total) * 100, 0), 100);

  return (
    <View
      style={{
        width: "100%",
        height: s.height,
        borderRadius: s.borderRadius,
        backgroundColor: s.trackColor,
        overflow: "hidden",
      }}
    >
      <View style={{ height: "100%", width: `${pct}%`, backgroundColor: s.fillColor }} />
    </View>
  );
}
