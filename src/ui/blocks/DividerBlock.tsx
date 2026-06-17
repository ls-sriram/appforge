import React from "react";
import { Rule, Row, MetaText } from "../primitives";

export function DividerBlock({ label }: { label?: string }) {
  if (label) {
    return (
      <Row centered between="sm" jc="center">
        <MetaText>{label}</MetaText>
      </Row>
    );
  }
  return <Rule />;
}
