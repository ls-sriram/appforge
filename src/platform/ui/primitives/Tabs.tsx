import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Icon, type IconName } from "./Icon";
import { Body } from "./Text";

export interface TabOption {
  label: string;
  value: string;
  icon?: IconName;
  disabled?: boolean;
}

export interface TabsProps {
  options: TabOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  testID?: string;
}

export function Tabs({
  options,
  value,
  onValueChange,
  disabled = false,
  testID,
}: TabsProps) {
  const t = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        borderBottomWidth: 1,
        borderBottomColor: t.palette.border,
      }}
      testID={testID}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected, disabled: isDisabled }}
            disabled={isDisabled}
            onPress={() => onValueChange(option.value)}
            testID={testID ? `${testID}-tab-${option.value}` : undefined}
            style={{
              minHeight: 44,
              paddingHorizontal: 12,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 2,
              borderBottomColor: selected ? t.palette.primary : "transparent",
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              {option.icon ? (
                <Icon
                  name={option.icon}
                  size="sm"
                  tone={selected ? "brand" : "muted"}
                />
              ) : null}
              <Body
                tone={selected ? "accent" : "secondary"}
                weight={selected ? "bold" : "regular"}
                size="sm"
              >
                {option.label}
              </Body>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
