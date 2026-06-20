import React from "react";
import { Body, Label, XStack, YStack } from "../../../../platform/ui/index";

interface AuthFooterLinksProps {
  prompt: string;
  linkLabel: string;
  onPress: () => void;
}

export function AuthFooterLinks({ prompt, linkLabel, onPress }: AuthFooterLinksProps) {
  return (
    <XStack ai="center" gap="$2" jc="center">
      <Body fontSize="$2" color="$textMuted">{prompt}</Body>
      <YStack onPress={onPress} pressStyle={{ opacity: 0.7 }}>
        <Label color="$primary" fontFamily="$bold">{linkLabel}</Label>
      </YStack>
    </XStack>
  );
}
