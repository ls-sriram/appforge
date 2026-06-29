import type { ThemeDefinition } from "../../../../platform/ui/theme";
import type { OnboardingUiStyles } from "./onboardingContracts";

export function createOnboardingStyles(theme: ThemeDefinition): OnboardingUiStyles {
  return {
    featureHighlight: {
      layout: {
        rootGap: theme.spacing.md,
        copyGap: theme.spacing.xs,
      },
      frame: {
        backgroundColor: theme.palette.surfaceAlt,
        borderColor: theme.palette.border,
        borderWidth: 1,
        borderRadius: theme.radii.md,
        padding: theme.spacing.md,
      },
      icon: {
        color: theme.palette.textPrimary,
        size: 48,
      },
      description: {
        color: theme.palette.textSecondary,
      },
    },
    hero: {
      layout: {
        gap: theme.spacing.xs,
      },
      subtitle: {
        color: theme.palette.textMuted,
      },
    },
    progress: {
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
    },
    prompt: {
      text: {
        fontWeight: String(theme.typography.weight.bold),
      },
    },
    stepper: {
      label: {
        color: theme.palette.textMuted,
        fontSize: theme.typography.size.sm,
      },
    },
  };
}
