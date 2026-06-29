import React from "react";
import { Pressable, Text, View } from "react-native";
import { useUI } from "../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";
import { Icon } from "./Icon";
import type { SelectOption } from "./Select";

export interface MultiSelectContract {
  label: {
    color: string;
    fontSize: number;
  };
  trigger: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    minHeight: number;
    paddingVertical: number;
    paddingHorizontal: number;
    gap: number;
  };
  text: {
    color: string;
    fontFamily: string;
    placeholderColor: string;
  };
  icon: {
    color: string;
    size: number;
    selectedColor: string;
  };
  menu: {
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
  };
  option: {
    selectedBackgroundColor: string;
    selectedColor: string;
    color: string;
    fontSize: number;
    fontWeight: string | number;
    selectedFontWeight: string | number;
    descriptionFontSize: number;
    descriptionColor: string;
    rowGap: number;
  };
  token: {
    backgroundColor: string;
    color: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    fontWeight: string | number;
    fontSize: number;
  };
  helper: {
    color: string;
    fontSize: number;
  };
  layout: {
    fieldGap: number;
  };
  interaction?: InteractionContract;
}


export interface MultiSelectProps {
  variant: string;
  options: SelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  testID?: string;
}

export function MultiSelect({
  variant,
  options,
  value,
  onValueChange,
  placeholder = "Select one or more options",
  label,
  helperText,
  disabled = false,
  testID,
}: MultiSelectProps) {
  const { contracts } = useUI();
  const s = contracts.multiSelect?.[variant];
  if (!s) throw new Error(`Unknown multiSelect variant "${variant}"`);

  const [open, setOpen] = React.useState(false);
  const selectedOptions = options.filter((o) => value.includes(o.value));
  const ix = s.interaction;

  const toggleValue = React.useCallback(
    (nextValue: string) => {
      const has = value.includes(nextValue);
      onValueChange(has ? value.filter((v) => v !== nextValue) : [...value, nextValue]);
    },
    [onValueChange, value],
  );

  return (
    <View style={{ gap: s.layout.fieldGap }} testID={testID}>
      {label ? (
        <Text style={{ color: s.label.color, fontSize: s.label.fontSize, fontFamily: s.text.fontFamily }}>{label}</Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen((v) => !v)}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => {
          const activeStyle = pressed ? ix?.pressed : hovered ? ix?.hover : undefined;
          const opacity = disabled ? (ix?.disabledOpacity ?? 0.5)
            : (activeStyle as { opacity?: number } | undefined)?.opacity ?? 1;

          return (
            <View
              style={{
                backgroundColor: activeStyle?.backgroundColor ?? s.trigger.backgroundColor,
                borderColor: activeStyle?.borderColor ?? s.trigger.borderColor,
                borderWidth: s.trigger.borderWidth,
                borderRadius: s.trigger.borderRadius,
                minHeight: s.trigger.minHeight,
                paddingVertical: s.trigger.paddingVertical,
                paddingHorizontal: s.trigger.paddingHorizontal,
                flexDirection: "row",
                alignItems: "center",
                gap: s.trigger.gap,
                opacity,
              }}
            >
              <View style={{ flex: 1, gap: s.layout.fieldGap }}>
                {selectedOptions.length ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: s.layout.fieldGap }}>
                    {selectedOptions.map((option) => (
                      <View
                        key={option.value}
                        style={{
                          backgroundColor: s.token.backgroundColor,
                          borderRadius: s.token.borderRadius,
                          paddingVertical: s.token.paddingVertical,
                          paddingHorizontal: s.token.paddingHorizontal,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text style={{ color: s.token.color, fontSize: s.token.fontSize, fontWeight: s.token.fontWeight as any, fontFamily: s.text.fontFamily }}>
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={{ color: s.text.placeholderColor, fontSize: s.option.fontSize, fontFamily: s.text.fontFamily }}>{placeholder}</Text>
                )}
              </View>
              <Icon color={s.icon.color} name="chevron-down" size={s.icon.size} />
            </View>
          );
        }}
      </Pressable>

      {open ? (
        <View
          style={{
            backgroundColor: s.menu.backgroundColor,
            borderWidth: s.trigger.borderWidth,
            borderColor: s.menu.borderColor,
            borderRadius: s.menu.borderRadius,
            overflow: "hidden",
          }}
          testID={testID ? `${testID}-menu` : undefined}
        >
          {options.map((option, index) => {
            const isSelected = value.includes(option.value);
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ disabled: option.disabled, selected: isSelected }}
                disabled={option.disabled}
                onPress={() => toggleValue(option.value)}
                testID={testID ? `${testID}-option-${option.value}` : undefined}
                style={{
                  backgroundColor: isSelected ? s.option.selectedBackgroundColor : "transparent",
                  paddingVertical: s.trigger.paddingVertical,
                  paddingHorizontal: s.trigger.paddingHorizontal,
                  borderBottomWidth: index === options.length - 1 ? 0 : 1,
                  borderBottomColor: s.menu.borderColor,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: s.trigger.gap,
                  opacity: option.disabled ? (ix?.disabledOpacity ?? 0.5) : 1,
                }}
              >
                <View style={{ flex: 1, gap: s.option.rowGap }}>
                  <Text
                    style={{
                      color: isSelected ? s.option.selectedColor : s.option.color,
                      fontSize: s.option.fontSize,
                      fontWeight: (isSelected ? s.option.selectedFontWeight : s.option.fontWeight) as any,
                      fontFamily: s.text.fontFamily,
                    }}
                  >
                    {option.label}
                  </Text>
                  {option.description ? <Text style={{ color: s.option.descriptionColor, fontSize: s.option.descriptionFontSize, fontFamily: s.text.fontFamily }}>{option.description}</Text> : null}
                </View>
                {isSelected ? <Icon color={s.icon.selectedColor} name="check" size={s.icon.size} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {helperText ? (
        <Text style={{ color: s.helper.color, fontSize: s.helper.fontSize, fontFamily: s.text.fontFamily }}>{helperText}</Text>
      ) : null}
    </View>
  );
}
