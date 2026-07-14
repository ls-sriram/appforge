import type { Theme } from "../../theme/definitions/tokens";
import type { IconName } from "../icon/Icon";

export interface ToastContract {
  container: {
    backgroundColor: string;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  icon: {
    name: IconName;
    color: string;
  };
}

export function defaultToastStyles(t: Theme): Record<string, ToastContract> {
  const { spacing, typography, radii } = t;
  const p = t.palette;

  const base = {
    container: {
      borderRadius: radii.md,
      borderWidth: 1,
    },
    text: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },
  };

  return {
    info: {
      ...base,
      container: { ...base.container, backgroundColor: p.surfaceStrong, borderColor: p.border },
      text: { ...base.text, color: p.textPrimary },
      icon: { name: "info", color: p.info },
    },
    success: {
      ...base,
      container: { ...base.container, backgroundColor: p.surfaceStrong, borderColor: p.success },
      text: { ...base.text, color: p.textPrimary },
      icon: { name: "check-circle", color: p.success },
    },
    warning: {
      ...base,
      container: { ...base.container, backgroundColor: p.surfaceStrong, borderColor: p.warning },
      text: { ...base.text, color: p.textPrimary },
      icon: { name: "bell", color: p.warning },
    },
    error: {
      ...base,
      container: { ...base.container, backgroundColor: p.surfaceStrong, borderColor: p.error },
      text: { ...base.text, color: p.textPrimary },
      icon: { name: "x", color: p.error },
    },
  } satisfies Record<string, ToastContract>;
}

export const toastPadding = (t: Theme) => ({
  paddingVertical: t.spacing.sm,
  paddingHorizontal: t.spacing.md,
  gap: t.spacing.sm,
});
