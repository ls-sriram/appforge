import React from "react";
import { Col, Display, Label } from "../../../../../ui/primitives";
import { app } from "../../../../../config/app";

export function WelcomeHeroBlock() {
  return (
    <Col between="md" inset="md" padV="lg">
      <Label upper tracking="md" dim>{app.name}</Label>
      <Display>{app.tagline}</Display>
    </Col>
  );
}
