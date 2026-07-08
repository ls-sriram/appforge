import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";

export interface SelectableChipContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    paddingVertical: number;
    paddingHorizontal: number;
  };
  shape: {
    pillBorderRadius: number;
    roundedBorderRadius: number;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction?: InteractionContract;
}

export function defaultSelectableChipStyles(t: Theme): Record<string, SelectableChipContract> {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
    sm: {
      container: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm + 2,
      },
      shape: {
        pillBorderRadius: pill,
        roundedBorderRadius: radii.sm,
      },
      text: {
        color: p.textSecondary,
        fontSize: typography.size.xs,
        fontWeight: typography.weight.regular,
      },
      interaction: {
        disabledOpacity: 0.5,
        pressed: { opacity: 0.75 },
        selected: { backgroundColor: p.textPrimary, borderColor: p.textPrimary, color: p.textInverse, fontWeight: typography.weight.semibold },
      },
    },
    md: {
      container: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        paddingVertical: spacing.xs + 1,
        paddingHorizontal: spacing.md - 2,
      },
      shape: {
        pillBorderRadius: pill,
        roundedBorderRadius: radii.sm,
      },
      text: {
        color: p.textSecondary,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.regular,
      },
      interaction: {
        disabledOpacity: 0.5,
        pressed: { opacity: 0.75 },
        selected: { backgroundColor: p.textPrimary, borderColor: p.textPrimary, color: p.textInverse, fontWeight: typography.weight.semibold },
      },
    },
  };
}
