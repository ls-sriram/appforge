import { z } from "zod";
import type { ReactNode } from "react";
import type { ListItemContract } from "./list-item.styles";

// "button" for an action row (nav rows, dep-row actions, file/entry rows
// triggering navigation). "option" for a genuine selection-list member
// (palette/block-list, screen-list) — the spec flags this ambiguity
// explicitly rather than defaulting every row to "button".
export const ListItemVariantSchema = z.enum(["button", "option"]);

export const ListItemSchema = z.object({
  contract: z.custom<ListItemContract>(),
  variant: ListItemVariantSchema.default("button"),
  accessibilityLabel: z.string(),
  // Convenience text path for simple rows; `children` takes over entirely
  // when present (agent-runs-table's multi-column rows need it).
  label: z.string().optional(),
  selected: z.boolean().default(false),
  disabled: z.boolean().optional(),
  onPress: z.custom<() => void>(),
  leading: z.custom<ReactNode>().optional(),
  trailing: z.custom<ReactNode>().optional(),
  // Rendered as a sibling of the row's Pressable, not nested inside it —
  // this is the fix for the button-inside-a-button pattern
  // layers-inspector.view.tsx currently hand-rolls with manual
  // stopPropagation. Give it its own independent onPress (e.g. an
  // IconButton) rather than composing it into the row's own onPress.
  trailingAction: z.custom<ReactNode>().optional(),
  children: z.custom<ReactNode>().optional(),
  testID: z.string().optional(),
});

export type ListItemProps = z.input<typeof ListItemSchema>;
