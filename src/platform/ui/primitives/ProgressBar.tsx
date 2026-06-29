import React from "react";
import { View } from "react-native";
import { useUI } from "../theme/ThemeProvider";
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
  value: number;
  total?: number;
  variant: string;
}

export function ProgressBar({ value, total = 100, variant }: ProgressBarProps) {
  const { contracts } = useUI();
  const s = contracts.progressBar?.[variant];
  if (!s) throw new Error(`Unknown progressBar variant "${variant}"`);

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
