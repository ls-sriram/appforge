import React from "react";
import { Body, noopUi, type UiStamp, XStack } from "../../../platform/ui/index";

export function OnboardingStepperBlock({
  ui = noopUi,
  step,
  total,
}: {
  ui?: UiStamp;
  step: number;
  total: number;
}) {
  return (
    <XStack {...ui("root", "Onboarding stepper")} ai="center" jc="space-between">
      <Body {...ui("label", "Onboarding step label")} fontSize="$2" color="$textMuted">Step {step} of {total}</Body>
    </XStack>
  );
}
