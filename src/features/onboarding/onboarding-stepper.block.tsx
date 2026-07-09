import React from "react";
import { Body, noopUi, XStack } from "../../platform/ui/index";
import type { OnboardingStepperBlockProps } from "./onboarding-stepper.contract";
export type { OnboardingStepperBlockProps };
export { OnboardingStepperBlockSchema } from "./onboarding-stepper.contract";

export function OnboardingStepperBlock({
  ui = noopUi,
  style,
  step,
  total,
}: OnboardingStepperBlockProps) {
  return (
    <XStack {...ui("root", "Onboarding stepper")} ai="center" jc="space-between">
      <Body {...ui("label", "Onboarding step label")} fontSize={style.label.fontSize} color={style.label.color}>Step {step} of {total}</Body>
    </XStack>
  );
}
