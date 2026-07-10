import type { PressableContract } from "../pressable/pressable.styles";
import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H } from "../../theme/definitions/style-tokens";

// Covers both the toolbar-button and icon-button call sites the spec lists
// together (panel-header's icon square, nav-rail items, design-panel's
// HeaderAction glyphs, project-sidebar's icon-only actions) — same fixed
// square shape and behavior regardless of which name a call site reaches
// for, so one contract/component backs both exported names.
export interface IconButtonContract extends PressableContract {
  iconSize: number;
  iconColor: string;
  selectedIconColor?: string;
}

export function defaultIconButtonStyles(t: Theme): Record<string, IconButtonContract> {
  const p = t.palette;

  return {
    default: {
      frame: {
        backgroundColor: "transparent",
        borderRadius: t.radii.sm,
        borderWidth: 0,
        width: CONTROL_H.sm,
        height: CONTROL_H.sm,
      },
      iconSize: 16,
      iconColor: p.textSecondary,
      selectedIconColor: p.primary,
      interaction: {
        disabledOpacity: 0.4,
        pressed: { opacity: 0.75 },
        hover: { backgroundColor: p.surfaceAlt },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.primaryMuted, borderColor: p.primary },
      },
    },
  };
}
