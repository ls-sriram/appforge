import { z } from "zod";
import type { ReactNode } from "react";

export const OnboardingActionDockBlockSchema = z.object({
  children: z.custom<ReactNode>(),
});

export type OnboardingActionDockBlockProps = z.infer<typeof OnboardingActionDockBlockSchema>;
