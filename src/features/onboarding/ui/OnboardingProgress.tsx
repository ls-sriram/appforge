import React from "react";
import { Body, Icon, XStack, YStack } from "../../../platform/ui/index";

export function OnboardingProgress({
  step,
  total,
  onBack,
}: {
  step: number;
  total: number;
  onBack?: () => void;
}) {
  return (
    <YStack>
      <XStack ai="center" gap="$3">
        {onBack ? (
          <YStack onPress={onBack} pressStyle={{ opacity: 0.8 }} cursor="pointer">
            <Icon name="chevron-left" size="md" tone="secondary" />
          </YStack>
        ) : (
          <YStack />
        )}
        <Body fontSize="$2">Step {step} of {total}</Body>
      </XStack>
    </YStack>
  );
}
