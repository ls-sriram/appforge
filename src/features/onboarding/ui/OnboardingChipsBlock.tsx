import React from "react";
import { noopUi, SelectableChip, type UiStamp, useUI, XStack } from "../../../platform/ui/index";

interface Props {
  ui?: UiStamp;
  options: string[];
  selected?: string;
  onSelect?: (value: string) => void;
}

export function OnboardingChipsBlock({ ui = noopUi, options, selected, onSelect }: Props) {
  const { contracts } = useUI();
  return (
    <XStack {...ui("root", "Onboarding chip list")} gap="$3" flexWrap="wrap">
      {options.map((label, index) => (
        <SelectableChip
          {...ui(`option-${index}`, `Onboarding option ${index + 1}: ${label}`)}
          key={label}
          contract={contracts.selectableChip!["md"]}
          label={label}
          selected={label === selected}
          onPress={() => onSelect?.(label)}
        />
      ))}
    </XStack>
  );
}
