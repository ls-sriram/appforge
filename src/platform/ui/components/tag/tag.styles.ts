import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";

export interface TagContract {
  container: {
    backgroundColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction?: InteractionContract;
}

export function defaultTagStyles(t: Theme): Record<string, TagContract> {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const base = {
    container: {
      borderRadius: pill,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      backgroundColor: p.surfaceAlt,
    },
    text: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.semibold,
      color: p.textMuted,
    },
  } satisfies Partial<TagContract>;

  return {
    muted: { ...base, container: { ...base.container!, backgroundColor: p.surfaceAlt }, text: { ...base.text!, color: p.textMuted }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary } } },
    secondary: { ...base, container: { ...base.container!, backgroundColor: p.surfaceAlt }, text: { ...base.text!, color: p.textSecondary }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary } } },
    accent: { ...base, container: { ...base.container!, backgroundColor: p.primaryMuted }, text: { ...base.text!, color: p.primary }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.primary, color: p.textInverse } } },
    success: { ...base, container: { ...base.container!, backgroundColor: p.successMuted }, text: { ...base.text!, color: p.success }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.success, color: p.textInverse } } },
    warning: { ...base, container: { ...base.container!, backgroundColor: p.warningMuted }, text: { ...base.text!, color: p.warning }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.warning, color: p.textInverse } } },
    danger: { ...base, container: { ...base.container!, backgroundColor: p.errorMuted }, text: { ...base.text!, color: p.error }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.error, color: p.textInverse } } },
    info: { ...base, container: { ...base.container!, backgroundColor: p.infoMuted }, text: { ...base.text!, color: p.info }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.info, color: p.textInverse } } },
  };
}
