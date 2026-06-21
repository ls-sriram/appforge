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
    <YStack {...ui("root")} gap="$2">
      <Heading {...ui("title")}>{title}</Heading>
      {subtitle ? <Body {...ui("subtitle")} color="$textMuted">{subtitle}</Body> : null}
    </YStack>
  );
}
