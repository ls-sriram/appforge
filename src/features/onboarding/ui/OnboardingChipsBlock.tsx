import React from "react";
import { noopUi, SelectableChip, type UiStamp, XStack } from "../../../platform/ui/index";

interface Props {
  ui?: UiStamp;
  options: string[];
  selected?: string;
  onSelect?: (value: string) => void;
}

export function OnboardingChipsBlock({ ui = noopUi, options, selected, onSelect }: Props) {
  return (
    <XStack {...ui("root")} gap="$3" flexWrap="wrap">
      {options.map((label, index) => (
        <SelectableChip
          {...ui(`option-${index}`)}
          key={label}
          label={label}
          selected={label === selected}
          onPress={() => onSelect?.(label)}
        />
      ))}
    </XStack>
  );
}
