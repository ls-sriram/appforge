/**
 * ─────────────────────────────────────────────────────────────────
 * FEATURE_CARD — Onboarding feature highlight.
 *
 * Large icon + title + description for onboarding carousel.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Block, Icon, Text } from "../../../ui/primitives"
import { Panel } from "../../../ui/panels";
import type { IconName } from "../../../ui/primitives";

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
    <Block align="center" space="md">
      <Panel>
        <Icon name={icon} size="5xl" />
      </Panel>
      <Block align="center" space="xs">
        <Text variant="h2" align="center">
          {title}
        </Text>
        <Text variant="body" align="center">
          {description}
        </Text>
      </Block>
    </Block>
  );
}
