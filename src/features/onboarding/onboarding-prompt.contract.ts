import { z } from "zod";
import type { UiStamp } from "../../platform/ui/index";
import type { OnboardingPromptStyle } from "./onboarding-prompt.styles";

export const OnboardingPromptBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<OnboardingPromptStyle>(),
  text: z.string(),
});

export type OnboardingPromptBlockProps = z.infer<typeof OnboardingPromptBlockSchema>;
