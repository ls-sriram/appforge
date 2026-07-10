import React from "react";
import { View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Icon } from "../icon/Icon";
import { Body } from "../text/Text";
import type { MenuItemContract } from "./menu-item.styles";
import type { MenuItemProps } from "./menu-item.contract";
export type { MenuItemContract };
export type { MenuItemProps };
export { MenuItemSchema } from "./menu-item.contract";

export function MenuItem({
  contract,
  label,
  accessibilityLabel,
  checked = false,
  disabled = false,
  onPress,
  testID,
}: MenuItemProps) {
  const s = contract;

  return (
    <Pressable
      contract={s}
      role="menuitemcheckbox"
      accessibilityLabel={accessibilityLabel}
      // Reuses the same boolean for both: `selected` drives the visual
      // (interaction.selected background), `checked` drives the
      // accessibilityState the menuitemcheckbox role actually needs —
      // see Pressable's own checked prop for why these are kept separate
      // at the primitive level even though this variant sets both to the
      // same value.
      selected={checked}
      checked={checked}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: s.gap }}>
        <View style={{ width: s.checkIconSize, height: s.checkIconSize, alignItems: "center", justifyContent: "center" }}>
          {checked ? <Icon name="check" size={s.checkIconSize} color={s.checkIconColor} /> : null}
        </View>
        <Body
          color={checked ? (s.text.checkedColor ?? s.text.color) : s.text.color}
          fontSize={s.text.fontSize}
          fontWeight={s.text.fontWeight as never}
        >
          {label}
        </Body>
      </View>
    </Pressable>
  );
}
