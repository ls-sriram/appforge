import React from "react";
import { Body, Heading, noopUi, type UiStamp, YStack } from "../../../platform/ui/index";

export function OnboardingHeroBlock({
  ui = noopUi,
  title,
  subtitle,
}: {
  ui?: UiStamp;
  title: string;
  subtitle?: string;
}) {
  return (
    <YStack {...ui("root", "Onboarding hero")} gap="$2">
      <Heading {...ui("title", "Onboarding hero title")}>{title}</Heading>
      {subtitle ? <Body {...ui("subtitle", "Onboarding hero subtitle")} color="$textMuted">{subtitle}</Body> : null}
    </YStack>
  );
}
