import type { ThemeDefinition } from "../../platform/ui/theme/index";

export interface AuthFormStyle {
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  layout: {
    contentGap: number;
    brandGap: number;
    brandRowGap: number;
    footerGap: number;
  };
  brandIcon: {
    color: string;
    size: number;
  };
  brandTitle: {
    fontWeight: string;
  };
  subtitle: {
    color: string;
  };
  terms: {
    color: string;
  };
  footerPrompt: {
    color: string;
    fontSize: number;
  };
  footerLink: {
    color: string;
    fontWeight: string;
  };
}

export function defaultAuthFormStyle(theme: ThemeDefinition): AuthFormStyle {
  return {
    card: {
      backgroundColor: theme.palette.surface,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.xl,
    },
    layout: {
      contentGap: theme.spacing.md,
      brandGap: theme.spacing.sm,
      brandRowGap: theme.spacing.sm,
      footerGap: theme.spacing.xs,
    },
    brandIcon: {
      color: theme.palette.textPrimary,
      size: 16,
    },
    brandTitle: {
      fontWeight: String(theme.typography.weight.bold),
    },
    subtitle: {
      color: theme.palette.textMuted,
    },
    terms: {
      color: theme.palette.textMuted,
    },
    footerPrompt: {
      color: theme.palette.textMuted,
      fontSize: theme.typography.size.sm,
    },
    footerLink: {
      color: theme.palette.primary,
      fontWeight: String(theme.typography.weight.bold),
    },
  };
}
