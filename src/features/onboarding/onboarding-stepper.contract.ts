import { z } from "zod";
import type { UiStamp } from "../../platform/ui/index";
import type { OnboardingStepperStyle } from "./onboarding-stepper.styles";

export const OnboardingStepperBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<OnboardingStepperStyle>(),
  step: z.number(),
  total: z.number(),
});

export type OnboardingStepperBlockProps = z.infer<typeof OnboardingStepperBlockSchema>;
