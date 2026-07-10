import React from "react";
import { View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Body } from "../text/Text";
import type { ListItemContract } from "./list-item.styles";
import type { ListItemProps } from "./list-item.contract";
export type { ListItemContract };
export type { ListItemProps };
export { ListItemSchema, ListItemVariantSchema } from "./list-item.contract";

export function ListItem({
  contract,
  variant = "button",
  accessibilityLabel,
  label,
  selected = false,
  disabled = false,
  onPress,
  leading,
  trailing,
  trailingAction,
  children,
  testID,
}: ListItemProps) {
  const s = contract;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        contract={s}
        role={variant}
        accessibilityLabel={accessibilityLabel}
        selected={selected}
        disabled={disabled}
        onPress={onPress}
        testID={testID}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: s.gap, flex: 1 }}>
          {leading}
          <View style={{ flex: 1 }}>
            {children ?? (label !== undefined ? (
              <Body
                color={selected ? (s.text.selectedColor ?? s.text.color) : s.text.color}
                fontSize={s.text.fontSize}
                fontWeight={s.text.fontWeight as never}
              >
                {label}
              </Body>
            ) : null)}
          </View>
          {trailing}
        </View>
      </Pressable>
      {trailingAction}
    </View>
  );
}
