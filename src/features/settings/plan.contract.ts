import { z } from "zod";
import type { Plan } from "./user-profile.service";
import type { PlanBlockStyle } from "./plan.styles";

export const PlanBlockSchema = z.object({
  style: z.custom<PlanBlockStyle>(),
  plan: z.custom<Plan>().optional(),
  onUpgrade: z.custom<() => void>(),
});

export type PlanBlockProps = z.infer<typeof PlanBlockSchema>;
