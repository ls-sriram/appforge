/**
 * ─────────────────────────────────────────────────────────────────
 * FEATURE_CARD — Onboarding feature highlight.
 *
 * Large icon + title + description for onboarding carousel.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Body, Heading, Icon, YStack, type IconName } from "../../../../platform/ui/index";
import type { FeatureHighlightStyle } from "../contracts/onboardingContracts";

export interface FeatureHighlightBlockProps {
  style: FeatureHighlightStyle;
  icon: IconName;
  title: string;
  description: string;
}

export function FeatureHighlightBlock({
  style,
  icon,
  title,
  description,
}: FeatureHighlightBlockProps) {
  return (
    <YStack ai="center" gap={style.layout.rootGap}>
      <YStack
        bg={style.frame.backgroundColor}
        borderColor={style.frame.borderColor}
        borderWidth={style.frame.borderWidth}
        br={style.frame.borderRadius}
        p={style.frame.padding}
        ai="center"
        jc="center"
      >
        <Icon color={style.icon.color} name={icon} size={style.icon.size} />
      </YStack>
      <YStack ai="center" gap={style.layout.copyGap}>
        <Heading textAlign="center">{title}</Heading>
        <Body textAlign="center" color={style.description.color}>
          {description}
        </Body>
      </YStack>
    </YStack>
  );
}
