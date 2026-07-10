import React from "react";
import { View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Icon } from "../icon/Icon";
import { Body } from "../text/Text";

import type { TabsContract } from "./tabs.styles";
import type { TabOption, TabsProps } from "./tabs.contract";
export type { TabsContract };
export type { TabOption, TabsProps };
export { TabOptionSchema, TabsSchema } from "./tabs.contract";

export function Tabs({
  contract,
  options,
  value,
  onValueChange,
  disabled = false,
  testID,
}: TabsProps) {
  const s = contract;

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        borderBottomWidth: s.list.borderWidth,
        borderBottomColor: s.list.borderColor,
      }}
      testID={testID}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <Pressable
            key={option.value}
            role="tab"
            accessibilityLabel={option.label}
            selected={selected}
            disabled={isDisabled}
            onPress={() => onValueChange(option.value)}
            testID={testID ? `${testID}-tab-${option.value}` : undefined}
          >
            {({ focused }) => (
              <View
                style={{
                  minHeight: s.item.minHeight,
                  paddingHorizontal: s.item.paddingHorizontal,
                  paddingVertical: s.item.paddingVertical,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: focused ? s.item.focusBorderWidth : s.item.borderWidth,
                  borderBottomColor: focused
                    ? s.item.focusBorderColor
                    : selected
                      ? s.item.selectedBorderColor
                      : s.item.unselectedBorderColor,
                  opacity: isDisabled ? s.item.disabledOpacity : 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: s.item.gap,
                  }}
                >
                  {option.icon ? (
                    <Icon
                      color={selected ? s.icon.selectedColor : s.icon.unselectedColor}
                      name={option.icon}
                      size={s.icon.size}
                    />
                  ) : null}
                  <Body
                    color={selected ? s.text.selectedColor : s.text.unselectedColor}
                    fontFamily={selected ? s.text.selectedFontFamily : s.text.unselectedFontFamily}
                    fontSize={s.text.fontSize}
                    lineHeight={s.text.lineHeight}
                  >
                    {option.label}
                  </Body>
                </View>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
