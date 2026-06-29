import React from "react";
import { Body, Icon, XStack, YStack, useThemeTokens } from "../../../platform/ui/index";

export function OnboardingProgress({
  step,
  total,
  onBack,
}: {
  step: number;
  total: number;
  onBack?: () => void;
}) {
  const theme = useThemeTokens();
  return (
    <YStack>
      <XStack ai="center" gap="$3">
        {onBack ? (
          <YStack onPress={onBack} pressStyle={{ opacity: 0.8 }} cursor="pointer">
            <Icon color={theme.palette.textSecondary} name="chevron-left" size={16} />
          </YStack>
        ) : (
          <YStack />
        )}
        <Body fontSize="$2">Step {step} of {total}</Body>
      </XStack>
    </YStack>
  );
}
