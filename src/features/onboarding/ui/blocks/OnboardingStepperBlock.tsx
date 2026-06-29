import React from "react";
import { Body, noopUi, type UiStamp, XStack } from "../../../../platform/ui/index";
import type { OnboardingStepperStyle } from "../contracts/onboardingContracts";

export function OnboardingStepperBlock({
  ui = noopUi,
  style,
  step,
  total,
}: {
  ui?: UiStamp;
  style: OnboardingStepperStyle;
  step: number;
  total: number;
}) {
  return (
    <XStack {...ui("root", "Onboarding stepper")} ai="center" jc="space-between">
      <Body {...ui("label", "Onboarding step label")} fontSize={style.label.fontSize} color={style.label.color}>Step {step} of {total}</Body>
    </XStack>
  );
}
