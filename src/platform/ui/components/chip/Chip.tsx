import React from "react";
import { Pressable } from "../pressable/Pressable";
import { Body } from "../text/Text";
import type { ChipContract } from "./chip.styles";
import type { ChipProps } from "./chip.contract";
export type { ChipContract };
export type { ChipProps };
export { ChipSchema, ChipShapeSchema, ChipFrameSchema } from "./chip.contract";

export type ChipShape = "pill" | "rounded";
export type ChipFrame = "content" | "fill";

export function Chip({
  contract,
  label,
  accessibilityLabel,
  selected = false,
  disabled = false,
  onPress,
  shape = "pill",
  frame = "content",
  testID,
}: ChipProps) {
  const s = contract;
  const borderRadius = shape === "pill" ? s.shape.pillBorderRadius : s.shape.roundedBorderRadius;

  return (
    <Pressable
      contract={{ frame: { ...s.frame, borderRadius, flex: frame === "fill" ? 1 : undefined }, interaction: s.interaction }}
      accessibilityLabel={accessibilityLabel}
      selected={selected}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
    >
      <Body
        color={selected ? (s.text.selectedColor ?? s.text.color) : s.text.color}
        fontSize={s.text.fontSize}
        fontWeight={s.text.fontWeight as never}
        textAlign={frame === "fill" ? "center" : "left"}
      >
        {label}
      </Body>
    </Pressable>
  );
}
