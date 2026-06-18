import React from "react";
import { Heading, Label, YStack } from "../../../../ui";
import { ui } from "../../../../ui/viz";

export interface SitTimerLayoutProps {
  eyebrow?: string;
  timer?: string;
  caption?: string;
  endLabel?: string;
  onBack: () => void;
}

export function SitTimerLayout({
  eyebrow = "anapana",
  timer = "09:42",
  caption = "breathe in",
  endLabel = "end",
  onBack,
}: SitTimerLayoutProps) {
  return ui(
    "sittimer-0",
    <YStack f={1} bg="$bg" px="$4" pt="$7" pb="$5" ai="center" jc="space-between" gap="$4">
      {ui("sittimer-1", <Label alignSelf="flex-start" tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onBack}>back</Label>)}
      {ui(
        "sittimer-2",
        <YStack ai="center" jc="center" gap="$4" f={1}>
          {ui("sittimer-3", <Label tone="muted" tt="uppercase" letterSpacing={2}>{eyebrow}</Label>)}
          {ui("sittimer-4", <Heading tone="inverse" size="display">{timer}</Heading>)}
          {ui("sittimer-5", <Label tone="muted">{caption}</Label>)}
        </YStack>,
      )}
      {ui("sittimer-6", <Label tone="muted" tt="uppercase" letterSpacing={1.5}>{endLabel}</Label>)}
    </YStack>,
  );
}
