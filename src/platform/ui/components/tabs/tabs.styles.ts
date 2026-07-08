import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H, GAP } from "../../theme/definitions/style-tokens";

export interface TabsContract {
  list: {
    borderWidth: number;
    borderColor: string;
  };
  item: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    gap: number;
    borderWidth: number;
    selectedBorderColor: string;
    unselectedBorderColor: string;
    disabledOpacity: number;
  };
  icon: {
    size: number;
    selectedColor: string;
    unselectedColor: string;
  };
  text: {
    fontSize: number;
    lineHeight: number;
    selectedColor: string;
    unselectedColor: string;
    selectedFontFamily: string;
    unselectedFontFamily: string;
  };
}

export function defaultTabsStyles(t: Theme): Record<string, TabsContract> {
  const { spacing, typography } = t;
  const p = t.palette;

  return {
    default: {
      list: {
        borderWidth: 1,
        borderColor: p.border,
      },
      item: {
        minHeight: CONTROL_H.sm + 8,
        paddingHorizontal: spacing.md - 4,
        paddingVertical: spacing.sm,
        gap: GAP.xs - 2,
        borderWidth: 2,
        selectedBorderColor: p.primary,
        unselectedBorderColor: "transparent",
        disabledOpacity: 0.5,
      },
      icon: {
        size: 14,
        selectedColor: p.primary,
        unselectedColor: p.textMuted,
      },
      text: {
        fontSize: typography.size.sm,
        lineHeight: typography.size.sm,
        selectedColor: p.primary,
        unselectedColor: p.textSecondary,
        selectedFontFamily: typography.family,
        unselectedFontFamily: typography.family,
      },
    },
  };
}
