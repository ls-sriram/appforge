import React from "react";
import { Body, Button, Heading, Label, YStack } from "../../../../ui";
import { ui } from "../../../../ui/viz";

export interface SitLandingLayoutProps {
  brand?: string;
  title?: string;
  subtitle?: string;
  meditateLabel?: string;
  actionLabel?: string;
  vipassanaLabel?: string;
  onMeditate: () => void;
  onAction: () => void;
  onVipassana: () => void;
  onInfo?: () => void;
}

export function SitLandingLayout({
  brand = "sit.",
  title = "Two things.\nThat's all.",
  subtitle = "observe · act · release",
  meditateLabel = "gain clarity",
  actionLabel = "take action",
  vipassanaLabel = "vipassana day",
  onMeditate,
  onAction,
  onVipassana,
  onInfo,
}: SitLandingLayoutProps) {
  return ui(
    "sitlanding-0",
    <YStack f={1} bg="$bg" px="$4" pt="$7" pb="$6" jc="center" ai="center" gap="$4">
      {ui("sitlanding-1", <Label tone="muted" tt="uppercase" letterSpacing={2}>{brand}</Label>)}
      {ui("sitlanding-2", <Heading size="display" tone="inverse" ta="center">{title}</Heading>)}
      {ui("sitlanding-3", <Body tone="muted" ta="center">{subtitle}</Body>)}
      {ui(
        "sitlanding-4",
        <YStack w="100%" gap="$3" maxWidth={320}>
          {ui("sitlanding-5", <Button size="lg" label={meditateLabel} onPress={onMeditate} />)}
          {ui("sitlanding-6", <Button size="lg" variant="secondary" label={actionLabel} onPress={onAction} />)}
        </YStack>,
      )}
      {ui("sitlanding-7", <Label tone="muted" onPress={onVipassana}>{vipassanaLabel}</Label>)}
      {onInfo ? ui("sitlanding-8", <Label tone="muted" onPress={onInfo}>?</Label>) : null}
    </YStack>,
  );
}
