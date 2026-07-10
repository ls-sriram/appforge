import React from "react";
import { View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Icon, type IconName } from "../icon/Icon";
import type { SizingToolbarContract } from "./sizing-toolbar.styles";
import type { SizingToolbarProps } from "./sizing-toolbar.contract";
export type { SizingToolbarContract };
export type { SizingToolbarProps };
export { SizingToolbarSchema } from "./sizing-toolbar.contract";

export type SizingToolbarValue = "sm" | "md" | "lg";

const ORDER: readonly SizingToolbarValue[] = ["sm", "md", "lg"] as const;

const DEFAULT_ICONS: Record<SizingToolbarValue, IconName> = {
  sm: "panel-size-sm",
  md: "panel-size-md",
  lg: "panel-size-lg",
};

const LABELS: Record<SizingToolbarValue, string> = {
  sm: "Small size",
  md: "Medium size",
  lg: "Large size",
};

export function SizingToolbar({
  contract,
  value,
  onChange,
  disabled = false,
  icons,
}: SizingToolbarProps) {
  const s = contract;

  return (
    <View
      accessibilityRole="toolbar"
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: s.container.borderWidth,
        borderColor: s.container.borderColor,
        borderRadius: s.container.borderRadius,
        overflow: "hidden",
        opacity: disabled ? s.container.disabledOpacity : 1,
      }}
    >
      {ORDER.map((option, index) => {
        const selected = option === value;
        const iconName = icons?.[option] ?? DEFAULT_ICONS[option];

        return (
          <Pressable
            key={option}
            accessibilityLabel={LABELS[option]}
            selected={selected}
            disabled={disabled}
            onPress={() => onChange(option)}
            testID={`sizing-toolbar-${option}`}
          >
            {({ focused }) => (
              <View
                style={{
                  minWidth: s.button.minWidth,
                  minHeight: s.button.minHeight,
                  paddingHorizontal: s.button.paddingHorizontal,
                  paddingVertical: s.button.paddingVertical,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selected ? s.button.selectedBackgroundColor : s.button.unselectedBackgroundColor,
                  // borderLeftWidth/Color (the inter-segment divider) is
                  // more specific than borderWidth/Color and would win on
                  // the left edge regardless of declaration order, so the
                  // focus ring needs the divider unset on that edge rather
                  // than layered underneath it.
                  ...(focused
                    ? { borderWidth: s.button.focusBorderWidth, borderColor: s.button.focusBorderColor }
                    : { borderLeftWidth: index === 0 ? 0 : s.button.dividerWidth, borderLeftColor: s.button.dividerColor }),
                }}
              >
                <Icon
                  color={selected ? s.icon.selectedColor : s.icon.unselectedColor}
                  name={iconName}
                  size={s.icon.size}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
