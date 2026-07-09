import { z } from "zod";
import type { ReactNode } from "react";

export const OnboardingQuestionBlockSchema = z.object({
  hero: z.custom<ReactNode>(),
  question: z.custom<ReactNode>().optional(),
  answerRegion: z.custom<ReactNode>().optional(),
});

export type OnboardingQuestionBlockProps = z.infer<typeof OnboardingQuestionBlockSchema>;
