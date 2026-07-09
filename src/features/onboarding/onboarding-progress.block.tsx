import React from "react";
import { Body, Icon, XStack, YStack } from "../../platform/ui/index";
import type { OnboardingProgressStyle } from "./onboarding-progress.styles";

export function OnboardingProgressBlock({
  style,
  step,
  total,
  onBack,
}: {
  style: OnboardingProgressStyle;
  step: number;
  total: number;
  onBack?: () => void;
}) {
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
