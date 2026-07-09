import React from "react";
import { noopUi, SelectableChip, useUI, XStack } from "../../platform/ui/index";
import type { OnboardingChipsBlockProps } from "./onboarding-chips.contract";
export type { OnboardingChipsBlockProps };
export { OnboardingChipsBlockSchema } from "./onboarding-chips.contract";

export function OnboardingChipsBlock({ ui = noopUi, options, selected, onSelect }: OnboardingChipsBlockProps) {
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
