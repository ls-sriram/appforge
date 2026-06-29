export type LayoutProfileName = "compact" | "comfortable" | "spacious";

export type LayoutLibrary = Record<LayoutProfileName, LayoutContract>;

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
