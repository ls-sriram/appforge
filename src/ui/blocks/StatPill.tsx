/**
 * ─────────────────────────────────────────────────────────────────
 * STAT_PILL — Compact stat display: label + value.
 *
 * Used in dashboards for quick metric glances.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Block, MetaText, Text } from "../primitives"

export interface StatPillProps {
  label: string;
  value: string;
  suffix?: string;
  tone?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
}

export function StatPill({ label, value, suffix, tone = "primary" }: StatPillProps) {
  return (
    <Block space="xxs">
      <MetaText tone="tertiary">{label}</MetaText>
      <Text variant="h3" tone={tone}>
        {value}
      </Text>
      {suffix && (
        <MetaText tone="secondary">{suffix}</MetaText>
      )}
    </Block>
  );
}
