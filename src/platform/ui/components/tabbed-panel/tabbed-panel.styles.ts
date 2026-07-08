import type { Theme } from "../../theme/definitions/tokens";
import { GAP } from "../../theme/definitions/style-tokens";

export interface TabbedPanelContract {
  actionButton: {
    minWidth: number;
    minHeight: number;
    borderRadius: number;
    disabledOpacity: number;
  };
  actionIcon: {
    size: number;
    color: string;
    disabledColor: string;
  };
  layout: {
    inlineActionsMarginRight: number;
  };
}

export function defaultTabbedPanelStyles(t: Theme): Record<string, TabbedPanelContract> {
  const { radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
    default: {
      actionButton: {
        minWidth: 28,
        minHeight: 28,
        borderRadius: pill,
        disabledOpacity: 0.4,
      },
      actionIcon: {
        size: 14,
        color: p.textSecondary,
        disabledColor: p.textMuted,
      },
      layout: {
        inlineActionsMarginRight: GAP.tight,
      },
    },
  };
}
