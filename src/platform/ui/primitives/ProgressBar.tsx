import React from "react";
import { View } from "@tamagui/core";

export type ProgressBarTone = "primary" | "success" | "warning" | "danger";

const BAR_COLOR: Record<ProgressBarTone, string> = {
  primary: "$primary",
  success: "$success",
  warning: "$warning",
  danger:  "$error",
};

interface ProgressBarProps {
  value: number;
  total?: number;
  tone?: ProgressBarTone;
}

export function ProgressBar({ value, total = 100, tone = "primary" }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / total) * 100, 0), 100);
  return (
    <View w="100%" h={4} br={9999} bg="$surfaceAlt" overflow="hidden">
      <View h="100%" bg={BAR_COLOR[tone]} w={`${pct}%`} />
    </View>
  );
}
