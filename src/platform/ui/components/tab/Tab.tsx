import React from "react";
import { View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Body } from "../text/Text";
import type { TabContract } from "./tab.styles";
import type { TabProps, TabSegmentOption } from "./tab.contract";
export type { TabContract };
export type { TabProps, TabSegmentOption };
export { TabSchema, TabOptionSchema } from "./tab.contract";

export function Tab({ contract, options, value, onValueChange, disabled = false, testID }: TabProps) {
  const s = contract;

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        backgroundColor: s.track.backgroundColor,
        borderRadius: s.track.borderRadius,
        padding: s.track.padding,
      }}
      testID={testID}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <Pressable
            key={option.value}
            contract={{
              frame: {
                borderRadius: s.segment.borderRadius,
                paddingHorizontal: s.segment.paddingHorizontal,
                paddingVertical: s.segment.paddingVertical,
                minHeight: s.segment.minHeight,
                flex: 1,
              },
              interaction: s.interaction,
            }}
            role="tab"
            accessibilityLabel={option.label}
            selected={selected}
            disabled={isDisabled}
            onPress={() => onValueChange(option.value)}
            testID={testID ? `${testID}-tab-${option.value}` : undefined}
          >
            <Body
              color={selected ? s.text.selectedColor : s.text.unselectedColor}
              fontSize={s.text.fontSize}
              lineHeight={s.text.lineHeight}
              fontWeight={(selected ? s.text.selectedFontWeight : s.text.fontWeight) as never}
              textAlign="center"
            >
              {option.label}
            </Body>
          </Pressable>
        );
      })}
    </View>
  );
}
