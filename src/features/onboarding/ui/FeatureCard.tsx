/**
 * ─────────────────────────────────────────────────────────────────
 * FEATURE_CARD — Onboarding feature highlight.
 *
 * Large icon + title + description for onboarding carousel.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Body, Heading, Icon, YStack, type IconName } from "../../../platform/ui/index";

export interface FeatureCardProps {
  icon: IconName;
  title: string;
  description: string;
}

export function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <YStack ai="center" gap="$4">
      <YStack
        bg="$surfaceStrong"
        borderColor="$borderSubtle"
        borderWidth={1}
        br="$3"
        p="$4"
        ai="center"
        jc="center"
      >
        <Icon name={icon} size="5xl" />
      </YStack>
      <YStack ai="center" gap="$2">
        <Heading textAlign="center">{title}</Heading>
        <Body textAlign="center" color="$textSecondary">
          {description}
        </Body>
      </YStack>
    </YStack>
  );
}
