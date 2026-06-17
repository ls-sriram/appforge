import React from "react";
import { Col, Row, Heading, Body, Icon } from "../../../../ui/primitives";
import { app } from "../../../../config/app";

interface AuthBrandBlockProps {
  subtitle: string;
}

export function AuthBrandBlock({ subtitle }: AuthBrandBlockProps) {
  return (
    <Col between="sm" centered>
      <Row centered between="sm">
        <Icon name="zap" size="md" />
        <Heading bold>{app.name}</Heading>
      </Row>
      <Body dim center>{subtitle}</Body>
    </Col>
  );
}
