import React from "react";
import { Body, Button, Display, Label, noopUi, type UiStamp, YStack } from "../../../../platform/ui/index";
import { app } from "../../../../config/app";
import type { AuthWelcomeStyle } from "../contracts/authContracts";

export interface AuthWelcomeBlockProps {
  ui?: UiStamp;
  style: AuthWelcomeStyle;
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function AuthWelcomeBlock({
  ui = noopUi,
  style,
  onSignIn,
  onCreateAccount,
}: AuthWelcomeBlockProps) {
  return (
    <YStack
      {...ui("root", "Auth welcome card")}
      gap={style.layout.rootGap}
      px={style.card.paddingHorizontal}
      py={style.card.paddingVertical}
      bg={style.card.backgroundColor}
      borderWidth={style.card.borderWidth}
      borderColor={style.card.borderColor}
      br={style.card.borderRadius}
    >
      <YStack {...ui("copy", "Auth welcome copy")} gap={style.layout.copyGap}>
        <Label {...ui("eyebrow", "Auth welcome eyebrow")} color={style.eyebrow.color} textTransform="uppercase" letterSpacing={style.eyebrow.letterSpacing}>
          {app.name}
        </Label>
        <Display {...ui("title", "Auth welcome title")}>{app.tagline}</Display>
        <Body {...ui("body", "Auth welcome body")} color={style.body.color} fontSize={style.body.fontSize} lineHeight={style.body.lineHeight}>
          Pick up where you left off or create an account to start building.
        </Body>
      </YStack>

      <YStack {...ui("actions", "Auth welcome actions")} gap={style.layout.actionsGap}>
        <Button {...ui("sign-in", "Sign in button")} variant="primary" onPress={onSignIn}>Sign In</Button>
        <Button {...ui("create-account", "Create account button")} variant="secondary" onPress={onCreateAccount}>Create Account</Button>
      </YStack>
    </YStack>
  );
}
