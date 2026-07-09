import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { defaultFeatureHighlightStyle, type FeatureHighlightStyle } from "./feature-highlight.styles";
import { defaultOnboardingHeroStyle, type OnboardingHeroStyle } from "./onboarding-hero.styles";
import { defaultOnboardingProgressStyle, type OnboardingProgressStyle } from "./onboarding-progress.styles";
import { defaultOnboardingPromptStyle, type OnboardingPromptStyle } from "./onboarding-prompt.styles";
import { defaultOnboardingStepperStyle, type OnboardingStepperStyle } from "./onboarding-stepper.styles";

export interface OnboardingUiStyles {
  featureHighlight: FeatureHighlightStyle;
  hero: OnboardingHeroStyle;
  progress: OnboardingProgressStyle;
  prompt: OnboardingPromptStyle;
  stepper: OnboardingStepperStyle;
}

export function createOnboardingStyles(theme: ThemeDefinition): OnboardingUiStyles {
  return {
    featureHighlight: defaultFeatureHighlightStyle(theme),
    hero: defaultOnboardingHeroStyle(theme),
    progress: defaultOnboardingProgressStyle(theme),
    prompt: defaultOnboardingPromptStyle(theme),
    stepper: defaultOnboardingStepperStyle(theme),
  };
}
