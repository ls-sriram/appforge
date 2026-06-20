import React from "react";
import { Body, XStack } from "../../../platform/ui/index";

export function OnboardingStepperBlock({ step, total }: { step: number; total: number }) {
  return (
    <XStack ai="center" jc="space-between">
      <Body fontSize="$2" color="$textMuted">Step {step} of {total}</Body>
    </XStack>
  );
}
