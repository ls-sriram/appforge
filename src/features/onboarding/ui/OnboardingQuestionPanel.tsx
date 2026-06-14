import React from "react";
import { OnboardingCard } from "./OnboardingCard";
import { OnboardingScaffold } from "./OnboardingScaffold";

export function OnboardingQuestionPanel({
  hero,
  question,
  answerRegion,
}: {
  hero: React.ReactNode;
  question?: React.ReactNode;
  answerRegion?: React.ReactNode;
}) {
  return (
    <OnboardingCard size="tall">
      <OnboardingScaffold
        stepper={null}
        hero={hero}
        question={question}
        answerRegion={answerRegion}
      />
    </OnboardingCard>
  );
}
