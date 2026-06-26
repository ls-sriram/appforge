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
      {...ui("root")}
      gap="$6"
      px="$5"
      py="$6"
      bg="$surface"
      borderWidth={1}
      borderColor="$borderSubtle"
      br="$4"
    >
      <YStack {...ui("copy")} gap="$4">
        <Label {...ui("eyebrow")} color="$textMuted" textTransform="uppercase" letterSpacing={1}>
          {app.name}
        </Label>
        <Display {...ui("title")}>{app.tagline}</Display>
        <Body {...ui("body")} color="$textMuted" size="lg">
          Pick up where you left off or create an account to start building.
        </Body>
      </YStack>

      <YStack {...ui("actions")} gap="$3">
        <Button {...ui("sign-in")} variant="primary" label="Sign In" onPress={onSignIn} />
        <Button {...ui("create-account")} variant="secondary" label="Create Account" onPress={onCreateAccount} />
      </YStack>
    </YStack>
  );
}
