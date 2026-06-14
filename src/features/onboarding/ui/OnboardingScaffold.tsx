import React from "react";
import { Block } from "../../../ui/primitives"

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
    <Block space="md">
      {stepper}
      {hero}
      {question}
      {answerRegion}
    </Block>
  );
}
