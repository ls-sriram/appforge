import React from "react";
import { Body, Icon, XStack, YStack } from "../../platform/ui/index";
import type { OnboardingProgressBlockProps } from "./onboarding-progress.contract";
export type { OnboardingProgressBlockProps };
export { OnboardingProgressBlockSchema } from "./onboarding-progress.contract";

export function OnboardingProgressBlock({
  style,
  step,
  total,
  onBack,
}: OnboardingProgressBlockProps) {
  return (
    <YStack>
      <XStack ai="center" gap={style.layout.gap}>
        {onBack ? (
          <YStack onPress={onBack} pressStyle={{ opacity: 0.8 }} cursor="pointer">
            <Icon color={style.backIcon.color} name="chevron-left" size={style.backIcon.size} />
          </YStack>
        ) : (
          <YStack />
        )}
        <Body fontSize={style.label.fontSize}>Step {step} of {total}</Body>
      </XStack>
    </YStack>
  );
}
