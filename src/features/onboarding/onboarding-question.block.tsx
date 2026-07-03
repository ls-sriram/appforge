import React from "react";
import { OnboardingCardBlock } from "./onboarding-card.block";
import { OnboardingScaffold } from "./onboarding.scaffold";

export function OnboardingQuestionBlock({
  hero,
  question,
  answerRegion,
}: {
  hero: React.ReactNode;
  question?: React.ReactNode;
  answerRegion?: React.ReactNode;
}) {
  return (
    <OnboardingCardBlock size="tall">
      <OnboardingScaffold
        stepper={null}
        hero={hero}
        question={question}
        answerRegion={answerRegion}
      />
    </OnboardingCardBlock>
  );
}
