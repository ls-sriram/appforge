import React from "react";
import { Text } from "@tamagui/core";
import { Pressable } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export type SelectableChipSize = "sm" | "md";
export type SelectableChipShape = "pill" | "rounded";
export type SelectableChipFrame = "content" | "fill";

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  size?: SelectableChipSize;
  shape?: SelectableChipShape;
  frame?: SelectableChipFrame;
  disabled?: boolean;
}

export function SelectableChip({
  label,
  selected,
  onPress,
  size = "sm",
  shape = "pill",
  frame = "content",
  disabled = false,
}: SelectableChipProps) {
  const t = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: selected ? t.colors.textPrimary : t.colors.surfaceAlt,
        borderColor: selected ? t.colors.textPrimary : t.colors.border,
        borderWidth: 1,
        borderRadius: shape === "pill" ? t.colors.radii.pill : t.colors.radii.sm,
        paddingHorizontal: size === "sm" ? 12 : 14,
        paddingVertical: size === "sm" ? 6 : 7,
        alignItems: "center",
        justifyContent: "center",
        flex: frame === "fill" ? 1 : undefined,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        color={selected ? t.colors.textInverse : t.colors.textSecondary}
        fontFamily={selected ? "$bold" : "$reg"}
        fontSize={size === "sm" ? "$2" : "$1"}
        textAlign={frame === "fill" ? "center" : "left"}
      >
        {label}
      </Text>
    </Pressable>
  );
}
