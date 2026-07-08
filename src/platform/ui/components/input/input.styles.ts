import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H } from "../../theme/definitions/style-tokens";

export interface InputContract {
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

export function defaultInputStyles(t: Theme): Record<string, InputContract> {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
    default: {
      field: {
        backgroundColor: p.surfaceAlt,
        color: p.textPrimary,
        fontFamily: typography.family,
        borderWidth: 1,
        borderColor: p.border,
        borderRadius: pill,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.size.md,
        placeholderColor: p.textMuted,
        minHeight: CONTROL_H.md,
      },
      interaction: {
        disabledOpacity: 0.5,
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        hover: { borderColor: p.border },
      },
    },
  };
}
