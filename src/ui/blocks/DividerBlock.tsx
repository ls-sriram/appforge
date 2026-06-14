import React from "react";
import { Block, MetaText } from "../primitives"

/**
 * DividerBlock — horizontal rule with optional label.
 */
export function DividerBlock({ label }: { label?: string }) {
  return (
    <Block>
      <Block >
        {label ? (
          <Block direction="horizontal" align="center" justify="center" space="sm">
            <MetaText>{label}</MetaText>
          </Block>
        ) : null}
      </Block>
    </Block>
  );
}
