import type { Theme } from "../../theme/definitions/tokens";

export interface SheetContract {
  scrim: {
    backgroundColor: string;
  };
  panel: {
    backgroundColor: string;
    borderTopLeftRadius: number;
    borderTopRightRadius: number;
    paddingHorizontal: number;
    paddingTop: number;
  };
  handle: {
    backgroundColor: string;
  };
}

export function defaultSheetStyles(t: Theme): SheetContract {
  const p = t.palette;
  return {
    scrim: {
      backgroundColor: p.scrim,
    },
    panel: {
      backgroundColor: p.surfaceStrong,
      borderTopLeftRadius: t.radii.lg,
      borderTopRightRadius: t.radii.lg,
      paddingHorizontal: t.spacing.md,
      paddingTop: t.spacing.sm,
    },
    handle: {
      backgroundColor: p.border,
    },
  };
}
