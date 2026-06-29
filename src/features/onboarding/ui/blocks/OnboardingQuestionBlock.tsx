import React from "react";
import { OnboardingCardBlock } from "./OnboardingCardBlock";
import { OnboardingScaffold } from "../scaffolds/OnboardingScaffold";

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
