import React from "react";
import { Card, Body } from "../primitives";

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  if (!message) return null;

  return (
    <Card variant="danger" pad="sm">
      <Body size="sm" center>{message}</Body>
    </Card>
  );
}
