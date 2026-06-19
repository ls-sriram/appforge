import React from "react";
import { Display, Label, YStack } from "@ui";
import { app } from "../../../../../config/app";

export function WelcomeHeroBlock() {
  return (
    <YStack gap="$4" px="$4" py="$5">
      <Label color="$textMuted" textTransform="uppercase" letterSpacing={1}>
        {app.name}
      </Label>
      <Display>{app.tagline}</Display>
    </YStack>
  );
}
