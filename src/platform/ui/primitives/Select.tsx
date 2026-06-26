import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";
import { Icon } from "./Icon";

export interface SelectVariant {
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
  interaction?: InteractionContract;
}

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  variant: string;
  options: SelectOption[];
  value?: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  testID?: string;
}

export function Select({
  variant,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  helperText,
  disabled = false,
  testID,
}: SelectProps) {
  const theme = useTheme();
  const s = theme.variants.select?.[variant];
  if (!s) throw new Error(`Unknown select variant "${variant}"`);

  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);
  const ix = s.interaction;

  const handleSelect = React.useCallback(
    (nextValue: string) => { onValueChange(nextValue); setOpen(false); },
    [onValueChange],
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
              <View style={{ flex: 1 }}>
                <Text style={{ color: selected ? s.color : s.placeholderColor, fontSize: s.optionFontSize }}>
                  {selected?.label ?? placeholder}
                </Text>
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
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ disabled: option.disabled, selected: isSelected }}
                disabled={option.disabled}
                onPress={() => handleSelect(option.value)}
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
                    <Text style={{ color: s.placeholderColor, fontSize: s.optionFontSize - 1 }}>
                      {option.description}
                    </Text>
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
