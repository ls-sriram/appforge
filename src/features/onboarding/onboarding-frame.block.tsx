import React from "react";
import { YStack } from "../../platform/ui/index";

export function OnboardingFrame({
  header,
  panel,
  footer,
}: {
  header: React.ReactNode;
  panel: React.ReactNode;
  footer: React.ReactNode;
}) {
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
