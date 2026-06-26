import React from "react";
import { View } from "@tamagui/core";
import { useTheme } from "../../theme/ThemeProvider";

interface ProgressBarProps {
  value: number;
  total?: number;
  tone?: string;
}

export function ProgressBar({ value, total = 100, tone = "primary" }: ProgressBarProps) {
  const theme = useTheme();
  const s = theme.variants.progressBar?.[tone];
  const pct = Math.min(Math.max((value / total) * 100, 0), 100);

  return (
    <View
      w="100%"
      overflow="hidden"
      style={{
        height: s?.height,
        borderRadius: s?.borderRadius,
        backgroundColor: s?.trackColor,
      }}
    >
      <View
        h="100%"
        style={{
          width: `${pct}%`,
          backgroundColor: s?.fillColor,
        }}
      />
    </View>
  );
}
