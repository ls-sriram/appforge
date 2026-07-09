import React from "react";
import { Body, Heading, noopUi, YStack } from "../../platform/ui/index";
import type { OnboardingHeroBlockProps } from "./onboarding-hero.contract";
export type { OnboardingHeroBlockProps };
export { OnboardingHeroBlockSchema } from "./onboarding-hero.contract";

export function OnboardingHeroBlock({
  ui = noopUi,
  style,
  title,
  subtitle,
}: OnboardingHeroBlockProps) {
  return (
    <YStack {...ui("root", "Onboarding hero")} gap={style.layout.gap}>
      <Heading {...ui("title", "Onboarding hero title")}>{title}</Heading>
      {subtitle ? <Body {...ui("subtitle", "Onboarding hero subtitle")} color={style.subtitle.color}>{subtitle}</Body> : null}
    </YStack>
  );
}
