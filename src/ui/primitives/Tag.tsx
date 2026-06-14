/**
 * ─────────────────────────────────────────────────────────────────
 * TAG — Small categorical label.
 *
 * Lighter than a badge, used for categorization.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Text as RNText, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { resolveSemanticTone, type SemanticTone } from "./SemanticTone";

export interface TagProps {
  label: string;
  tone?: Extract<SemanticTone, "muted" | "secondary" | "accent" | "action" | "success" | "warning" | "danger" | "info">;
}

export function Tag({ label, tone = "muted" }: TagProps) {
  const t = useTheme();
  const tagColor = resolveSemanticTone(t, tone);
  const bg =
    tone === "accent" ? t.colors.accentMuted
      : tone === "action" ? t.colors.actionAccentMuted
        : tone === "success" ? t.colors.successAccentMuted
          : tone === "warning" ? t.colors.warningMuted
            : tone === "danger" ? t.colors.errorMuted
              : tone === "info" ? t.colors.infoMuted
                : t.colors.surfaceWash;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: t.shapes.tag.paddingVertical,
        paddingHorizontal: t.shapes.tag.paddingHorizontal,
        borderRadius: t.shapes.tag.borderRadius,
        backgroundColor: bg,
        alignSelf: "flex-start",
      }}
    >
      <RNText
        style={{
          color: tagColor,
          fontSize: t.shapes.tag.fontSize,
          fontWeight: t.shapes.tag.fontWeight,
          lineHeight: t.shapes.tag.fontSize * 1.4,
        }}
      >
        {label}
      </RNText>
    </View>
  );
}
