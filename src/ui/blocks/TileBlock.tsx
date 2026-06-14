import React from "react";
import { Block, Text } from "../primitives"

type TileBlockTone = "neutral" | "info" | "success" | "warning";

export interface TileBlockProps {
  label: string;
  value: string;
  tone?: TileBlockTone;
}

function paintForTone(tone: TileBlockTone) {
  switch (tone) {
    case "neutral": return "panel" as const;
    case "info":    return "selected" as const;
    case "success": return "neutral" as const;
    case "warning": return "panel-muted" as const;
  }
}

export function TileBlock({ label, value, tone = "neutral" }: TileBlockProps) {
  return (
    <Block>
      <Block paint={paintForTone(tone)}>
        <Block pad="sm">
          <Block space="xs">
            <Text variant="bodySm" numberOfLines={1}>
              {label}
            </Text>
            <Text variant="h2" numberOfLines={1}>
              {value}
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
