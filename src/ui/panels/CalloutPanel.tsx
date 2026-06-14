import React from "react";
import { Block, Text } from "../primitives";
import { Panel } from "./Panel";

type CalloutTone = "default" | "inverse";

interface CalloutPanelProps {
  label: string;
  message: string;
  icon?: string;
  tone?: CalloutTone;
}

export function CalloutPanel({
  label,
  message,
  icon,
  tone = "default",
}: CalloutPanelProps) {
  const inverse = tone === "inverse";

  return (
    <Panel variant={inverse ? "inverse" : "default"} overflow="hidden">
      <Block direction="horizontal" space="sm">
        {icon ? <Text variant="h3" frame="shrink">{icon}</Text> : null}
        <Block space="xs" frame="fill">
          <Text variant="caption" tone={inverse ? "inverse" : "muted"}>
            {label}
          </Text>
          <Text variant="bodySm" tone={inverse ? "inverse" : "primary"}>
            {message}
          </Text>
        </Block>
      </Block>
    </Panel>
  );
}

