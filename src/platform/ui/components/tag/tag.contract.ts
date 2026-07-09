import { z } from "zod";
import type { TagContract } from "./tag.styles";

export const TagSchema = z.object({
  contract: z.custom<TagContract>(),
  label: z.string(),
  selected: z.boolean().default(false),
  onPress: z.custom<() => void>().optional(),
  disabled: z.boolean().optional(),
});

export type TagProps = z.input<typeof TagSchema>;
