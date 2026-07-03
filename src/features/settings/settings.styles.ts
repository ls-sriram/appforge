import type { ThemeDefinition } from "../../platform/ui/theme/index";
import type { SettingsShellStyle, SettingsUiStyles } from "./settings.contracts";

function alpha(hex: string, opacity: number): string {
  const normalized = hex.startsWith("#") ? hex : "#000000";
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function createShell(theme: ThemeDefinition, radius: number): SettingsShellStyle {
  return {
    container: {
      backgroundColor: theme.palette.surfaceAlt,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: radius,
      padding: theme.spacing.md,
    },
    sectionTitle: {
      color: theme.palette.textMuted,
      fontSize: theme.typography.size.xs,
    },
    card: {
      backgroundColor: theme.palette.surface,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: theme.radii.sm,
      padding: theme.spacing.sm,
    },
  };
}

export function createSettingsStyles(theme: ThemeDefinition): SettingsUiStyles {
  return {
    profile: {
      shell: createShell(theme, theme.radii.lg),
      avatar: {
        backgroundColor: alpha(theme.palette.primary, 0.12),
        textColor: theme.palette.primary,
        textFontWeight: String(theme.typography.weight.bold),
        sizeSm: 32,
        sizeMd: 40,
        sizeLg: 56,
      },
      email: {
        color: theme.palette.textSecondary,
        fontSize: theme.typography.size.sm,
      },
      uid: {
        color: theme.palette.textMuted,
        fontSize: theme.typography.size.xs,
      },
      chevron: {
        color: theme.palette.textMuted,
        size: 20,
      },
    },
    account: {
      shell: createShell(theme, theme.radii.md),
      icon: {
        color: theme.palette.textMuted,
        size: 16,
      },
      value: {
        color: theme.palette.primary,
        fontSize: theme.typography.size.sm,
      },
    },
    plan: {
      shell: createShell(theme, theme.radii.lg),
      description: {
        color: theme.palette.textSecondary,
        fontSize: theme.typography.size.sm,
      },
      badge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        textFontWeight: String(theme.typography.weight.bold),
      },
      renewCard: {
        gap: theme.spacing.xs,
      },
      planStatus: {
        activeBackgroundColor: alpha(theme.palette.success, 0.12),
        activeColor: theme.palette.success,
        pastDueBackgroundColor: alpha(theme.palette.warning, 0.12),
        pastDueColor: theme.palette.warning,
      },
      renewalIcon: {
        proColor: theme.palette.primary,
        trialColor: theme.palette.warning,
        defaultColor: theme.palette.textMuted,
        size: 14,
      },
    },
    usage: {
      shell: createShell(theme, theme.radii.md),
      metricValue: {
        color: theme.palette.primary,
        fontSize: theme.typography.size.sm,
      },
      bar: {
        trackColor: theme.palette.surfaceAlt,
        trackHeight: 4,
        radius: theme.radii.pill,
        primaryColor: theme.palette.primary,
        warningColor: theme.palette.warning,
        errorColor: theme.palette.error,
      },
    },
  };
}
