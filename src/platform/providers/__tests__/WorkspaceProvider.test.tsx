import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import {
  WorkspaceProvider,
  useWorkspaceActions,
  useWorkspaceContext,
  useWorkspaceState,
} from "../WorkspaceProvider";

const initialTabs = [
  { id: "overview", kind: "doc" as const, title: "Overview", payload: { section: 1 } },
  { id: "activity", kind: "doc" as const, title: "Activity", payload: { section: 2 } },
];

describe("WorkspaceProvider", () => {
  it("exposes state snapshots and actions", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WorkspaceProvider initialActiveTabId="overview" initialTabs={initialTabs}>
        {children}
      </WorkspaceProvider>
    );

    const { result } = renderHook(() => ({
      workspace: useWorkspaceContext<typeof initialTabs[number]["payload"], "doc">(),
      state: useWorkspaceState<typeof initialTabs[number]["payload"], "doc">(),
      actions: useWorkspaceActions<typeof initialTabs[number]["payload"], "doc">(),
    }), { wrapper });

    expect(result.current.state.activeTabId).toBe("overview");

    act(() => {
      result.current.actions.openTab({
        id: "settings",
        kind: "doc",
        title: "Settings",
        payload: { section: 3 },
      });
    });

    expect(result.current.workspace.state.tabs.map((tab) => tab.id)).toEqual([
      "overview",
      "activity",
      "settings",
    ]);
    expect(result.current.workspace.controller.getActiveTab()?.id).toBe("settings");
  });

  it("keeps multiple provider instances isolated", () => {
    const firstWrapper = ({ children }: { children: React.ReactNode }) => (
      <WorkspaceProvider initialActiveTabId="overview" initialTabs={initialTabs}>
        {children}
      </WorkspaceProvider>
    );
    const secondWrapper = ({ children }: { children: React.ReactNode }) => (
      <WorkspaceProvider initialActiveTabId="activity" initialTabs={initialTabs}>
        {children}
      </WorkspaceProvider>
    );

    const first = renderHook(() => useWorkspaceActions<typeof initialTabs[number]["payload"], "doc">(), {
      wrapper: firstWrapper,
    });
    const second = renderHook(() => useWorkspaceState<typeof initialTabs[number]["payload"], "doc">(), {
      wrapper: secondWrapper,
    });

    act(() => {
      first.result.current.closeAll();
    });

    expect(first.result.current.getActiveTab()).toBeNull();
    expect(second.result.current.activeTabId).toBe("activity");
    expect(second.result.current.tabs.map((tab) => tab.id)).toEqual(["overview", "activity"]);
  });

  it("observes state changes", () => {
    const onStateChange = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WorkspaceProvider initialActiveTabId="overview" initialTabs={initialTabs} onStateChange={onStateChange}>
        {children}
      </WorkspaceProvider>
    );

    const { result } = renderHook(() => useWorkspaceActions<typeof initialTabs[number]["payload"], "doc">(), {
      wrapper,
    });

    act(() => {
      result.current.activateTab("activity");
    });

    expect(onStateChange).toHaveBeenLastCalledWith({
      tabs: initialTabs,
      activeTabId: "activity",
    });
  });
});
