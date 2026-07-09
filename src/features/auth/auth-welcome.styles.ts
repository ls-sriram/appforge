import type { ThemeDefinition } from "../../platform/ui/theme/index";

export interface AuthWelcomeStyle {
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
  };
  layout: {
    rootGap: number;
    copyGap: number;
    actionsGap: number;
  };
  eyebrow: {
    color: string;
    letterSpacing: number;
  };
  body: {
    color: string;
    fontSize: number;
    lineHeight: number;
  };
}

export function defaultAuthWelcomeStyle(theme: ThemeDefinition): AuthWelcomeStyle {
  return {
    card: {
      backgroundColor: theme.palette.surface,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: theme.radii.lg,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
    },
    layout: {
      rootGap: theme.spacing.xl,
      copyGap: theme.spacing.md,
      actionsGap: theme.spacing.sm,
    },
    eyebrow: {
      color: theme.palette.textMuted,
      letterSpacing: 1,
    },
    body: {
      color: theme.palette.textMuted,
      fontSize: theme.typography.size.lg,
      lineHeight: theme.typography.size.lg,
    },
  };
}
