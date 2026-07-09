import { z } from "zod";
import type { ReactNode } from "react";

export const OnboardingFrameSchema = z.object({
  header: z.custom<ReactNode>(),
  panel: z.custom<ReactNode>(),
  footer: z.custom<ReactNode>(),
});

export type OnboardingFrameProps = z.infer<typeof OnboardingFrameSchema>;
