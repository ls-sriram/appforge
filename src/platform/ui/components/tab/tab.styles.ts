import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H } from "../../theme/definitions/style-tokens";

// Distinct from Tabs (tabs.styles.ts): Tabs is a tab strip with an
// underline indicator on the selected item. Tab is the segmented-control
// shape — a filled track with equal-width segments, the active segment
// getting its own filled background rather than a border. They intentionally
// don't share a contract shape.
export interface TabContract {
  track: {
    backgroundColor: string;
    borderRadius: number;
    padding: number;
  };
  segment: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: number;
  };
  text: {
    fontSize: number;
    lineHeight: number;
    selectedColor: string;
    unselectedColor: string;
    fontWeight: string | number;
    selectedFontWeight: string | number;
  };
  interaction?: InteractionContract;
}

export function defaultTabStyles(t: Theme): Record<string, TabContract> {
  const { spacing, typography, radii } = t;
  const p = t.palette;

  return {
    default: {
      track: {
        backgroundColor: p.surfaceAlt,
        borderRadius: radii.pill,
        padding: 3,
      },
      segment: {
        minHeight: CONTROL_H.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radii.pill,
      },
      text: {
        fontSize: typography.size.sm,
        lineHeight: typography.size.sm,
        selectedColor: p.textPrimary,
        unselectedColor: p.textMuted,
        fontWeight: typography.weight.regular,
        selectedFontWeight: typography.weight.semibold,
      },
      interaction: {
        disabledOpacity: 0.5,
        pressed: { opacity: 0.85 },
        hover: { backgroundColor: p.surfaceStrong },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.surface },
      },
    },
  };
}
