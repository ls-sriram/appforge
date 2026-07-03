export type WorkspaceMoveDirection = "left" | "right";

export interface WorkspaceTabState<TPayload = unknown, TKind extends string = string> {
  id: string;
  kind: TKind;
  title: string;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  movable?: boolean;
  dirty?: boolean;
  payload: TPayload;
}

export interface WorkspaceState<TPayload = unknown, TKind extends string = string> {
  tabs: WorkspaceTabState<TPayload, TKind>[];
  activeTabId: string | null;
}

export type WorkspaceTabPatch<TPayload = unknown, TKind extends string = string> =
  Partial<Omit<WorkspaceTabState<TPayload, TKind>, "id">>;

export interface WorkspaceController<TPayload = unknown, TKind extends string = string> {
  openTab: (tab: WorkspaceTabState<TPayload, TKind>) => void;
  activateTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  closeOthers: (tabId: string) => void;
  closeAll: () => void;
  moveTab: (tabId: string, direction: WorkspaceMoveDirection) => void;
  replaceTab: (tabId: string, tab: WorkspaceTabState<TPayload, TKind>) => void;
  updateTab: (tabId: string, patch: WorkspaceTabPatch<TPayload, TKind>) => void;
  resetWorkspace: () => void;
  getActiveTab: () => WorkspaceTabState<TPayload, TKind> | null;
}
