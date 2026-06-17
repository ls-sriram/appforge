/**
 * Pure serializer — turns a composed PlaygroundNode tree into the exact
 * JSX a developer would hand-write against `src/ui/primitives`. No React,
 * no theme, no state: deterministic text formatting only.
 */
import type { PlaygroundNode, BlockTokenProps } from "../viewmodel/use-ui-playground";

function attrs(props: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === false) continue;
    parts.push(value === true ? key : `${key}=${JSON.stringify(value)}`);
  }
  return parts.length ? " " + parts.join(" ") : "";
}

function indent(depth: number): string {
  return "  ".repeat(depth);
}

function blockAttrs(blockProps: BlockTokenProps): string {
  return attrs(blockProps as Record<string, unknown>);
}

export function nodeToSource(node: PlaygroundNode, depth = 0): string {
  const pad = indent(depth);
  if (node.kind === "text") {
    const a = attrs({ variant: node.textVariant !== "body" ? node.textVariant : undefined, tone: node.tone, frame: node.leafFrame });
    return `${pad}<Text${a}>${node.label}</Text>`;
  }
  if (node.kind === "button") {
    const a = attrs({ label: node.label, variant: "secondary" });
    return `${pad}<Button${a} onPress={...} />`;
  }
  if (node.kind === "tag") {
    const a = attrs({ label: node.label, tone: node.tone !== "secondary" ? node.tone : undefined });
    return `${pad}<Tag${a} />`;
  }

  const a = blockAttrs(node.blockProps);
  if (node.children.length === 0) {
    return `${pad}<Block${a} />`;
  }
  const children = node.children.map((c) => nodeToSource(c, depth + 1)).join("\n");
  return `${pad}<Block${a}>\n${children}\n${pad}</Block>`;
}

export function playgroundToSource(root: PlaygroundNode): string {
  const importLine = `import { Block, Text, Button, Tag } from "../../../../ui/primitives";`;
  return `${importLine}\n\n${nodeToSource(root, 0)}`;
}
