import React from "react";
import { Block, MetaText } from "../primitives"
import { Panel } from "./Panel";
import type { PanelVariant } from "./Panel";

interface SectionPanelProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: Extract<PanelVariant, "default" | "strong" | "muted" | "subtle">;
  overflow?: "hidden" | "visible";
}

export function SectionPanel({
  title,
  children,
  footer,
  variant = "default",
  overflow,
}: SectionPanelProps) {
  return (
    <Panel variant={variant} overflow={overflow}>
      <Block space="sm">
        {title ? (
          <MetaText>{title}</MetaText>
        ) : null}
        {children}
        {footer}
      </Block>
    </Panel>
  );
}
