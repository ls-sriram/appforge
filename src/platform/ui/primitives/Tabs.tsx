import React from "react";
import { Pressable, View } from "react-native";
import { useUI } from "../theme/ThemeProvider";
import { Icon, type IconName, type IconTone } from "./Icon";
import { Body } from "./Text";

export interface TabsVariant {
  listBorderWidth: number;
  listBorderColor: string;
  itemMinHeight: number;
  itemPaddingHorizontal: number;
  itemPaddingVertical: number;
  itemGap: number;
  itemBorderWidth: number;
  selectedBorderColor: string;
  unselectedBorderColor: string;
  disabledOpacity: number;
  selectedIconTone: IconTone;
  unselectedIconTone: IconTone;
  selectedTextTone: React.ComponentProps<typeof Body>["tone"];
  unselectedTextTone: React.ComponentProps<typeof Body>["tone"];
}

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
  variant?: string;
  disabled?: boolean;
  testID?: string;
}

export function Tabs({
  options,
  value,
  onValueChange,
  variant = "default",
  disabled = false,
  testID,
}: TabsProps) {
  const { variants } = useUI();
  const s = variants.tabs?.[variant];
  if (!s) throw new Error(`Unknown tabs variant "${variant}"`);

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        borderBottomWidth: s.listBorderWidth,
        borderBottomColor: s.listBorderColor,
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
              minHeight: s.itemMinHeight,
              paddingHorizontal: s.itemPaddingHorizontal,
              paddingVertical: s.itemPaddingVertical,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: s.itemBorderWidth,
              borderBottomColor: selected ? s.selectedBorderColor : s.unselectedBorderColor,
              opacity: isDisabled ? s.disabledOpacity : 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: s.itemGap,
              }}
            >
              {option.icon ? (
                <Icon
                  name={option.icon}
                  size="sm"
                  tone={selected ? s.selectedIconTone : s.unselectedIconTone}
                />
              ) : null}
              <Body
                tone={selected ? s.selectedTextTone : s.unselectedTextTone}
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
