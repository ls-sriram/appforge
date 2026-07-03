import React from "react";
import {
  activateWorkspaceTab,
  closeAllWorkspaceTabs,
  closeOtherWorkspaceTabs,
  closeWorkspaceTab,
  createWorkspaceState,
  getActiveWorkspaceTab,
  moveWorkspaceTab,
  openWorkspaceTab,
  replaceWorkspaceTab,
  updateWorkspaceTab,
} from "../workspace";
import type {
  WorkspaceController,
  WorkspaceState,
  WorkspaceTabPatch,
  WorkspaceTabState,
} from "../workspace";

interface WorkspaceContextValue<TPayload = unknown, TKind extends string = string> {
  state: WorkspaceState<TPayload, TKind>;
  controller: WorkspaceController<TPayload, TKind>;
}

const WorkspaceContext = React.createContext<WorkspaceContextValue<any, any> | null>(null);

export interface WorkspaceProviderProps<TPayload = unknown, TKind extends string = string> {
  children: React.ReactNode;
  initialTabs?: WorkspaceTabState<TPayload, TKind>[];
  initialActiveTabId?: string | null;
  onStateChange?: (state: WorkspaceState<TPayload, TKind>) => void;
}

export function WorkspaceProvider<TPayload = unknown, TKind extends string = string>({
  children,
  initialTabs = [],
  initialActiveTabId,
  onStateChange,
}: WorkspaceProviderProps<TPayload, TKind>) {
  const initialState = React.useMemo(
    () => createWorkspaceState(initialTabs, initialActiveTabId),
    [initialActiveTabId, initialTabs],
  );
  const [state, setState] = React.useState<WorkspaceState<TPayload, TKind>>(initialState);

  React.useEffect(() => {
    onStateChange?.(state);
  }, [onStateChange, state]);

  const controller = React.useMemo<WorkspaceController<TPayload, TKind>>(() => ({
    openTab: (tab) => {
      setState((current) => openWorkspaceTab(current, tab));
    },
    activateTab: (tabId) => {
      setState((current) => activateWorkspaceTab(current, tabId));
    },
    closeTab: (tabId) => {
      setState((current) => closeWorkspaceTab(current, tabId));
    },
    closeOthers: (tabId) => {
      setState((current) => closeOtherWorkspaceTabs(current, tabId));
    },
    closeAll: () => {
      setState(() => closeAllWorkspaceTabs<TPayload, TKind>());
    },
    moveTab: (tabId, direction) => {
      setState((current) => moveWorkspaceTab(current, tabId, direction));
    },
    replaceTab: (tabId, tab) => {
      setState((current) => replaceWorkspaceTab(current, tabId, tab));
    },
    updateTab: (tabId, patch: WorkspaceTabPatch<TPayload, TKind>) => {
      setState((current) => updateWorkspaceTab(current, tabId, patch));
    },
    resetWorkspace: () => {
      setState(initialState);
    },
    getActiveTab: () => getActiveWorkspaceTab(state),
  }), [initialState, state]);

  const value = React.useMemo<WorkspaceContextValue<TPayload, TKind>>(
    () => ({ state, controller }),
    [controller, state],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext<TPayload = unknown, TKind extends string = string>(): WorkspaceContextValue<TPayload, TKind> {
  const ctx = React.useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspaceContext() must be used inside WorkspaceProvider");
  }

  return ctx as WorkspaceContextValue<TPayload, TKind>;
}

export function useWorkspaceState<TPayload = unknown, TKind extends string = string>(): WorkspaceState<TPayload, TKind> {
  return useWorkspaceContext<TPayload, TKind>().state;
}

export function useWorkspaceActions<TPayload = unknown, TKind extends string = string>(): WorkspaceController<TPayload, TKind> {
  return useWorkspaceContext<TPayload, TKind>().controller;
}
