import React from "react";
import { YStack } from "../../platform/ui/index";
import type { OnboardingCardBlockProps } from "./onboarding-card.contract";
export type { OnboardingCardBlockProps };
export { OnboardingCardBlockSchema } from "./onboarding-card.contract";

export function OnboardingCardBlock({
  children,
  size = "default",
}: OnboardingCardBlockProps) {
  void size;
  return <YStack>{children}</YStack>;
}
