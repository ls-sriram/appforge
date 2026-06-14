/**
 * ─────────────────────────────────────────────────────────────────
 * BADGE — Status indicator pill.
 *
 * Variants: default, success, warning, error, info
 * Sizes: sm, md
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Text as RNText, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({
  label,
  variant = "default",
  size = "md",
  dot = false,
}: BadgeProps) {
  const t = useTheme();
  const shape = t.shapes.badge[variant];

  const sizeScale = size === "sm" ? 0.85 : 1;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: shape.paddingVertical * sizeScale,
        paddingHorizontal: shape.paddingHorizontal * sizeScale,
        borderRadius: t.colors.radii.full,
        backgroundColor: shape.backgroundColor,
        alignSelf: "flex-start",
      }}
    >
      {dot && (
        <View
          style={{
            width: 6 * sizeScale,
            height: 6 * sizeScale,
            borderRadius: t.colors.radii.full,
            backgroundColor: shape.color,
          }}
        />
      )}
      <RNText
        style={{
          color: shape.color,
          fontSize: shape.fontSize * sizeScale,
          fontWeight: shape.fontWeight,
          lineHeight: shape.fontSize * 1.4 * sizeScale,
        }}
      >
        {label}
      </RNText>
    </View>
  );
}
