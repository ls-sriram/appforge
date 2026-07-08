import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";

export interface TextAreaContract {
  field: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    fontSize: number;
    minHeight: number;
    placeholderColor?: string;
  };
  interaction?: InteractionContract;
}

export function defaultTextAreaStyles(t: Theme): Record<string, TextAreaContract> {
  const { spacing, typography, radii } = t;
  const p = t.palette;

  return {
    default: {
      field: {
        backgroundColor: p.surfaceAlt,
        color: p.textPrimary,
        fontFamily: typography.family,
        borderWidth: 1,
        borderColor: p.border,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.size.md,
        minHeight: 120,
        placeholderColor: p.textMuted,
      },
      interaction: {
        disabledOpacity: 0.5,
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
      },
    },
  };
}
