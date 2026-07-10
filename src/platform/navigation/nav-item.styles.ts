import type { InteractionContract } from "../ui";
import type { ThemeDefinition } from "../ui/theme/index";

export interface NavItemContract {
  frame: {
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    /** Resting opacity for an inactive item — active/pressed/hover states override it. */
    restingOpacity: number;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction: InteractionContract;
}

export function defaultNavItemStyles(theme: ThemeDefinition): NavItemContract {
  const { spacing, typography, radii } = theme;
  const p = theme.palette;

  return {
    frame: {
      borderRadius: radii.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      restingOpacity: 0.65,
    },
    text: {
      color: p.textSecondary,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },
    interaction: {
      disabledOpacity: 0.4,
      hover: { opacity: 0.85 },
      pressed: { opacity: 0.7, scale: 0.98 },
      selected: {
        backgroundColor: p.primaryMuted,
        color: p.primary,
        fontWeight: typography.weight.semibold,
        opacity: 1,
      },
    },
  };
}
