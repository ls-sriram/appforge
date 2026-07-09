import { z } from "zod";
import type { UiStamp } from "../../platform/ui/index";
import type { OnboardingHeroStyle } from "./onboarding-hero.styles";

export const OnboardingHeroBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<OnboardingHeroStyle>(),
  title: z.string(),
  subtitle: z.string().optional(),
});

export type OnboardingHeroBlockProps = z.infer<typeof OnboardingHeroBlockSchema>;
