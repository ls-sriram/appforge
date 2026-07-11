import type { ThemeDefinition } from "../ui/theme/index";

export interface MobileBottomNavItemContract {
  frame: {
    minHeight: number;
    borderRadius: number;
    iconSize: number;
    gap: number;
  };
  text: {
    fontSize: number;
    fontWeight: string | number;
  };
  interaction: {
    restingOpacity: number;
    activeBackgroundColor: string;
    activeColor: string;
    inactiveColor: string;
  };
}

export const mobileBottomNavChrome = {
  minHeight: 72,
  brandGap: 12,
  railGap: 8,
  paddingHorizontal: 12,
  paddingTop: 8,
  paddingBottom: 4,
} as const;

export function defaultMobileBottomNavItemStyles(theme: ThemeDefinition): MobileBottomNavItemContract {
  return {
    frame: {
      minHeight: 56,
      borderRadius: theme.radii.lg,
      iconSize: 22,
      gap: theme.spacing.xs,
    },
    text: {
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.weight.medium,
    },
    interaction: {
      restingOpacity: 0.72,
      activeBackgroundColor: theme.palette.primaryMuted,
      activeColor: theme.palette.primary,
      inactiveColor: theme.palette.textSecondary,
    },
  };
}
