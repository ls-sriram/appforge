import React from "react";
import { Body, Button, Label, YStack } from "@ui";
import { ui } from "@ui/viz";

export interface SitCompletionLayoutProps {
  quote?: string;
  attribution?: string;
  onContinue: () => void;
}

export function SitCompletionLayout({
  quote = "All conditions are impermanent. Seeing this with wisdom is the path to purity.",
  attribution = "Dhammapada 277",
  onContinue,
}: SitCompletionLayoutProps) {
  return ui(
    "sitcompletion-0",
    <YStack f={1} bg="$bg" px="$4" py="$6" ai="center" jc="center" gap="$5">
      {ui("sitcompletion-1", <Label tone="muted" tt="uppercase" letterSpacing={2}>dhammapada</Label>)}
      {ui("sitcompletion-2", <Body tone="inverse" size="xl" ta="center">{quote}</Body>)}
      {ui("sitcompletion-3", <Body tone="muted" ta="center">{attribution}</Body>)}
      {ui("sitcompletion-4", <Button size="lg" label="continue" onPress={onContinue} />)}
    </YStack>,
  );
}
