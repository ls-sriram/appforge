import type { ThemeDefinition } from "../theme/contracts";
import { tokens } from "../theme/defaults";

export type LayoutProfileName = "compact" | "comfortable" | "spacious";

/**
 * Layout contract — density-driven spatial system.
 *
 * AppForge defines the field names and the platform default realizations.
 * Applications may construct their own realized profiles above UiRuntime, but
 * the semantic field names remain stable.
 *
 * Primitives and feature code read the active layout via `useLayout()`.
 * The active layout is set by `LayoutProvider` in the React tree.
 */
export interface LayoutContract {
  controlHeight: number;
  rowHeight: number;
  rowPadding: number;
  cellGap: number;

  panelPadding: number;
  sectionGap: number;
  itemGap: number;

  iconSize: number;
  fontSize: number;
  labelSize: number;
}

export interface LayoutFieldDefinition {
  description: string;
  primitives: readonly string[];
  composition: readonly string[];
}

export const layoutContractDefinition: Record<keyof LayoutContract, LayoutFieldDefinition> = {
  controlHeight: {
    description: "Minimum control dimension for density-sensitive controls.",
    primitives: [],
    composition: [],
  },
  rowHeight: {
    description: "Minimum row block dimension for row-oriented data displays.",
    primitives: ["Table"],
    composition: [],
  },
  rowPadding: {
    description: "Interior vertical padding for row-oriented data displays.",
    primitives: ["Table"],
    composition: [],
  },
  cellGap: {
    description: "Gap between cells within row-oriented data displays.",
    primitives: ["Table"],
    composition: [],
  },
  panelPadding: {
    description: "Outer padding role for panel-like containers.",
    primitives: [],
    composition: ["Feature composition via useLayout()"],
  },
  sectionGap: {
    description: "Vertical gap role between major sections.",
    primitives: [],
    composition: ["Feature composition via useLayout()"],
  },
  itemGap: {
    description: "Local gap role between adjacent items within a section.",
    primitives: [],
    composition: ["Feature composition via useLayout()"],
  },
  iconSize: {
    description: "Resolved icon dimension role for icon-bearing UI in the active density profile.",
    primitives: [],
    composition: [],
  },
  fontSize: {
    description: "Resolved body text size role for density-sensitive composition.",
    primitives: [],
    composition: ["Feature composition via useLayout()"],
  },
  labelSize: {
    description: "Resolved label text size role for density-sensitive composition.",
    primitives: [],
    composition: ["Feature composition via useLayout()"],
  },
};

export function createPlatformLayouts(t: ThemeDefinition): Record<LayoutProfileName, LayoutContract> {
  const { spacing } = t;
  return {
    compact: {
      controlHeight: 28,
      rowHeight: 32,
      rowPadding: spacing.xs,
      cellGap: spacing.sm,
      panelPadding: spacing.xs,
      sectionGap: spacing.sm + 2,
      itemGap: spacing.xs,
      iconSize: 14,
      fontSize: 13,
      labelSize: 11,
    },
    comfortable: {
      controlHeight: 36,
      rowHeight: 40,
      rowPadding: spacing.sm,
      cellGap: spacing.sm,
      panelPadding: spacing.md,
      sectionGap: spacing.lg - 2,
      itemGap: spacing.sm,
      iconSize: 16,
      fontSize: 15,
      labelSize: 13,
    },
    spacious: {
      controlHeight: 48,
      rowHeight: 56,
      rowPadding: spacing.md,
      cellGap: spacing.md,
      panelPadding: spacing.lg + 2,
      sectionGap: spacing.xl,
      itemGap: spacing.md,
      iconSize: 20,
      fontSize: 18,
      labelSize: 15,
    },
  };
}

export const platformLayoutDefaults = createPlatformLayouts(tokens);
