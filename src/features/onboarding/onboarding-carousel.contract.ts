import { z } from "zod";
import type { IconName } from "../../platform/ui/index";
import type { FeatureHighlightStyle } from "./feature-highlight.styles";

export const OnboardingStepSchema = z.object({
  icon: z.custom<IconName>(),
  title: z.string(),
  description: z.string(),
  accent: z.string().optional(),
});

export const OnboardingCarouselSchema = z.object({
  featureStyle: z.custom<FeatureHighlightStyle>(),
  steps: z.array(OnboardingStepSchema),
  onComplete: z.custom<() => void>(),
  ctaLabel: z.string().default("Get Started"),
  skipLabel: z.string().default("Skip"),
});

export type OnboardingStep = z.infer<typeof OnboardingStepSchema>;
export type OnboardingCarouselProps = z.input<typeof OnboardingCarouselSchema>;
