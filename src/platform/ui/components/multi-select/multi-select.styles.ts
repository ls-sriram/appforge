import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H, GAP } from "../../theme/definitions/style-tokens";

export interface MultiSelectContract {
  label: {
    color: string;
    fontSize: number;
  };
  trigger: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    minHeight: number;
    paddingVertical: number;
    paddingHorizontal: number;
    gap: number;
  };
  text: {
    color: string;
    fontFamily: string;
    placeholderColor: string;
  };
  icon: {
    color: string;
    size: number;
    selectedColor: string;
  };
  menu: {
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
  };
  option: {
    selectedBackgroundColor: string;
    selectedColor: string;
    color: string;
    fontSize: number;
    fontWeight: string | number;
    selectedFontWeight: string | number;
    descriptionFontSize: number;
    descriptionColor: string;
    rowGap: number;
  };
  token: {
    backgroundColor: string;
    color: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    fontWeight: string | number;
    fontSize: number;
  };
  helper: {
    color: string;
    fontSize: number;
  };
  layout: {
    fieldGap: number;
  };
  interaction?: InteractionContract;
}

export function defaultMultiSelectStyles(t: Theme): Record<string, MultiSelectContract> {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
    default: {
      label: { color: p.textSecondary, fontSize: typography.size.md },
      trigger: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        borderRadius: radii.md,
        minHeight: CONTROL_H.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.sm + 2,
      },
      text: {
        color: p.textPrimary,
        fontFamily: typography.family,
        placeholderColor: p.textMuted,
      },
      icon: {
        color: p.textMuted,
        size: 16,
        selectedColor: p.primary,
      },
      menu: {
        backgroundColor: p.surface,
        borderColor: p.border,
        borderRadius: radii.md,
      },
      option: {
        selectedBackgroundColor: p.primaryMuted,
        selectedColor: p.primary,
        color: p.textPrimary,
        fontSize: typography.size.md,
        fontWeight: typography.weight.regular,
        selectedFontWeight: typography.weight.medium,
        descriptionFontSize: typography.size.sm,
        descriptionColor: p.textMuted,
        rowGap: GAP.tight,
      },
      token: {
        backgroundColor: p.primaryMuted,
        color: p.primary,
        borderRadius: pill,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        fontWeight: typography.weight.medium,
        fontSize: typography.size.sm,
      },
      helper: {
        color: p.textMuted,
        fontSize: typography.size.sm,
      },
      layout: {
        fieldGap: GAP.xs,
      },
      interaction: {
        disabledOpacity: 0.5,
        hover: { borderColor: p.border },
      },
    },
  };
}
