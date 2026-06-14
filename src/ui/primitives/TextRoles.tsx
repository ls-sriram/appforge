import React from "react";
import { Text } from "./Text";
import type { TextTone } from "./Text";

interface BaseRoleProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  frame?: "fluid" | "shrink";
  numberOfLines?: number;
}

interface MetaTextProps extends BaseRoleProps {
  tone?: Extract<TextTone, "secondary" | "muted" | "tertiary" | "danger" | "inverse">;
}

export function MetaText({
  children,
  tone = "muted",
  align,
  frame,
  numberOfLines,
}: MetaTextProps) {
  return (
    <Text variant="caption" tone={tone} align={align} frame={frame} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

interface ActionTextProps extends BaseRoleProps {
  tone?: Extract<TextTone, "action" | "inverse" | "primary">;
}

export function ActionText({
  children,
  tone = "action",
  align,
  frame,
  numberOfLines,
}: ActionTextProps) {
  return (
    <Text variant="bodySm" tone={tone} weight="semibold" align={align} frame={frame} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}
