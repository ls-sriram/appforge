import React from "react";
import { YStack } from "../../platform/ui/index";
import type { OnboardingFrameProps } from "./onboarding-frame.contract";
export type { OnboardingFrameProps };
export { OnboardingFrameSchema } from "./onboarding-frame.contract";

export function OnboardingFrame({
  header,
  panel,
  footer,
}: OnboardingFrameProps) {
  return (
    <YStack>
      <YStack>
        <YStack>{header}</YStack>
        <YStack>{panel}</YStack>
        <YStack>{footer}</YStack>
      </YStack>
    </YStack>
  );
}
