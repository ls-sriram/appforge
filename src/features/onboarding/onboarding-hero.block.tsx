import React from "react";
import { Body, Heading, noopUi, type UiStamp, YStack } from "../../platform/ui/index";
import type { OnboardingHeroStyle } from "./onboarding.contracts";

export function OnboardingHeroBlock({
  ui = noopUi,
  style,
  title,
  subtitle,
}: {
  ui?: UiStamp;
  style: OnboardingHeroStyle;
  title: string;
  subtitle?: string;
}) {
  return (
    <YStack {...ui("root", "Onboarding hero")} gap={style.layout.gap}>
      <Heading {...ui("title", "Onboarding hero title")}>{title}</Heading>
      {subtitle ? <Body {...ui("subtitle", "Onboarding hero subtitle")} color={style.subtitle.color}>{subtitle}</Body> : null}
    </YStack>
  );
}
