import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H } from "../../theme/definitions/style-tokens";

export interface DockSplitterContract {
  container: {
    thickness: number;
    minHitSize: number;
    backgroundColor: string;
    activeBackgroundColor: string;
    disabledOpacity: number;
  };
  grip: {
    length: number;
    thickness: number;
    borderRadius: number;
    color: string;
  };
}

export function defaultDockSplitterStyles(t: Theme): Record<string, DockSplitterContract> {
  const { radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
    default: {
      container: {
        thickness: 4,
        minHitSize: CONTROL_H.sm,
        backgroundColor: p.surfaceAlt,
        activeBackgroundColor: p.surfaceStrong,
        disabledOpacity: 0.4,
      },
      grip: {
        length: 24,
        thickness: 4,
        borderRadius: pill,
        color: p.border,
      },
    },
  };
}
