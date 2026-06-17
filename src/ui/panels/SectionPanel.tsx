import React from "react";
import { Card, Col, Label } from "../primitives";
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
    <Card variant={variant as any} overflow={overflow as any}>
      <Col between="sm">
        {title ? <Label dim upper tracking="sm">{title}</Label> : null}
        {children}
        {footer}
      </Col>
    </Card>
  );
}
