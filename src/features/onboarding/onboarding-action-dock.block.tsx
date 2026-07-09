import React from "react";
import { YStack } from "../../platform/ui/index";
import type { OnboardingActionDockBlockProps } from "./onboarding-action-dock.contract";
export type { OnboardingActionDockBlockProps };
export { OnboardingActionDockBlockSchema } from "./onboarding-action-dock.contract";

export function OnboardingActionDockBlock({ children }: OnboardingActionDockBlockProps) {
  return <YStack>{children}</YStack>;
}
