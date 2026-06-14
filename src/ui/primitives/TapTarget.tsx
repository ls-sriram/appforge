import React from "react";
import { TouchableOpacity } from "react-native";

export type TapTargetFeedback = "none" | "soft" | "default" | "strong";

interface TapTargetProps {
  children: React.ReactNode;
  onPress?: () => void;
  feedback?: TapTargetFeedback;
  disabled?: boolean;
}

export function TapTarget({
  children,
  onPress,
  feedback = "default",
  disabled = false,
}: TapTargetProps) {
  const activeOpacity =
    feedback === "none" ? 1
      : feedback === "soft" ? 0.9
        : feedback === "strong" ? 0.6
          : 0.75;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity} disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
}
