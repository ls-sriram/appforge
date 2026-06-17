import React from "react";
import { YStack } from "../../../ui";

export function OnboardingScaffold({
  stepper,
  hero,
  question,
  answerRegion,
}: {
  stepper: React.ReactNode;
  hero: React.ReactNode;
  question?: React.ReactNode;
  answerRegion?: React.ReactNode;
}) {
  return (
    <YStack gap="$4">
      {stepper}
      {hero}
      {question}
      {answerRegion}
    </YStack>
  );
}
