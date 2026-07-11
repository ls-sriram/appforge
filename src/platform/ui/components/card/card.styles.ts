import type { PressableContract } from "../pressable/pressable.styles";
import type { Theme } from "../../theme/definitions/tokens";

export interface CardContract extends PressableContract {
  gap: number;
  contentGap: number;
  secondRow: {
    gap: number;
    paddingTop: number;
    paddingHorizontal: number;
  };
  disclosure: {
    color: string;
    size: number;
  };
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

  const makeCard = (
    frame: CardContract["frame"],
    gap: number,
    contentGap: number,
  ): CardContract => ({
      frame,
      gap,
      contentGap,
      secondRow: {
        gap,
        paddingTop: contentGap,
        paddingHorizontal: frame.paddingHorizontal ?? 0,
      },
      disclosure: {
        color: p.textMuted,
        size: 16,
      },
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
    });

  return {
    default: makeCard({
      backgroundColor: p.surface,
      borderRadius: t.radii.md,
      borderWidth: 1,
      borderColor: p.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    }, spacing.md, spacing.xs),
    borderless: makeCard({
      backgroundColor: "transparent",
      borderRadius: t.radii.md,
      borderWidth: 0,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    }, spacing.md, spacing.xs),
    compact: makeCard({
      backgroundColor: p.surface,
      borderRadius: t.radii.sm,
      borderWidth: 1,
      borderColor: p.border,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
    }, spacing.sm, spacing.xs),
    dense: makeCard({
      backgroundColor: p.surface,
      borderRadius: t.radii.sm,
      borderWidth: 1,
      borderColor: p.border,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    }, spacing.xs, 2),
  };
}
