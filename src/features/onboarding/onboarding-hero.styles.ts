import type { ThemeDefinition } from "../../platform/ui/theme/index";

export interface OnboardingHeroStyle {
  layout: {
    gap: number;
  };
  subtitle: {
    color: string;
  };
}

export function defaultOnboardingHeroStyle(theme: ThemeDefinition): OnboardingHeroStyle {
  return {
    layout: {
      gap: theme.spacing.xs,
    },
    subtitle: {
      color: theme.palette.textMuted,
    },
  };
}
