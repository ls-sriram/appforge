import type { ThemeDefinition } from "./contracts";
import type { LayoutContract } from "../contracts";

const CONTROL_H = { sm: 36, md: 54 } as const;

export function createLayouts(t: ThemeDefinition): Record<string, LayoutContract> {
  const { spacing } = t;
  return {
    compact: {
      controlHeight: CONTROL_H.sm - 8,
      rowHeight: CONTROL_H.sm - 4,
      rowPadding: spacing.xs,
      cellGap: spacing.sm,
      panelPadding: spacing.xs,
      sectionGap: spacing.sm + 2,
      itemGap: spacing.xs,
      iconSize: 14,
    },
    comfortable: {
      controlHeight: CONTROL_H.sm,
      rowHeight: CONTROL_H.sm + 4,
      rowPadding: spacing.sm,
      cellGap: spacing.sm,
      panelPadding: spacing.md,
      sectionGap: spacing.lg - 2,
      itemGap: spacing.sm,
      iconSize: 16,
    },
    spacious: {
      controlHeight: CONTROL_H.sm + 12,
      rowHeight: CONTROL_H.md + 2,
      rowPadding: spacing.md,
      cellGap: spacing.md,
      panelPadding: spacing.lg + 2,
      sectionGap: spacing.xl,
      itemGap: spacing.md,
      iconSize: 20,
    },
  };
}
