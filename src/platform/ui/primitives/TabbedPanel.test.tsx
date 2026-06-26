import fs from "fs";
import path from "path";
import React from "react";
import { Text } from "react-native";
import TestRenderer, { act } from "react-test-renderer";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { createUi } from "../viz";
import { TabbedPanel } from "./TabbedPanel";

jest.mock("./Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Body: ({ children }: { children?: React.ReactNode }) => React.createElement(Text, null, children),
  };
});

jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children }: { children?: React.ReactNode }) => React.createElement(View, null, children),
    Path: () => null,
    Circle: () => null,
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function renderTabbedPanel(element: React.ReactElement) {
  let tree: TestRenderer.ReactTestRenderer | null = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as TestRenderer.ReactTestRenderer;
}

function findInteractiveByTestId(tree: TestRenderer.ReactTestRenderer, testID: string) {
  return tree.root.findAll(
    (node) => node.props.testID === testID && typeof node.props.onPress === "function",
  );
}

function findHostText(tree: TestRenderer.ReactTestRenderer, text: string) {
  return tree.root.findAll(
    (node) => node.type === "Text" && node.props.children === text,
  );
}

const baseTabs = [
  {
    id: "overview",
    label: "Overview",
    icon: "home" as const,
    content: <Text>Overview panel</Text>,
  },
  {
    id: "activity",
    label: "Activity",
    icon: "activity" as const,
    content: <Text>Activity panel</Text>,
  },
  {
    id: "settings",
    label: "Settings",
    content: <Text>Settings panel</Text>,
  },
];

describe("TabbedPanel", () => {
  it("renders the tab strip and only the active tab content", () => {
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel activeTabId="activity" onActiveTabChange={() => {}} tabs={baseTabs} ui={createUi("panel")} />
      </Wrapper>,
    );

    expect(findInteractiveByTestId(tree, "panel.tabs-tab-overview")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "panel.tabs-tab-activity")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "panel.tabs-tab-settings")).toHaveLength(1);
    expect(findHostText(tree, "Activity panel")).toHaveLength(1);
    expect(findHostText(tree, "Overview panel")).toHaveLength(0);
  });

  it("emits the selected tab id", () => {
    const onActiveTabChange = jest.fn();
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel activeTabId="overview" onActiveTabChange={onActiveTabChange} tabs={baseTabs} ui={createUi("panel")} />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "panel.tabs-tab-settings")[0].props.onPress();
    });

    expect(onActiveTabChange).toHaveBeenCalledWith("settings");
  });

  it("renders close control when allowed and closes the active tab", () => {
    const onCloseTab = jest.fn();
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel
          activeTabId="activity"
          onActiveTabChange={() => {}}
          onCloseTab={onCloseTab}
          tabs={baseTabs}
          ui={createUi("panel")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "panel.close")[0].props.onPress();
    });

    expect(onCloseTab).toHaveBeenCalledWith("activity");
  });

  it("renders move controls and emits finite left and right moves", () => {
    const onMoveTab = jest.fn();
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel
          activeTabId="activity"
          onActiveTabChange={() => {}}
          onMoveTab={onMoveTab}
          tabs={baseTabs}
          ui={createUi("panel")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "panel.move-left")[0].props.onPress();
      findInteractiveByTestId(tree, "panel.move-right")[0].props.onPress();
    });

    expect(onMoveTab).toHaveBeenNthCalledWith(1, "activity", "left");
    expect(onMoveTab).toHaveBeenNthCalledWith(2, "activity", "right");
  });

  it("disables boundary move controls for the active tab", () => {
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel
          activeTabId="overview"
          onActiveTabChange={() => {}}
          onMoveTab={() => {}}
          tabs={baseTabs}
          ui={createUi("panel")}
        />
      </Wrapper>,
    );

    expect(findInteractiveByTestId(tree, "panel.move-left")[0].props.disabled).toBe(true);
    expect(findInteractiveByTestId(tree, "panel.move-right")[0].props.disabled).toBe(false);
  });

  it("keeps disabled tabs visible but non-interactive", () => {
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel
          activeTabId="overview"
          onActiveTabChange={() => {}}
          tabs={[baseTabs[0], { ...baseTabs[1], disabled: true }, baseTabs[2]]}
          ui={createUi("panel")}
        />
      </Wrapper>,
    );

    expect(findInteractiveByTestId(tree, "panel.tabs-tab-activity")[0].props.disabled).toBe(true);
  });

  it("renders caller actions alongside built-in controls", () => {
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel
          actions={<Text>Pin</Text>}
          activeTabId="activity"
          onActiveTabChange={() => {}}
          onCloseTab={() => {}}
          tabs={baseTabs}
          ui={createUi("panel")}
        />
      </Wrapper>,
    );

    expect(findHostText(tree, "Pin")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "panel.close").length).toBeGreaterThan(0);
  });

  it("renders the empty state when there are no tabs", () => {
    const tree = renderTabbedPanel(
      <Wrapper>
        <TabbedPanel
          activeTabId={null}
          emptyState={<Text>No panels</Text>}
          onActiveTabChange={() => {}}
          tabs={[]}
          ui={createUi("panel")}
        />
      </Wrapper>,
    );

    expect(findHostText(tree, "No panels")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "panel.tabs-tab-overview")).toHaveLength(0);
  });

  it("is exported from the primitive surface", () => {
    const barrelSource = fs.readFileSync(path.join(__dirname, "index.ts"), "utf8");

    expect(barrelSource).toContain("TabbedPanel");
    expect(barrelSource).toContain("TabbedPanelProps");
  });
});
