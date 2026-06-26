import { styled, View } from "@tamagui/core";
import React from "react";
import { Pressable } from "react-native";
import { Icon } from "./Icon";
import { Body, Label } from "./Text";

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

const SelectRoot = styled(View, {
  name: "SelectRoot",
  gap: "$2",
});

const SelectTrigger = styled(Pressable, {
  name: "SelectTrigger",
  backgroundColor: "$surfaceAlt",
  borderWidth: 1,
  borderColor: "$border",
  borderRadius: 9999,
  minHeight: 54,
  paddingVertical: "$3",
  paddingHorizontal: "$5",
});

const SelectMenu = styled(View, {
  name: "SelectMenu",
  backgroundColor: "$surfaceStrong",
  borderWidth: 1,
  borderColor: "$borderSubtle",
  borderRadius: "$3",
  overflow: "hidden",
});

const SelectOptionRow = styled(Pressable, {
  name: "SelectOptionRow",
  paddingVertical: "$3",
  paddingHorizontal: "$4",
  borderBottomWidth: 1,
  borderBottomColor: "$borderSubtle",
});

export interface SelectProps {
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
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  helperText,
  disabled = false,
  testID,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  const handleSelect = React.useCallback(
    (nextValue: string) => {
      onValueChange(nextValue);
      setOpen(false);
    },
    [onValueChange],
  );

  return (
    <SelectRoot testID={testID}>
      {label ? <Label tone="secondary">{label}</Label> : null}
      <SelectTrigger
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        opacity={disabled ? 0.5 : 1}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <View fd="row" ai="center" gap="$3">
          <View f={1}>
            <Body tone={selected ? "primary" : "muted"}>
              {selected?.label ?? placeholder}
            </Body>
          </View>
          <Icon name="chevron-down" tone="muted" />
        </View>
      </SelectTrigger>
      {open ? (
        <SelectMenu testID={testID ? `${testID}-menu` : undefined}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <SelectOptionRow
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ disabled: option.disabled, selected: isSelected }}
                disabled={option.disabled}
                onPress={() => handleSelect(option.value)}
                bg={isSelected ? "$primaryMuted" : "transparent"}
                opacity={option.disabled ? 0.5 : 1}
                borderBottomWidth={index === options.length - 1 ? 0 : 1}
                testID={testID ? `${testID}-option-${option.value}` : undefined}
              >
                <View fd="row" ai="center" gap="$3">
                  <View f={1} gap="$1">
                    <Body tone={isSelected ? "accent" : "primary"} weight={isSelected ? "bold" : "regular"}>
                      {option.label}
                    </Body>
                    {option.description ? (
                      <Body size="sm" tone="muted">
                        {option.description}
                      </Body>
                    ) : null}
                  </View>
                  {isSelected ? <Icon name="check" tone="accent" /> : null}
                </View>
              </SelectOptionRow>
            );
          })}
        </SelectMenu>
      ) : null}
      {helperText ? <Body size="sm" tone="muted">{helperText}</Body> : null}
    </SelectRoot>
  );
}
