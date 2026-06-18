import React from "react";
import { Body, Button, Heading, Label, XStack, YStack } from "../../../../ui";
import { ui } from "../../../../ui/viz";
import type { SitOnboardingSlide } from "../session/domain/content";

export interface SitOnboardingLayoutProps {
  slide: SitOnboardingSlide;
  index: number;
  total: number;
  onNext: () => void;
  onComplete: () => void;
}

export function SitOnboardingLayout({
  slide,
  index,
  total,
  onNext,
  onComplete,
}: SitOnboardingLayoutProps) {
  const isLast = index === total - 1;
  return ui(
    "sitonboarding-0",
    <YStack f={1} bg="$bg" px="$4" pt="$7" pb="$6" jc="space-between" gap="$4">
      {ui(
        "sitonboarding-1",
        <YStack f={1} jc="center" ai="center" gap="$4">
          {slide.kind === "content" ? (
            <>
              {ui("sitonboarding-2", <Label tone="muted" tt="uppercase" letterSpacing={2}>{slide.theme}</Label>)}
              {ui("sitonboarding-3", <Heading size="display" tone="inverse" ta="center">{slide.headline}</Heading>)}
              {ui("sitonboarding-4", <Body tone="muted" ta="center">{slide.quote}</Body>)}
              {ui("sitonboarding-5", <Label tone="muted">{slide.attribution}</Label>)}
            </>
          ) : (
            <>
              {ui("sitonboarding-6", <Label tone="muted" tt="uppercase" letterSpacing={2}>sit.</Label>)}
              {ui("sitonboarding-7", <Heading size="display" tone="inverse" ta="center">{"Two things.\nThat's all."}</Heading>)}
              {ui("sitonboarding-8", <Body tone="muted" ta="center">observe · act · release</Body>)}
              {ui("sitonboarding-9", <Button size="lg" label="meditate" onPress={onComplete} />)}
              {ui("sitonboarding-10", <Button size="lg" variant="secondary" label="take action" onPress={onComplete} />)}
            </>
          )}
        </YStack>,
      )}
      {!isLast
        ? ui(
            "sitonboarding-11",
            <XStack ai="center" jc="space-between">
              {ui("sitonboarding-12", <Label tone="muted">{`${index + 1}/${total}`}</Label>)}
              {ui("sitonboarding-13", <Label tone="inverse" onPress={onNext}>next</Label>)}
            </XStack>,
          )
        : null}
    </YStack>,
  );
}
