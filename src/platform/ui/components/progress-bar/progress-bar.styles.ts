import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";
import { TRACK_H } from "../../theme/definitions/style-tokens";

export interface ProgressBarContract {
  track: {
    color: string;
    height: number;
    borderRadius: number;
  };
  fill: {
    color: string;
  };
  interaction?: InteractionContract;
}

export function defaultProgressBarStyles(t: Theme): Record<string, ProgressBarContract> {
  const { radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const base = {
    track: {
      color: p.surfaceAlt,
      height: TRACK_H,
      borderRadius: pill,
    },
  } satisfies Partial<ProgressBarContract>;

  return {
    primary: { ...base, fill: { color: p.primary } },
    success: { ...base, fill: { color: p.success } },
    warning: { ...base, fill: { color: p.warning } },
    danger: { ...base, fill: { color: p.error } },
  };
}
