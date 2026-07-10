import type { PressableContract } from "../pressable/pressable.styles";
import type { Theme } from "../../theme/definitions/tokens";

// Extends PressableContract (not just re-shapes it) so a ListItemContract
// can be handed straight to <Pressable contract={s} /> — frame/interaction
// stay structurally identical to the primitive it composes; `gap`/`text`
// are the only row-specific additions.
export interface ListItemContract extends PressableContract {
  gap: number;
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
    selectedColor?: string;
  };
}

export function defaultListItemStyles(t: Theme): Record<string, ListItemContract> {
  const p = t.palette;
  const { spacing, typography } = t;

  return {
    default: {
      frame: {
        backgroundColor: "transparent",
        borderRadius: t.radii.sm,
        borderWidth: 0,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 40,
      },
      gap: spacing.sm,
      text: {
        color: p.textPrimary,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.regular,
        selectedColor: p.textPrimary,
      },
      interaction: {
        disabledOpacity: 0.45,
        pressed: { opacity: 0.85 },
        hover: { backgroundColor: p.surfaceAlt },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.primaryMuted, borderColor: p.primary, fontWeight: typography.weight.semibold },
      },
    },
  };
}
