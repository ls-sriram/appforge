import React from "react";
import { Block } from "../primitives"
import { Panel } from "../panels";

/**
 * FormBlock — vertical stack of form fields with consistent spacing.
 */
export function FormBlock({
  children,
  space = "md",
}: {
  children: React.ReactNode;
  space?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <Block>
      <Panel>
        <Block space={space}>{children}</Block>
      </Panel>
    </Block>
  );
}
