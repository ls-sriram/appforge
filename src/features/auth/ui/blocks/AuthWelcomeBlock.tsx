import React from "react";
import { Body, Button, Display, Label, noopUi, type UiStamp, YStack } from "../../../../platform/ui/index";
import { app } from "../../../../config/app";

export interface AuthWelcomeBlockProps {
  ui?: UiStamp;
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function AuthWelcomeBlock({
  ui = noopUi,
  onSignIn,
  onCreateAccount,
}: AuthWelcomeBlockProps) {
  return (
    <YStack
      {...ui("root", "Auth welcome card")}
      gap="$6"
      px="$5"
      py="$6"
      bg="$surface"
      borderWidth={1}
      borderColor="$borderSubtle"
      br="$4"
    >
      <YStack {...ui("copy", "Auth welcome copy")} gap="$4">
        <Label {...ui("eyebrow", "Auth welcome eyebrow")} color="$textMuted" textTransform="uppercase" letterSpacing={1}>
          {app.name}
        </Label>
        <Display {...ui("title", "Auth welcome title")}>{app.tagline}</Display>
        <Body {...ui("body", "Auth welcome body")} color="$textMuted" fontSize="$4" lineHeight="$4">
          Pick up where you left off or create an account to start building.
        </Body>
      </YStack>

      <YStack {...ui("actions", "Auth welcome actions")} gap="$3">
        <Button {...ui("sign-in", "Sign in button")} variant="primary" onPress={onSignIn}>Sign In</Button>
        <Button {...ui("create-account", "Create account button")} variant="secondary" onPress={onCreateAccount}>Create Account</Button>
      </YStack>
    </YStack>
  );
}
