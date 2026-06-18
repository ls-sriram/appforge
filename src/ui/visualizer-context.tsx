import React from "react";
import type { UiNodeProps } from "../apps/appforge-site/features/ui-visualizer/domain/ui-document.types";

export interface VisualizerContextValue {
  /** Whether the visualizer barrel is active. False in production. */
  active: boolean;
  selectedNodeId: string | undefined;
  onSelect: (nodeId: string) => void;
  /** Per-node prop overrides coming from the inspector. */
  propOverrides: Record<string, Partial<UiNodeProps>>;
}

const DEFAULT: VisualizerContextValue = {
  active: false,
  selectedNodeId: undefined,
  onSelect: () => {},
  propOverrides: {},
};

export const VisualizerContext =
  React.createContext<VisualizerContextValue>(DEFAULT);

export function useVisualizerContext() {
  return React.useContext(VisualizerContext);
}

export function VisualizerProvider({
  selectedNodeId,
  onSelect,
  propOverrides,
  children,
}: {
  selectedNodeId: string | undefined;
  onSelect: (nodeId: string) => void;
  propOverrides: Record<string, Partial<UiNodeProps>>;
  children: React.ReactNode;
}) {
  const value = React.useMemo<VisualizerContextValue>(
    () => ({ active: true, selectedNodeId, onSelect, propOverrides }),
    [selectedNodeId, onSelect, propOverrides],
  );
  return (
    <VisualizerContext.Provider value={value}>
      {children}
    </VisualizerContext.Provider>
  );
}
