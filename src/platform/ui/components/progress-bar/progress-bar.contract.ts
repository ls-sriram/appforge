import { z } from "zod";
import type { ProgressBarContract } from "./progress-bar.styles";

export const ProgressBarSchema = z.object({
  contract: z.custom<ProgressBarContract>(),
  value: z.number(),
  total: z.number().default(100),
});

export type ProgressBarProps = z.input<typeof ProgressBarSchema>;
