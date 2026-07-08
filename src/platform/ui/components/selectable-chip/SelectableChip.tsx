import React from "react";
import { Pressable, Text } from "react-native";
import type { SelectableChipContract } from "./selectable-chip.styles";
export type { SelectableChipContract };


export type SelectableChipShape = "pill" | "rounded";
export type SelectableChipFrame = "content" | "fill";

interface SelectableChipProps {
  contract: SelectableChipContract;
  label: string;
  selected: boolean;
  onPress: () => void;
  shape?: SelectableChipShape;
  frame?: SelectableChipFrame;
  disabled?: boolean;
}

export function SelectableChip({
  contract,
  label,
  selected,
  onPress,
  shape = "pill",
  frame = "content",
  disabled = false,
}: SelectableChipProps) {
  const s = contract;

  const ix = s.interaction;
  const borderRadius = shape === "pill" ? s.shape.pillBorderRadius : s.shape.roundedBorderRadius;

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
          backgroundColor: activeStyle?.backgroundColor ?? s.container.backgroundColor,
          borderColor: activeStyle?.borderColor ?? s.container.borderColor,
          borderWidth: s.container.borderWidth,
          borderRadius,
          paddingHorizontal: s.container.paddingHorizontal,
          paddingVertical: s.container.paddingVertical,
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
              color: activeStyle?.color ?? s.text.color,
              fontSize: s.text.fontSize,
              fontWeight: (selected ? (ix?.selected?.fontWeight ?? s.text.fontWeight) : s.text.fontWeight) as any,
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
