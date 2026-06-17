/**
 * ─────────────────────────────────────────────────────────────────
 * SECTION_HEADER — Section title + optional "See All" link.
 *
 * Used in dashboards and settings to separate content sections.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Row, Heading, ActionText, TapTarget } from "../primitives";

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
    <Row centered spread>
      <Heading size="sm">{title}</Heading>
      {actionLabel && onAction && (
        <TapTarget onPress={onAction}>
          <ActionText>{actionLabel}</ActionText>
        </TapTarget>
      )}
    </Row>
  );
}
