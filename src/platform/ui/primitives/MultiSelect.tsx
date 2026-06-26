import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";
import { Icon } from "./Icon";
import type { SelectOption } from "./Select";

export interface MultiSelectVariant {
  // trigger
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  minHeight: number;
  paddingVertical: number;
  paddingHorizontal: number;
  color: string;
  placeholderColor: string;
  // menu
  menuBackgroundColor: string;
  menuBorderColor: string;
  menuBorderRadius: number;
  // option rows
  optionSelectedBackgroundColor: string;
  optionSelectedColor: string;
  optionColor: string;
  optionFontSize: number;
  // selected tokens shown in trigger
  tokenBackgroundColor: string;
  tokenColor: string;
  tokenBorderRadius: number;
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
  const theme = useTheme();
  const s = theme.variants.multiSelect?.[variant];
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
    <View style={{ gap: 8 }} testID={testID}>
      {label ? (
        <Text style={{ color: theme.colors.textSecondary, fontSize: s.optionFontSize }}>{label}</Text>
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
                backgroundColor: activeStyle?.backgroundColor ?? s.backgroundColor,
                borderColor: activeStyle?.borderColor ?? s.borderColor,
                borderWidth: s.borderWidth,
                borderRadius: s.borderRadius,
                minHeight: s.minHeight,
                paddingVertical: s.paddingVertical,
                paddingHorizontal: s.paddingHorizontal,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                opacity,
              }}
            >
              <View style={{ flex: 1, gap: 8 }}>
                {selectedOptions.length ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {selectedOptions.map((option) => (
                      <View
                        key={option.value}
                        style={{
                          backgroundColor: s.tokenBackgroundColor,
                          borderRadius: s.tokenBorderRadius,
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text style={{ color: s.tokenColor, fontSize: s.optionFontSize - 1, fontWeight: "600" }}>
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={{ color: s.placeholderColor, fontSize: s.optionFontSize }}>{placeholder}</Text>
                )}
              </View>
              <Icon name="chevron-down" tone="muted" />
            </View>
          );
        }}
      </Pressable>

      {open ? (
        <View
          style={{
            backgroundColor: s.menuBackgroundColor,
            borderWidth: s.borderWidth,
            borderColor: s.menuBorderColor,
            borderRadius: s.menuBorderRadius,
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
                  backgroundColor: isSelected ? s.optionSelectedBackgroundColor : "transparent",
                  paddingVertical: s.paddingVertical,
                  paddingHorizontal: s.paddingHorizontal,
                  borderBottomWidth: index === options.length - 1 ? 0 : 1,
                  borderBottomColor: s.menuBorderColor,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  opacity: option.disabled ? (ix?.disabledOpacity ?? 0.5) : 1,
                }}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ color: isSelected ? s.optionSelectedColor : s.optionColor, fontSize: s.optionFontSize, fontWeight: isSelected ? "600" : "400" }}>
                    {option.label}
                  </Text>
                  {option.description ? (
                    <Text style={{ color: s.placeholderColor, fontSize: s.optionFontSize - 1 }}>{option.description}</Text>
                  ) : null}
                </View>
                {isSelected ? <Icon name="check" tone="accent" /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {helperText ? (
        <Text style={{ color: s.placeholderColor, fontSize: s.optionFontSize - 1 }}>{helperText}</Text>
      ) : null}
    </View>
  );
}
