import React from "react";
import { YStack } from "../../platform/ui/index";
import { OnboardingScaffold } from "./ui/OnboardingScaffold";
import { OnboardingStepperBlock } from "./ui/OnboardingStepperBlock";
import { OnboardingHeroBlock } from "./ui/OnboardingHeroBlock";
import { OnboardingQuestionBlock } from "./ui/OnboardingQuestionBlock";
import { OnboardingChipsBlock } from "./ui/OnboardingChipsBlock";
import { ui } from "../../platform/ui/viz";

export function OnboardingLayout() {
  return (
    ui("onboarding-0", <YStack bg="$bg" f={1} p="$4" gap="$4">
      <OnboardingStepperBlock step={1} total={3} />
      <OnboardingScaffold
        stepper={null}
        hero={<OnboardingHeroBlock title="Tell us about yourself" subtitle="This helps us personalize your experience." />}
        question={<OnboardingQuestionBlock text="What best describes you?" />}
        answerRegion={
          <OnboardingChipsBlock
            options={["Beginner", "Intermediate", "Advanced"]}
            selected="Intermediate"
          />
        }
      />
    </YStack>)
  );
}
