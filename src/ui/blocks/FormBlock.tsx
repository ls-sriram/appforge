import React from "react";
import { Card, Col } from "../primitives";

export function FormBlock({
  children,
  space = "md",
}: {
  children: React.ReactNode;
  space?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <Card>
      <Col between={space}>{children}</Col>
    </Card>
  );
}
