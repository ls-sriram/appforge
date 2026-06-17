import React from "react";
import { Body, Button, YStack } from "../../../../../ui";

interface WelcomeActionsBlockProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function WelcomeActionsBlock({ onSignIn, onCreateAccount }: WelcomeActionsBlockProps) {
  return (
    <YStack gap="$3" px="$4" py="$4">
      <Button onPress={onSignIn} bg="$primary">
        <Body color="$textInverse" fontFamily="$bold">Sign In</Body>
      </Button>
      <Button onPress={onCreateAccount} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
        <Body>Create Account</Body>
      </Button>
    </YStack>
  );
}
