import React from "react";
import { TouchableOpacity } from "react-native";
import { Body, Label, XStack } from "../../../../ui";

interface AuthFooterLinksProps {
  prompt: string;
  linkLabel: string;
  onPress: () => void;
}

export function AuthFooterLinks({ prompt, linkLabel, onPress }: AuthFooterLinksProps) {
  return (
    <XStack ai="center" gap="$2" jc="center">
      <Body fontSize="$2" color="$textMuted">{prompt}</Body>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Label color="$primary" fontFamily="$bold">{linkLabel}</Label>
      </TouchableOpacity>
    </XStack>
  );
}
