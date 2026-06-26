import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface SelectableChipVariant {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  color: string;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: string | number;
  interaction?: InteractionContract;
}

export type SelectableChipShape = "pill" | "rounded";
export type SelectableChipFrame = "content" | "fill";

interface SelectableChipProps {
  label: string;
  variant: string;
  selected: boolean;
  onPress: () => void;
  shape?: SelectableChipShape;
  frame?: SelectableChipFrame;
  disabled?: boolean;
}

export function SelectableChip({
  label,
  variant,
  selected,
  onPress,
  shape = "pill",
  frame = "content",
  disabled = false,
}: SelectableChipProps) {
  const theme = useTheme();
  const s = theme.variants.selectableChip?.[variant];
  if (!s) throw new Error(`Unknown selectableChip variant "${variant}"`);

  const ix = s.interaction;
  const borderRadius = shape === "pill" ? theme.radii.pill : theme.radii.sm;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => {
        const activeStyle = selected ? ix?.selected
          : pressed ? ix?.pressed
          : hovered ? ix?.hover
          : undefined;

        const opacity = disabled ? (ix?.disabledOpacity ?? 0.5)
          : (activeStyle as { opacity?: number } | undefined)?.opacity ?? 1;

        return {
          backgroundColor: activeStyle?.backgroundColor ?? s.backgroundColor,
          borderColor: activeStyle?.borderColor ?? s.borderColor,
          borderWidth: s.borderWidth,
          borderRadius,
          paddingHorizontal: s.paddingHorizontal,
          paddingVertical: s.paddingVertical,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          flex: frame === "fill" ? 1 : undefined,
          opacity,
        };
      }}
    >
      {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => {
        const activeStyle = selected ? ix?.selected
          : pressed ? ix?.pressed
          : hovered ? ix?.hover
          : undefined;

        return (
          <Text
            style={{
              color: activeStyle?.color ?? s.color,
              fontSize: s.fontSize,
              fontWeight: (selected ? (ix?.selected?.fontWeight ?? s.fontWeight) : s.fontWeight) as any,
              textAlign: frame === "fill" ? "center" : "left",
            }}
          >
            {label}
          </Text>
        );
      }}
    </Pressable>
  );
}
