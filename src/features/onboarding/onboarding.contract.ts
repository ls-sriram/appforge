import { z } from "zod";
import type { ReactNode } from "react";
import type { UiStamp } from "../../platform/ui/index";

export const OnboardingScaffoldSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  stepper: z.custom<ReactNode>(),
  hero: z.custom<ReactNode>(),
  question: z.custom<ReactNode>().optional(),
  answerRegion: z.custom<ReactNode>().optional(),
});

export type OnboardingScaffoldProps = z.infer<typeof OnboardingScaffoldSchema>;
