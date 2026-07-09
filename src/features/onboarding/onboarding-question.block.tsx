import React from "react";
import { OnboardingCardBlock } from "./onboarding-card.block";
import { OnboardingScaffold } from "./onboarding.scaffold";
import type { OnboardingQuestionBlockProps } from "./onboarding-question.contract";
export type { OnboardingQuestionBlockProps };
export { OnboardingQuestionBlockSchema } from "./onboarding-question.contract";

export function OnboardingQuestionBlock({
  hero,
  question,
  answerRegion,
}: OnboardingQuestionBlockProps) {
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
