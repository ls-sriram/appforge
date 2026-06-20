import React from "react";
import { Body, Button, Heading, SelectableChip, View, XStack, YStack } from "../../platform/ui/index";

export function OnboardingLayout() {
  return (
    <YStack bg="$bg" f={1} p="$4" gap="$4">
      <YStack gap="$1">
        <Heading>Get started</Heading>
        <Body color="$textMuted">Tell us a bit about yourself.</Body>
      </YStack>
      <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
        <YStack gap="$4">
          <Heading>Question</Heading>
          <XStack gap="$3" flexWrap="wrap">
            <SelectableChip label="Option A" selected={false} />
            <SelectableChip label="Option B" selected={false} />
            <SelectableChip label="Option C" selected={false} />
          </XStack>
        </YStack>
      </View>
      <XStack ai="center" jc="space-between">
        <Body fontSize="$2" color="$textMuted">Step 1 of 3</Body>
        <Button bg="$primary">
          <Body color="$textInverse" fontFamily="$bold">Continue</Body>
        </Button>
      </XStack>
    </YStack>
  );
}
