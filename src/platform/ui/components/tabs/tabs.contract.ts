import { z } from "zod";
import type { IconName } from "../../primitives/Icon";
import type { TabsContract } from "./tabs.styles";

export const TabOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.custom<IconName>().optional(),
  disabled: z.boolean().optional(),
});

export const TabsSchema = z.object({
  contract: z.custom<TabsContract>(),
  options: z.array(TabOptionSchema),
  value: z.string(),
  onValueChange: z.custom<(value: string) => void>(),
  disabled: z.boolean().default(false),
  testID: z.string().optional(),
});

export type TabOption = z.infer<typeof TabOptionSchema>;
export type TabsProps = z.input<typeof TabsSchema>;
