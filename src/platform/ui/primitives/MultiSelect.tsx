import { styled, View } from "@tamagui/core";
import React from "react";
import { Pressable } from "react-native";
import { Icon } from "./Icon";
import type { SelectOption } from "./Select";
import { Body, Label } from "./Text";

const MultiSelectRoot = styled(View, {
  name: "MultiSelectRoot",
  gap: "$2",
});

const MultiSelectTrigger = styled(Pressable, {
  name: "MultiSelectTrigger",
  backgroundColor: "$surfaceAlt",
  borderWidth: 1,
  borderColor: "$border",
  borderRadius: "$3",
  minHeight: 54,
  paddingVertical: "$3",
  paddingHorizontal: "$4",
});

const MultiSelectMenu = styled(View, {
  name: "MultiSelectMenu",
  backgroundColor: "$surfaceStrong",
  borderWidth: 1,
  borderColor: "$borderSubtle",
  borderRadius: "$3",
  overflow: "hidden",
});

const MultiSelectOptionRow = styled(Pressable, {
  name: "MultiSelectOptionRow",
  paddingVertical: "$3",
  paddingHorizontal: "$4",
  borderBottomWidth: 1,
  borderBottomColor: "$borderSubtle",
});

const MultiSelectToken = styled(View, {
  name: "MultiSelectToken",
  backgroundColor: "$primaryMuted",
  borderRadius: 9999,
  paddingVertical: 6,
  paddingHorizontal: 10,
  alignSelf: "flex-start",
});

export interface MultiSelectProps {
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
  options,
  value,
  onValueChange,
  placeholder = "Select one or more options",
  label,
  helperText,
  disabled = false,
  testID,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedOptions = options.filter((option) => value.includes(option.value));

  const toggleValue = React.useCallback(
    (nextValue: string) => {
      const hasValue = value.includes(nextValue);
      onValueChange(hasValue ? value.filter((item) => item !== nextValue) : [...value, nextValue]);
    },
    [onValueChange, value],
  );

  return (
    <MultiSelectRoot testID={testID}>
      {label ? <Label tone="secondary">{label}</Label> : null}
      <MultiSelectTrigger
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        opacity={disabled ? 0.5 : 1}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <View fd="row" ai="center" gap="$3">
          <View f={1} gap="$2">
            {selectedOptions.length ? (
              <View fd="row" gap="$2" flexWrap="wrap">
                {selectedOptions.map((option) => (
                  <MultiSelectToken key={option.value}>
                    <Body size="sm" tone="accent" weight="bold">
                      {option.label}
                    </Body>
                  </MultiSelectToken>
                ))}
              </View>
            ) : (
              <Body tone="muted">{placeholder}</Body>
            )}
          </View>
          <Icon name="chevron-down" tone="muted" />
        </View>
      </MultiSelectTrigger>
      {open ? (
        <MultiSelectMenu testID={testID ? `${testID}-menu` : undefined}>
          {options.map((option, index) => {
            const isSelected = value.includes(option.value);
            return (
              <MultiSelectOptionRow
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ disabled: option.disabled, selected: isSelected }}
                disabled={option.disabled}
                onPress={() => toggleValue(option.value)}
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
              </MultiSelectOptionRow>
            );
          })}
        </MultiSelectMenu>
      ) : null}
      {helperText ? <Body size="sm" tone="muted">{helperText}</Body> : null}
    </MultiSelectRoot>
  );
}
