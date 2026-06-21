import React from "react";
import { Body, Button, Display, Label, YStack } from "../../../../platform/ui/index";
import { app } from "../../../../config/app";

export interface AuthWelcomeBlockProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function AuthWelcomeBlock({ onSignIn, onCreateAccount }: AuthWelcomeBlockProps) {
  return (
    <YStack
      gap="$6"
      px="$5"
      py="$6"
      bg="$surface"
      borderWidth={1}
      borderColor="$borderSubtle"
      br="$4"
    >
      <YStack gap="$4">
        <Label color="$textMuted" textTransform="uppercase" letterSpacing={1}>
          {app.name}
        </Label>
        <Display>{app.tagline}</Display>
        <Body color="$textMuted" size="lg">
          Pick up where you left off or create an account to start building.
        </Body>
      </YStack>

      <YStack gap="$3">
        <Button onPress={onSignIn} bg="$primary">
          <Body color="$textInverse" fontFamily="$bold">Sign In</Body>
        </Button>
        <Button onPress={onCreateAccount} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
          <Body>Create Account</Body>
        </Button>
      </YStack>
    </YStack>
  );
}
