import {
  activateWorkspaceTab,
  closeAllWorkspaceTabs,
  closeOtherWorkspaceTabs,
  closeWorkspaceTab,
  createWorkspaceState,
  moveWorkspaceTab,
  openWorkspaceTab,
  replaceWorkspaceTab,
  updateWorkspaceTab,
} from "./state";

const baseTabs = [
  { id: "overview", kind: "doc" as const, title: "Overview", payload: { section: 1 } },
  { id: "activity", kind: "doc" as const, title: "Activity", payload: { section: 2 } },
  { id: "settings", kind: "doc" as const, title: "Settings", payload: { section: 3 } },
];

describe("platform/workspace state", () => {
  it("opens a new tab and activates it", () => {
    const state = createWorkspaceState(baseTabs, "overview");
    const next = openWorkspaceTab(state, { id: "logs", kind: "doc", title: "Logs", payload: { section: 4 } });

    expect(next.tabs.map((tab) => tab.id)).toEqual(["overview", "activity", "settings", "logs"]);
    expect(next.activeTabId).toBe("logs");
  });

  it("opens an existing tab by replacing it and activating it", () => {
    const state = createWorkspaceState(baseTabs, "overview");
    const next = openWorkspaceTab(state, {
      id: "activity",
      kind: "doc",
      title: "Recent Activity",
      payload: { section: 22 },
    });

    expect(next.tabs).toHaveLength(3);
    expect(next.tabs[1].title).toBe("Recent Activity");
    expect(next.tabs[1].payload).toEqual({ section: 22 });
    expect(next.activeTabId).toBe("activity");
  });

  it("activates a known tab", () => {
    const state = createWorkspaceState(baseTabs, "overview");

    expect(activateWorkspaceTab(state, "settings").activeTabId).toBe("settings");
  });

  it("keeps the same active tab when closing an inactive tab", () => {
    const state = createWorkspaceState(baseTabs, "settings");
    const next = closeWorkspaceTab(state, "activity");

    expect(next.tabs.map((tab) => tab.id)).toEqual(["overview", "settings"]);
    expect(next.activeTabId).toBe("settings");
  });

  it("activates the left neighbor when closing the active tab", () => {
    const state = createWorkspaceState(baseTabs, "activity");
    const next = closeWorkspaceTab(state, "activity");

    expect(next.tabs.map((tab) => tab.id)).toEqual(["overview", "settings"]);
    expect(next.activeTabId).toBe("overview");
  });

  it("activates the first remaining tab when closing the first active tab", () => {
    const state = createWorkspaceState(baseTabs, "overview");
    const next = closeWorkspaceTab(state, "overview");

    expect(next.tabs.map((tab) => tab.id)).toEqual(["activity", "settings"]);
    expect(next.activeTabId).toBe("activity");
  });

  it("moves tabs left and right while preserving the active tab identity", () => {
    const state = createWorkspaceState(baseTabs, "activity");
    const movedLeft = moveWorkspaceTab(state, "activity", "left");
    const movedRight = moveWorkspaceTab(state, "activity", "right");

    expect(movedLeft.tabs.map((tab) => tab.id)).toEqual(["activity", "overview", "settings"]);
    expect(movedLeft.activeTabId).toBe("activity");
    expect(movedRight.tabs.map((tab) => tab.id)).toEqual(["overview", "settings", "activity"]);
    expect(movedRight.activeTabId).toBe("activity");
  });

  it("closes other tabs and preserves the selected tab", () => {
    const state = createWorkspaceState(baseTabs, "overview");
    const next = closeOtherWorkspaceTabs(state, "settings");

    expect(next.tabs.map((tab) => tab.id)).toEqual(["settings"]);
    expect(next.activeTabId).toBe("settings");
  });

  it("clears all tabs", () => {
    const next = closeAllWorkspaceTabs<typeof baseTabs[number]["payload"], "doc">();

    expect(next).toEqual({ tabs: [], activeTabId: null });
  });

  it("updates tab metadata without losing payload", () => {
    const state = createWorkspaceState(baseTabs, "overview");
    const next = updateWorkspaceTab(state, "overview", { title: "Summary", dirty: true });

    expect(next.tabs[0]).toMatchObject({
      id: "overview",
      title: "Summary",
      dirty: true,
      payload: { section: 1 },
    });
  });

  it("replaces an active tab and retargets the active id", () => {
    const state = createWorkspaceState(baseTabs, "activity");
    const next = replaceWorkspaceTab(state, "activity", {
      id: "activity-2",
      kind: "doc",
      title: "Activity 2",
      payload: { section: 20 },
    });

    expect(next.tabs.map((tab) => tab.id)).toEqual(["overview", "activity-2", "settings"]);
    expect(next.activeTabId).toBe("activity-2");
  });
});
