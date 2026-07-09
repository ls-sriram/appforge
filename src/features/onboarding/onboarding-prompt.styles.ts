import type { ThemeDefinition } from "../../platform/ui/theme/index";

export interface OnboardingPromptStyle {
  text: {
    fontWeight: string;
  };
}

export function defaultOnboardingPromptStyle(theme: ThemeDefinition): OnboardingPromptStyle {
  return {
    text: {
      fontWeight: String(theme.typography.weight.bold),
    },
  };
}
