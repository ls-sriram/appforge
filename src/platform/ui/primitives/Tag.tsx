import React from "react";
import { Text, View } from "@tamagui/core";
import { useTheme } from "../../theme/ThemeProvider";

export interface TagProps {
  label: string;
  tone?: "muted" | "secondary" | "accent" | "action" | "success" | "warning" | "danger" | "info";
}

export function Tag({ label, tone = "muted" }: TagProps) {
  const t = useTheme();
  const textColor =
    tone === "secondary"
      ? t.colors.textSecondary
      : tone === "accent"
        ? t.colors.primary
        : tone === "action"
          ? t.colors.actionAccent
          : tone === "success"
            ? t.colors.success
            : tone === "warning"
              ? t.colors.warning
              : tone === "danger"
                ? t.colors.error
                : tone === "info"
                  ? t.colors.info
                  : t.colors.textMuted;
  const bg =
    tone === "accent"
      ? t.colors.accentMuted
      : tone === "action"
        ? t.colors.actionAccentMuted
        : tone === "success"
          ? t.colors.successAccentMuted
          : tone === "warning"
            ? t.colors.warningMuted
            : tone === "danger"
              ? t.colors.errorMuted
              : tone === "info"
                ? t.colors.infoMuted
                : t.colors.surfaceWash;

  return (
    <View
      fd="row"
      ai="center"
      py={6}
      px={10}
      br={9999}
      bg={bg}
      alignSelf="flex-start"
    >
      <Text color={textColor} fontSize={12} fontFamily="$bold">
        {label}
      </Text>
    </View>
  );
}
