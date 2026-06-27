/**
 * Layout contract — density-driven spatial system.
 *
 * AppForge defines the contract; applications provide the three presets.
 * Primitives and feature code read the active layout via useLayout().
 * The active layout is set by LayoutProvider in the React tree.
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
}
