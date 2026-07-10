import { z } from "zod";
import type { TabContract } from "./tab.styles";

// Deliberately narrower than Tabs' TabOptionSchema (no `icon`) — the
// segmented-control shape this component renders (Figma-style Hug/Fixed/
// Fill controls) is text-only labels, not icon+label tab-strip items.
export const TabOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disabled: z.boolean().optional(),
});

export const TabSchema = z.object({
  contract: z.custom<TabContract>(),
  options: z.array(TabOptionSchema),
  value: z.string(),
  onValueChange: z.custom<(value: string) => void>(),
  disabled: z.boolean().default(false),
  testID: z.string().optional(),
});

export type TabSegmentOption = z.infer<typeof TabOptionSchema>;
export type TabProps = z.input<typeof TabSchema>;
