import React from "react";
import { Pressable, Text, View } from "react-native";
import type { InteractionContract } from "../contracts/interaction";
import { Icon } from "./Icon";

export interface SelectContract {
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
    color: string;
    selectedColor: string;
    fontSize: number;
    fontWeight: string | number;
    selectedFontWeight: string | number;
    descriptionFontSize: number;
    descriptionColor: string;
    rowGap: number;
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


export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  contract: SelectContract;
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
  contract,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  helperText,
  disabled = false,
  testID,
}: SelectProps) {
  const s = contract;

  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);
  const ix = s.interaction;

  const handleSelect = React.useCallback(
    (nextValue: string) => { onValueChange(nextValue); setOpen(false); },
    [onValueChange],
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
              <View style={{ flex: 1 }}>
                <Text style={{ color: selected ? s.text.color : s.text.placeholderColor, fontSize: s.option.fontSize, fontFamily: s.text.fontFamily }}>
                  {selected?.label ?? placeholder}
                </Text>
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
                  {option.description ? (
                    <Text style={{ color: s.option.descriptionColor, fontSize: s.option.descriptionFontSize, fontFamily: s.text.fontFamily }}>
                      {option.description}
                    </Text>
                  ) : null}
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
