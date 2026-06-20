import React from "react";
import { Body, YStack } from "../../../../platform/ui/index";

export function AuthInlineLinkBlock({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <YStack onPress={onPress} pressStyle={{ opacity: 0.7 }} cursor="pointer" alignSelf="flex-start">
      <Body color="$primary">{label}</Body>
    </YStack>
  );
}
