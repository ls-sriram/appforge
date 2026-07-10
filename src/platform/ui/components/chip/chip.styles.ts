import type { PressableContract } from "../pressable/pressable.styles";
import type { Theme } from "../../theme/definitions/tokens";

export interface ChipContract extends PressableContract {
  shape: {
    pillBorderRadius: number;
    roundedBorderRadius: number;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
    selectedColor?: string;
  };
}

// Two tones instead of one hardcoded "selected inverts to a solid fill"
// treatment — chip.block.tsx in appforge-site exists specifically because
// SelectableChip's single built-in selected style (light-fill invert)
// didn't fit every call site. Callers pick a tone by which contract object
// they pass in (defaultContracts.chip.neutral vs .accent), same pattern
// Button uses for primary/secondary/ghost/danger.
export function defaultChipStyles(t: Theme): Record<string, ChipContract> {
  const { spacing, typography, radii } = t;
  const p = t.palette;

  const shape = {
    pillBorderRadius: radii.pill,
    roundedBorderRadius: radii.sm,
  };

  const frame = {
    backgroundColor: p.surfaceAlt,
    borderWidth: 1,
    borderColor: p.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  };

  return {
    neutral: {
      frame,
      shape,
      text: {
        color: p.textSecondary,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.regular,
        selectedColor: p.textInverse,
      },
      interaction: {
        disabledOpacity: 0.5,
        pressed: { opacity: 0.75 },
        hover: { borderColor: p.textSecondary },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.textPrimary, borderColor: p.textPrimary, fontWeight: typography.weight.semibold },
      },
    },
    accent: {
      frame,
      shape,
      text: {
        color: p.textSecondary,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.regular,
        selectedColor: p.primary,
      },
      interaction: {
        disabledOpacity: 0.5,
        pressed: { opacity: 0.75 },
        hover: { borderColor: p.primary },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.primaryMuted, borderColor: p.primary, fontWeight: typography.weight.semibold },
      },
    },
  };
}
