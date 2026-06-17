import React from "react";
import { Card, Row, Col, Label, Body, Heading } from "../primitives";

type CalloutTone = "default" | "inverse";

interface CalloutPanelProps {
  label: string;
  message: string;
  icon?: string;
  tone?: CalloutTone;
}

export function CalloutPanel({
  label,
  message,
  icon,
  tone = "default",
}: CalloutPanelProps) {
  const inverse = tone === "inverse";

  return (
    <Card variant={inverse ? "inverse" : "default"} overflow="hidden">
      <Row between="sm" centered>
        {icon ? <Heading onDark={inverse}>{icon}</Heading> : null}
        <Col between="xs" fill>
          <Label dim={!inverse} onDark={inverse} upper tracking="xs">{label}</Label>
          <Body onDark={inverse}>{message}</Body>
        </Col>
      </Row>
    </Card>
  );
}

