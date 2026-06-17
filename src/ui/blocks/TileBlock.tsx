import React from "react";
import { Card, Col, Heading, Body } from "../primitives";

type TileBlockTone = "neutral" | "info" | "success" | "warning";

export interface TileBlockProps {
  label: string;
  value: string;
  tone?: TileBlockTone;
}

function cardVariantForTone(tone: TileBlockTone): React.ComponentProps<typeof Card>['variant'] {
  switch (tone) {
    case "neutral": return "default";
    case "info":    return "selected";
    case "success": return "neutral";
    case "warning": return "muted";
  }
}

export function TileBlock({ label, value, tone = "neutral" }: TileBlockProps) {
  return (
    <Card variant={cardVariantForTone(tone)} pad="sm">
      <Col between="xs">
        <Body size="sm" numberOfLines={1}>{label}</Body>
        <Heading size="lg" bold numberOfLines={1}>{value}</Heading>
      </Col>
    </Card>
  );
}
