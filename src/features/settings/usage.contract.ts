import { z } from "zod";
import type { Usage } from "./user-profile.service";
import type { UsageBlockStyle } from "./usage.styles";

export const UsageBlockSchema = z.object({
  style: z.custom<UsageBlockStyle>(),
  usage: z.custom<Usage>().optional(),
});

export type UsageBlockProps = z.infer<typeof UsageBlockSchema>;
