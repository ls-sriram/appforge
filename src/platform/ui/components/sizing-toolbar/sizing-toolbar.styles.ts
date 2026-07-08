import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H } from "../../theme/definitions/style-tokens";

export interface SizingToolbarContract {
  container: {
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    disabledOpacity: number;
  };
  button: {
    minWidth: number;
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    selectedBackgroundColor: string;
    unselectedBackgroundColor: string;
    dividerWidth: number;
    dividerColor: string;
  };
  icon: {
    selectedColor: string;
    unselectedColor: string;
    size: number;
  };
}

export function defaultSizingToolbarStyles(t: Theme): Record<string, SizingToolbarContract> {
  const { spacing, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
    default: {
      container: {
        borderWidth: 1,
        borderColor: p.border,
        borderRadius: pill,
        disabledOpacity: 0.5,
      },
      button: {
        minWidth: CONTROL_H.sm,
        minHeight: CONTROL_H.sm,
        paddingHorizontal: spacing.sm - 1,
        paddingVertical: spacing.xs + 2,
        selectedBackgroundColor: p.primaryMuted,
        unselectedBackgroundColor: p.surface,
        dividerWidth: 1,
        dividerColor: p.border,
      },
      icon: {
        selectedColor: p.primary,
        unselectedColor: p.textMuted,
        size: 16,
      },
    },
  };
}
