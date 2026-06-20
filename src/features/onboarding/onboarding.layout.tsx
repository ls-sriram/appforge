import React from "react";
import { Body, Heading, SelectableChip, XStack, YStack } from "../../platform/ui/index";
import { OnboardingScaffold } from "./ui/OnboardingScaffold";
import { ui } from "../../platform/ui/viz";

export function OnboardingLayout() {
  return (
    ui("onboarding-0", <YStack bg="$bg" f={1} p="$4" gap="$4">
      {ui("onboarding-1", <XStack ai="center" jc="space-between">
        {ui("onboarding-2", <Body fontSize="$2" color="$textMuted">Step 1 of 3</Body>)}
      </XStack>)}
      <OnboardingScaffold
        stepper={null}
        hero={
          ui("onboarding-3", <YStack gap="$2">
            {ui("onboarding-4", <Heading>Tell us about yourself</Heading>)}
            {ui("onboarding-5", <Body color="$textMuted">This helps us personalize your experience.</Body>)}
          </YStack>)
        }
        question={
          ui("onboarding-6", <Body fontFamily="$bold">What best describes you?</Body>)
        }
        answerRegion={
          ui("onboarding-7", <XStack gap="$3" flexWrap="wrap">
            {ui("onboarding-8", <SelectableChip label="Beginner" selected={false} onPress={() => {}} />)}
            {ui("onboarding-9", <SelectableChip label="Intermediate" selected={true} onPress={() => {}} />)}
            {ui("onboarding-10", <SelectableChip label="Advanced" selected={false} onPress={() => {}} />)}
          </XStack>)
        }
      />
    </YStack>)
  );
}
