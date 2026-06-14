import React from "react";
import { Block } from "../primitives"
import { Panel } from "../panels";

/**
 * ActionBlock — container for action buttons (primary + secondary).
 * Stacks vertically with consistent spacing.
 */
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
    <Block>
      <Panel>
        <Block space="sm">
          {primary}
          {loading ? null : secondary}
        </Block>
      </Panel>
    </Block>
  );
}
