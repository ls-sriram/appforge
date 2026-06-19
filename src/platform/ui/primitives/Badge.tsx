import React from "react";
import { View } from "@tamagui/core";
import { Body } from "./Text";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "muted";

const BG: Record<BadgeTone, string> = {
  success: "$successMuted",
  warning: "$warningMuted",
  danger:  "$errorMuted",
  info:    "$infoMuted",
  muted:   "$surfaceAlt",
};
const BORDER: Record<BadgeTone, string> = {
  success: "$success",
  warning: "$warning",
  danger:  "$error",
  info:    "$info",
  muted:   "$border",
};
const COLOR: Record<BadgeTone, string> = {
  success: "$success",
  warning: "$warning",
  danger:  "$error",
  info:    "$info",
  muted:   "$textMuted",
};

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = "muted" }: BadgeProps) {
  return (
    <View
      fd="row"
      ai="center"
      py={4}
      px={8}
      br={9999}
      alignSelf="flex-start"
      bg={BG[tone]}
      borderColor={BORDER[tone]}
      borderWidth={1}
    >
      <Body color={COLOR[tone]} size="xs" weight="bold">
        {label}
      </Body>
    </View>
  );
}
