import React from "react";
import { Block } from "../../../../ui/primitives"
import { Panel } from "../../../../ui/panels";

/**
 * AuthCard — standardized card for auth forms.
 * Consistent width, padding, shadow, border-radius.
 */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Panel pad="none">
      <Block pad="lg">{children}</Block>
    </Panel>
  );
}
