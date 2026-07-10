import type { PressableContract } from "../pressable/pressable.styles";
import type { Theme } from "../../theme/definitions/tokens";

export interface MenuItemContract extends PressableContract {
  gap: number;
  checkIconSize: number;
  checkIconColor: string;
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
    checkedColor?: string;
  };
}

export function defaultMenuItemStyles(t: Theme): Record<string, MenuItemContract> {
  const p = t.palette;
  const { spacing, typography } = t;

  return {
    default: {
      frame: {
        backgroundColor: "transparent",
        borderRadius: t.radii.sm,
        borderWidth: 0,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        minHeight: 32,
      },
      gap: spacing.sm,
      checkIconSize: 14,
      checkIconColor: p.primary,
      text: {
        color: p.textPrimary,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.regular,
        checkedColor: p.textPrimary,
      },
      interaction: {
        disabledOpacity: 0.45,
        pressed: { opacity: 0.85 },
        hover: { backgroundColor: p.surfaceAlt },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.surfaceAlt },
      },
    },
  };
}
