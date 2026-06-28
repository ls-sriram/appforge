import React from "react";
import { noopUi, type UiStamp, YStack } from "../../../platform/ui/index";

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
  return (
    <YStack {...ui("root", "Onboarding scaffold")} gap="$4">
      {stepper}
      {hero}
      {question}
      {answerRegion}
    </YStack>
  );
}
