import type { PressableContract } from "../pressable/pressable.styles";
import type { Theme } from "../../theme/definitions/tokens";

export interface CardContract extends PressableContract {
  gap: number;
  title: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
    selectedColor?: string;
  };
  subtitle: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
}

export function defaultCardStyles(t: Theme): Record<string, CardContract> {
  const p = t.palette;
  const { spacing, typography } = t;

  return {
    default: {
      frame: {
        backgroundColor: p.surface,
        borderRadius: t.radii.md,
        borderWidth: 1,
        borderColor: p.border,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
      },
      gap: spacing.xs,
      title: {
        color: p.textPrimary,
        fontSize: typography.size.md,
        fontWeight: typography.weight.semibold,
        selectedColor: p.primary,
      },
      subtitle: {
        color: p.textMuted,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.regular,
      },
      interaction: {
        disabledOpacity: 0.45,
        pressed: { opacity: 0.9 },
        hover: { borderColor: p.textSecondary, shadow: "sm" },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.primaryMuted, borderColor: p.primary },
      },
    },
  };
}
