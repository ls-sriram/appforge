import React from "react";
import { Body, Button, Heading, SelectableChip, View, XStack, YStack } from "../../platform/ui/index";
import { ui } from "../../platform/ui/viz";

export function OnboardingLayout() {
  return (
    ui("onboarding-0", <YStack bg="$bg" f={1} p="$4" gap="$4">
      {ui("onboarding-1", <YStack gap="$1">
        {ui("onboarding-2", <Heading>Get started</Heading>)}
        {ui("onboarding-3", <Body color="$textMuted">Tell us a bit about yourself.</Body>)}
      </YStack>)}
      {ui("onboarding-4", <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
        {ui("onboarding-5", <YStack gap="$4">
          {ui("onboarding-6", <Heading>Question</Heading>)}
          {ui("onboarding-7", <XStack gap="$3" flexWrap="wrap">
            {ui("onboarding-8", <SelectableChip label="Option A" selected={false} />)}
            {ui("onboarding-9", <SelectableChip label="Option B" selected={false} />)}
            {ui("onboarding-10", <SelectableChip label="Option C" selected={false} />)}
          </XStack>)}
        </YStack>)}
      </View>)}
      {ui("onboarding-11", <XStack ai="center" jc="space-between">
        {ui("onboarding-12", <Body fontSize="$2" color="$textMuted">Step 1 of 3</Body>)}
        {ui("onboarding-13", <Button bg="$primary">
          <Body color="$textInverse" fontFamily="$bold">Continue</Body>
        </Button>)}
      </XStack>)}
    </YStack>)
  );
}
