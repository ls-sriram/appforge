import React from "react";
import { Card, Col } from "../primitives";

export function ActionBlock({
  primary,
  secondary,
  loading = false,
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card>
      <Col between="sm">
        {primary}
        {loading ? null : secondary}
      </Col>
    </Card>
  );
}
