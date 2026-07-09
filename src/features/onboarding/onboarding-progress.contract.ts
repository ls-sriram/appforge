import { z } from "zod";
import type { OnboardingProgressStyle } from "./onboarding-progress.styles";

export const OnboardingProgressBlockSchema = z.object({
  style: z.custom<OnboardingProgressStyle>(),
  step: z.number(),
  total: z.number(),
  onBack: z.custom<() => void>().optional(),
});

export type OnboardingProgressBlockProps = z.infer<typeof OnboardingProgressBlockSchema>;
