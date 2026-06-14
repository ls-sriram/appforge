import React from "react";
import { Block, Text } from "../primitives"

/**
 * ErrorBanner — standardized error display block.
 * Fully self-styled. Consumed by any form or surface.
 * ZERO inline styles in consumers.
 */
export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  if (!message) return null;

  return (
    <Block>
      <Block paint="danger">
        <Block pad="sm">
          <Text variant="bodySm" align="center">
            {message}
          </Text>
        </Block>
      </Block>
    </Block>
  );
}
