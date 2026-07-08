import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";

export interface AvatarContract {
  frame: {
    width: number;
    height: number;
    borderRadius: number;
    backgroundColor: string;
  };
  text: {
    fontSize: number;
    fontWeight: string | number;
    color: string;
  };
  interaction?: InteractionContract;
}

export function defaultAvatarStyles(t: Theme): Record<string, AvatarContract> {
  const { typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const base = {
    frame: {
      borderRadius: pill,
      backgroundColor: p.primaryMuted,
      width: 0,
      height: 0,
    },
    text: {
      color: p.primary,
      fontWeight: typography.weight.semibold,
      fontSize: typography.size.sm,
    },
  } satisfies Partial<AvatarContract>;

  return {
    sm: { ...base, frame: { ...base.frame!, width: 32, height: 32 }, text: { ...base.text!, fontSize: typography.size.xs }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
    md: { ...base, frame: { ...base.frame!, width: 40, height: 40 }, text: { ...base.text!, fontSize: typography.size.sm }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
    lg: { ...base, frame: { ...base.frame!, width: 56, height: 56 }, text: { ...base.text!, fontSize: typography.size.lg }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.95 } } },
    xl: { ...base, frame: { ...base.frame!, width: 80, height: 80 }, text: { ...base.text!, fontSize: typography.size.xl }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.96 } } },
  };
}
