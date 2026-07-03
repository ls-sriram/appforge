export type {
  WorkspaceController,
  WorkspaceMoveDirection,
  WorkspaceState,
  WorkspaceTabPatch,
  WorkspaceTabState,
} from "./types";
export {
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
} from "./state";
