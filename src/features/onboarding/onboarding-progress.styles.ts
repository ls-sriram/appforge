import type { ThemeDefinition } from "../../platform/ui/theme/index";

export interface OnboardingProgressStyle {
  layout: {
    gap: number;
  };
  backIcon: {
    color: string;
    size: number;
  };
  label: {
    fontSize: number;
  };
}

export function defaultOnboardingProgressStyle(theme: ThemeDefinition): OnboardingProgressStyle {
  return {
    layout: {
      gap: theme.spacing.sm,
    },
    backIcon: {
      color: theme.palette.textSecondary,
      size: 16,
    },
    label: {
      fontSize: theme.typography.size.sm,
    },
  };
}
