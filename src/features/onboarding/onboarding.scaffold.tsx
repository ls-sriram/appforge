import React from "react";
import { noopUi, useLayout, YStack } from "../../platform/ui/index";
import type { OnboardingScaffoldProps } from "./onboarding.contract";
export type { OnboardingScaffoldProps };
export { OnboardingScaffoldSchema } from "./onboarding.contract";

export function OnboardingScaffold({
  ui = noopUi,
  stepper,
  hero,
  question,
  answerRegion,
}: OnboardingScaffoldProps) {
  const layout = useLayout();
  return (
    <YStack {...ui("root", "Onboarding scaffold")} gap={layout.sectionGap}>
      {stepper}
      {hero}
      {question}
      {answerRegion}
    </YStack>
  );
}
