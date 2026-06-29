import React from "react";
import { View } from "react-native";
import type { InteractionContract } from "../contracts/interaction";

export interface ProgressBarContract {
  track: {
    color: string;
    height: number;
    borderRadius: number;
  };
  fill: {
    color: string;
  };
  interaction?: InteractionContract;
}


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
