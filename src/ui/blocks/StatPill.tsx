/**
 * ─────────────────────────────────────────────────────────────────
 * STAT_PILL — Compact stat display: label + value.
 *
 * Used in dashboards for quick metric glances.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Col, Label, MetaText, Heading } from "../primitives";

export interface StatPillProps {
  label: string;
  value: string;
  suffix?: string;
  tone?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
}

export function StatPill({ label, value, suffix, tone = "primary" }: StatPillProps) {
  return (
    <Col between="xxs">
      <Label size="xs" tertiary upper tracking="xs">{label}</Label>
      <Heading
        bold
        success={tone === "success"}
        warning={tone === "warning"}
        dim={tone === "secondary"}
      >
        {value}
      </Heading>
      {suffix && <MetaText>{suffix}</MetaText>}
    </Col>
  );
}
