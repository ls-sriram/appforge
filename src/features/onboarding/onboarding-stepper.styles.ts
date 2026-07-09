import type { ThemeDefinition } from "../../platform/ui/theme/index";

export interface OnboardingStepperStyle {
  label: {
    color: string;
    fontSize: number;
  };
}

export function defaultOnboardingStepperStyle(theme: ThemeDefinition): OnboardingStepperStyle {
  return {
    label: {
      color: theme.palette.textMuted,
      fontSize: theme.typography.size.sm,
    },
  };
}
