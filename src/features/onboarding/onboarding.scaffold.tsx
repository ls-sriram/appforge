import React from "react";
import { noopUi, type UiStamp, useLayout, YStack } from "../../platform/ui/index";

export function OnboardingScaffold({
  ui = noopUi,
  stepper,
  hero,
  question,
  answerRegion,
}: {
  ui?: UiStamp;
  stepper: React.ReactNode;
  hero: React.ReactNode;
  question?: React.ReactNode;
  answerRegion?: React.ReactNode;
}) {
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
