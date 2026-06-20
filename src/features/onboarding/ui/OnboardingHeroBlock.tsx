import React from "react";
import { Body, Heading, YStack } from "../../../platform/ui/index";

export function OnboardingHeroBlock({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <YStack gap="$2">
      <Heading>{title}</Heading>
      {subtitle ? <Body color="$textMuted">{subtitle}</Body> : null}
    </YStack>
  );
}
