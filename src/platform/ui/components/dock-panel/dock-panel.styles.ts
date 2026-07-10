import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H, GAP } from "../../theme/definitions/style-tokens";

export interface DockPanelContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };
  header: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };
  title: {
    color: string;
  };
  content: {
    backgroundColor: string;
  };
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
  itemButton: {
    minWidth: number;
    minHeight: number;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    gap: number;
    activeBackgroundColor: string;
    inactiveBackgroundColor: string;
    disabledOpacity: number;
  };
  itemIcon: {
    size: number;
    selectedColor: string;
    unselectedColor: string;
    disabledColor: string;
  };
  rail: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    gap: number;
    padding: number;
    collapsedWidth: number;
  };
  menuButton: {
    width: number;
    height: number;
  };
  splitterGrip: {
    size: number;
    thickness: number;
    color: string;
  };
  layout: {
    inlineActionsMarginRight: number;
    contentGap: number;
  };
  // Shared across every Pressable-composing control in this panel
  // (action buttons, item buttons, menu trigger, resize handle) rather
  // than duplicated per-bucket — same token value everywhere.
  focus: {
    borderWidth: number;
    borderColor: string;
  };
}

export function defaultDockPanelStyles(t: Theme): Record<string, DockPanelContract> {
  const { spacing, radii } = t;
  const p = t.palette;

  return {
    default: {
      container: {
        backgroundColor: p.surface,
        borderColor: p.border,
        borderWidth: 1,
      },
      header: {
        minHeight: CONTROL_H.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
      },
      title: {
        color: p.textPrimary,
      },
      content: {
        backgroundColor: p.surface,
      },
      actionButton: {
        minWidth: 28,
        minHeight: 28,
        borderRadius: radii.pill,
        disabledOpacity: 0.4,
      },
      actionIcon: {
        size: 14,
        color: p.textSecondary,
        disabledColor: p.textMuted,
      },
      itemButton: {
        minWidth: CONTROL_H.sm,
        minHeight: CONTROL_H.sm,
        borderRadius: radii.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        gap: GAP.tight,
        activeBackgroundColor: p.primaryMuted,
        inactiveBackgroundColor: p.surface,
        disabledOpacity: 0.4,
      },
      itemIcon: {
        size: 16,
        selectedColor: p.primary,
        unselectedColor: p.textSecondary,
        disabledColor: p.textMuted,
      },
      rail: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        gap: GAP.tight,
        padding: spacing.xs,
        collapsedWidth: 64,
      },
      menuButton: {
        width: CONTROL_H.md,
        height: CONTROL_H.md,
      },
      splitterGrip: {
        size: CONTROL_H.sm,
        thickness: 4,
        color: p.border,
      },
      layout: {
        inlineActionsMarginRight: GAP.tight,
        contentGap: GAP.tight,
      },
      focus: {
        borderWidth: 2,
        borderColor: p.borderFocus,
      },
    },
  };
}
