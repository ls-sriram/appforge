import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Text } from "./Text";

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
  const containerStyle: ViewStyle = {
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
  };
  const labelTone = selected ? "inverse" : "secondary";
  const labelVariant = size === "sm" ? "bodySm" : "caption";
  const labelWeight = selected ? "semibold" : "regular";
  const pressedStyle: ViewStyle = { opacity: disabled ? 0.5 : 0.8 };

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [containerStyle, pressed && pressedStyle]}>
      <Text variant={labelVariant} tone={labelTone} weight={labelWeight} align={frame === "fill" ? "center" : "left"}>
        {label}
      </Text>
    </Pressable>
  );
}
