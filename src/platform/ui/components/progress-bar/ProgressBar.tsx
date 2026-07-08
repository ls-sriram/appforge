import React from "react";
import { View } from "react-native";
import type { ProgressBarContract } from "./progress-bar.styles";
export type { ProgressBarContract };


interface ProgressBarProps {
  contract: ProgressBarContract;
  value: number;
  total?: number;
}

export function ProgressBar({ contract, value, total = 100 }: ProgressBarProps) {
  const s = contract;

  const pct = Math.min(Math.max((value / total) * 100, 0), 100);

  return (
    <View
      style={{
        width: "100%",
        height: s.track.height,
        borderRadius: s.track.borderRadius,
        backgroundColor: s.track.color,
        overflow: "hidden",
      }}
    >
      <View style={{ height: "100%", width: `${pct}%`, backgroundColor: s.fill.color }} />
    </View>
  );
}
