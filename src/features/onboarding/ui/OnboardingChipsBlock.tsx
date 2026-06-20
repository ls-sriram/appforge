import React from "react";
import { SelectableChip, XStack } from "../../../platform/ui/index";

interface Props {
  options: string[];
  selected?: string;
  onSelect?: (value: string) => void;
}

export function OnboardingChipsBlock({ options, selected, onSelect }: Props) {
  return (
    <XStack gap="$3" flexWrap="wrap">
      {options.map((label) => (
        <SelectableChip
          key={label}
          label={label}
          selected={label === selected}
          onPress={() => onSelect?.(label)}
        />
      ))}
    </XStack>
  );
}
