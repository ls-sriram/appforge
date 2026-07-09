import { z } from "zod";
import type { ReactNode } from "react";

export const OnboardingCardBlockSchema = z.object({
  children: z.custom<ReactNode>(),
  size: z.enum(["default", "tall"]).default("default"),
});

export type OnboardingCardBlockProps = z.input<typeof OnboardingCardBlockSchema>;
