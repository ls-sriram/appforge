import type {
  WorkspaceMoveDirection,
  WorkspaceState,
  WorkspaceTabPatch,
  WorkspaceTabState,
} from "./types";

export function createWorkspaceState<TPayload, TKind extends string>(
  tabs: WorkspaceTabState<TPayload, TKind>[] = [],
  activeTabId?: string | null,
): WorkspaceState<TPayload, TKind> {
  if (tabs.length === 0) {
    return { tabs: [], activeTabId: null };
  }

  if (activeTabId && tabs.some((tab) => tab.id === activeTabId)) {
    return { tabs, activeTabId };
  }

  return { tabs, activeTabId: tabs[0].id };
}

export function getActiveWorkspaceTab<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
): WorkspaceTabState<TPayload, TKind> | null {
  return state.tabs.find((tab) => tab.id === state.activeTabId) ?? null;
}

export function openWorkspaceTab<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
  tab: WorkspaceTabState<TPayload, TKind>,
): WorkspaceState<TPayload, TKind> {
  const index = state.tabs.findIndex((candidate) => candidate.id === tab.id);
  if (index === -1) {
    return {
      tabs: [...state.tabs, tab],
      activeTabId: tab.id,
    };
  }

  const tabs = [...state.tabs];
  tabs[index] = tab;
  return {
    tabs,
    activeTabId: tab.id,
  };
}

export function activateWorkspaceTab<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
  tabId: string,
): WorkspaceState<TPayload, TKind> {
  if (!state.tabs.some((tab) => tab.id === tabId)) {
    return state;
  }

  if (state.activeTabId === tabId) {
    return state;
  }

  return {
    ...state,
    activeTabId: tabId,
  };
}

export function closeWorkspaceTab<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
  tabId: string,
): WorkspaceState<TPayload, TKind> {
  const index = state.tabs.findIndex((tab) => tab.id === tabId);
  if (index === -1) {
    return state;
  }

  const tabs = state.tabs.filter((tab) => tab.id !== tabId);
  if (tabs.length === 0) {
    return { tabs: [], activeTabId: null };
  }

  if (state.activeTabId !== tabId) {
    return { tabs, activeTabId: state.activeTabId };
  }

  const leftNeighbor = tabs[index - 1];
  return {
    tabs,
    activeTabId: leftNeighbor ? leftNeighbor.id : tabs[0].id,
  };
}

export function closeOtherWorkspaceTabs<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
  tabId: string,
): WorkspaceState<TPayload, TKind> {
  const tab = state.tabs.find((candidate) => candidate.id === tabId);
  if (!tab) {
    return state;
  }

  return {
    tabs: [tab],
    activeTabId: tab.id,
  };
}

export function closeAllWorkspaceTabs<TPayload, TKind extends string>(): WorkspaceState<TPayload, TKind> {
  return {
    tabs: [],
    activeTabId: null,
  };
}

export function moveWorkspaceTab<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
  tabId: string,
  direction: WorkspaceMoveDirection,
): WorkspaceState<TPayload, TKind> {
  const index = state.tabs.findIndex((tab) => tab.id === tabId);
  if (index === -1) {
    return state;
  }

  const nextIndex = direction === "left" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= state.tabs.length) {
    return state;
  }

  const tabs = [...state.tabs];
  const [tab] = tabs.splice(index, 1);
  tabs.splice(nextIndex, 0, tab);

  return {
    tabs,
    activeTabId: state.activeTabId,
  };
}

export function replaceWorkspaceTab<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
  tabId: string,
  replacement: WorkspaceTabState<TPayload, TKind>,
): WorkspaceState<TPayload, TKind> {
  const index = state.tabs.findIndex((tab) => tab.id === tabId);
  if (index === -1) {
    return openWorkspaceTab(state, replacement);
  }

  const tabs = [...state.tabs];
  tabs[index] = replacement;

  return {
    tabs,
    activeTabId: state.activeTabId === tabId ? replacement.id : state.activeTabId,
  };
}

export function updateWorkspaceTab<TPayload, TKind extends string>(
  state: WorkspaceState<TPayload, TKind>,
  tabId: string,
  patch: WorkspaceTabPatch<TPayload, TKind>,
): WorkspaceState<TPayload, TKind> {
  const index = state.tabs.findIndex((tab) => tab.id === tabId);
  if (index === -1) {
    return state;
  }

  const tabs = [...state.tabs];
  tabs[index] = {
    ...tabs[index],
    ...patch,
  };

  return {
    tabs,
    activeTabId: state.activeTabId,
  };
}
