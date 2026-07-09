import { z } from "zod";
import type { BadgeContract } from "./badge.styles";

export const BadgeSchema = z.object({
  contract: z.custom<BadgeContract>(),
  label: z.string(),
  onPress: z.custom<() => void>().optional(),
  disabled: z.boolean().optional(),
});

export type BadgeProps = z.infer<typeof BadgeSchema>;
