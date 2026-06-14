/**
 * ─────────────────────────────────────────────────────────────────
 * SECTION_HEADER — Section title + optional "See All" link.
 *
 * Used in dashboards and settings to separate content sections.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { ActionText, Block, TapTarget, Text } from "../primitives"

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <Block direction="horizontal" align="center" justify="space-between">
      <Text variant="h3">
        {title}
      </Text>
      {actionLabel && onAction && (
        <TapTarget onPress={onAction}>
          <ActionText>{actionLabel}</ActionText>
        </TapTarget>
      )}
    </Block>
  );
}
