import React from "react";
import { Pressable } from "../pressable/Pressable";
import { Icon } from "../icon/Icon";
import type { IconButtonContract } from "./icon-button.styles";
import type { IconButtonProps } from "./icon-button.contract";
export type { IconButtonContract };
export type { IconButtonProps };
export { IconButtonSchema } from "./icon-button.contract";

export function IconButton({
  contract,
  icon,
  accessibilityLabel,
  selected = false,
  disabled = false,
  onPress,
  testID,
}: IconButtonProps) {
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
      <Icon name={icon} size={s.iconSize} color={selected ? (s.selectedIconColor ?? s.iconColor) : s.iconColor} />
    </Pressable>
  );
}

// Same component under both names the spec lists side by side — a
// toolbar-button call site and an icon-button call site are the same
// shape and behavior, not two things to maintain separately.
export const ToolbarButton = IconButton;
