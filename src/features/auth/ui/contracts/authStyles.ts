import type { ThemeDefinition } from "../../../../platform/ui/theme";
import type { AuthUiStyles } from "./authContracts";

function alpha(hex: string, opacity: number): string {
  const normalized = hex.startsWith("#") ? hex : "#000000";
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function createAuthStyles(theme: ThemeDefinition): AuthUiStyles {
  return {
    field: {
      layout: {
        gap: theme.spacing.xs,
      },
      frame: {
        backgroundColor: theme.palette.surfaceAlt,
        borderColor: theme.palette.border,
        borderWidth: 1,
        borderRadius: theme.radii.md,
      },
      padding: {
        horizontal: theme.spacing.xl,
        vertical: theme.spacing.sm,
        gap: theme.spacing.sm,
      },
      icon: {
        color: theme.palette.textSecondary,
        size: 18,
      },
      input: {
        textColor: theme.palette.textPrimary,
        placeholderColor: theme.palette.textMuted,
        fontSize: theme.typography.size.md,
      },
      error: {
        textColor: theme.palette.error,
        fontSize: theme.typography.size.sm,
      },
      states: {
        error: {
          frameBackgroundColor: alpha(theme.palette.error, 0.12),
          frameBorderColor: theme.palette.error,
        },
      },
    },
    form: {
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
    },
    submit: {
      layout: {
        gap: theme.spacing.sm,
      },
      errorBox: {
        backgroundColor: alpha(theme.palette.error, 0.12),
        borderColor: theme.palette.error,
        borderWidth: 1,
        borderRadius: theme.radii.sm,
        padding: theme.spacing.sm,
      },
      errorText: {
        color: theme.palette.error,
        fontSize: theme.typography.size.sm,
      },
    },
    welcome: {
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
    },
  };
}
