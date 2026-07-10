import React from "react";
import { View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Body } from "../text/Text";
import type { CardContract } from "./card.styles";
import type { CardProps } from "./card.contract";
export type { CardContract };
export type { CardProps };
export { CardSchema } from "./card.contract";

export function Card({
  contract,
  accessibilityLabel,
  title,
  subtitle,
  leading,
  selected = false,
  disabled = false,
  onPress,
  children,
  testID,
}: CardProps) {
  const s = contract;

  return (
    <Pressable
      contract={s}
      accessibilityLabel={accessibilityLabel}
      selected={selected}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
    >
      <View style={{ flexDirection: leading ? "row" : "column", alignItems: leading ? "flex-start" : "stretch", gap: s.gap }}>
        {leading}
        <View style={{ flex: 1, gap: s.gap }}>
          {title !== undefined ? (
            <Body
              color={selected ? (s.title.selectedColor ?? s.title.color) : s.title.color}
              fontSize={s.title.fontSize}
              fontWeight={s.title.fontWeight as never}
            >
              {title}
            </Body>
          ) : null}
          {subtitle !== undefined ? (
            <Body color={s.subtitle.color} fontSize={s.subtitle.fontSize} fontWeight={s.subtitle.fontWeight as never}>
              {subtitle}
            </Body>
          ) : null}
          {children}
        </View>
      </View>
    </Pressable>
  );
}
