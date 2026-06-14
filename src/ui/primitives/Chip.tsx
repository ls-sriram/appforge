import React from "react";
import { Block } from "./Block";
import type { SpaceToken } from "./Block";

export type ChipTone = "success" | "warning" | "danger" | "info";

interface ChipProps {
  tone: ChipTone;
  pad?: SpaceToken;
  children: React.ReactNode;
}

export function Chip({ tone, pad = "xs", children }: ChipProps) {
  return (
    <Block paint={`chip-${tone}`} pad={pad} direction="horizontal" space="xs" align="center">
      {children}
    </Block>
  );
}
