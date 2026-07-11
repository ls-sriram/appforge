import type { ThemeDefinition } from "../ui/theme/index";

export function pathNavigationStyles(theme: ThemeDefinition) {
  return {
    root: {
      backgroundColor: theme.palette.surface,
      borderColor: theme.palette.borderSubtle,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    breadcrumb: {
      gap: theme.spacing.xs,
      color: theme.palette.textMuted,
      currentColor: theme.palette.textPrimary,
      fontSize: theme.typography.size.sm,
    },
    action: {
      gap: theme.spacing.xs,
      color: theme.palette.textPrimary,
      exitColor: theme.palette.textSecondary,
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.semibold,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radii.md,
      disabledOpacity: 0.4,
    },
  };
}
