import React from "react";
import { createUi, YStack } from "../../platform/ui/index";
import { OnboardingScaffold } from "./ui/OnboardingScaffold";
import { OnboardingStepperBlock } from "./ui/OnboardingStepperBlock";
import { OnboardingHeroBlock } from "./ui/OnboardingHeroBlock";
import { OnboardingQuestionBlock } from "./ui/OnboardingQuestionBlock";
import { OnboardingChipsBlock } from "./ui/OnboardingChipsBlock";

export function OnboardingLayout() {
  const ui = createUi("onboarding");

  return (
    <YStack {...ui("root")} bg="$bg" f={1} p="$4" gap="$4">
      <OnboardingStepperBlock ui={ui.scope("stepper")} step={1} total={3} />
      <OnboardingScaffold
        ui={ui.scope("scaffold")}
        stepper={null}
        hero={
          <OnboardingHeroBlock
            ui={ui.scope("hero")}
            title="Tell us about yourself"
            subtitle="This helps us personalize your experience."
          />
        }
        question={<OnboardingQuestionBlock ui={ui.scope("question")} text="What best describes you?" />}
        answerRegion={
          <OnboardingChipsBlock
            ui={ui.scope("answers")}
            options={["Beginner", "Intermediate", "Advanced"]}
            selected="Intermediate"
          />
        }
      />
    </YStack>
  );
}
