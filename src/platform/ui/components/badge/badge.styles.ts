import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";

export interface BadgeContract {
  container: {
    backgroundColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    borderWidth?: number;
    borderColor?: string;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction?: InteractionContract;
}

export function defaultBadgeStyles(t: Theme): Record<string, BadgeContract> {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const base = {
    container: {
      backgroundColor: p.surfaceAlt,
      borderRadius: pill,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: p.border,
    },
    text: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.semibold,
      color: p.textMuted,
    },
  } satisfies Partial<BadgeContract>;

  return {
    muted: { ...base, container: { ...base.container!, backgroundColor: p.surfaceAlt, borderColor: p.border }, text: { ...base.text!, color: p.textMuted }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    success: { ...base, container: { ...base.container!, backgroundColor: p.successMuted, borderColor: p.success }, text: { ...base.text!, color: p.success }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    warning: { ...base, container: { ...base.container!, backgroundColor: p.warningMuted, borderColor: p.warning }, text: { ...base.text!, color: p.warning }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    danger: { ...base, container: { ...base.container!, backgroundColor: p.errorMuted, borderColor: p.error }, text: { ...base.text!, color: p.error }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    info: { ...base, container: { ...base.container!, backgroundColor: p.infoMuted, borderColor: p.info }, text: { ...base.text!, color: p.info }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
  };
}
