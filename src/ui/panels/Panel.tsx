/**
 * ─────────────────────────────────────────────────────────────────
 * PANEL — Content card. Named wrapper over Block paint variants.
 *
 * Callers use a semantic variant name ("default", "muted", etc.)
 * instead of reaching for Block paint tokens directly. Panel is
 * the public card API — Block is the implementation detail.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Block } from "../primitives";
import type { BlockProps, PaintVariant, SpaceToken } from "../primitives";

export type PanelVariant = "default" | "muted" | "strong" | "subtle" | "inverse" | "selected";

type Props = {
  variant?: PanelVariant;
  // Structural overrides — no arbitrary style
  pad?: SpaceToken;
  padH?: SpaceToken;
  padV?: SpaceToken;
  overflow?: "hidden" | "visible";
  frame?: BlockProps["frame"];
  children?: React.ReactNode;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
};

function panelPaintVariant(v: PanelVariant): PaintVariant {
  switch (v) {
    case "default":  return "panel";
    case "muted":    return "panel-muted";
    case "strong":   return "panel-strong";
    case "subtle":   return "panel-subtle";
    case "inverse":  return "panel-inverse";
    case "selected": return "selected";
  }
}

export function Panel({
  variant = "default",
  pad,
  padH,
  padV,
  overflow,
  frame,
  children,
  testID,
  accessible,
  accessibilityLabel,
}: Props) {
  return (
    <Block
      paint={panelPaintVariant(variant)}
      pad={pad}
      padH={padH}
      padV={padV}
      overflow={overflow}
      frame={frame}
      testID={testID}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Block>
  );
}
