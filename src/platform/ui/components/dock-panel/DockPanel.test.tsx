import fs from "fs";
import path from "path";
import React from "react";
import { Text } from "react-native";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { createUi } from "../../viz";
import { DockPanel } from "./DockPanel";

const tabsContract = defaultContracts.tabs!["default"];
const dockPanelContract = defaultContracts.dockPanel!["default"];

jest.mock("react-native", () => {
  const React = require("react");
  const makeComponent = (name: string) => ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(name, props, children);

  return {
    View: makeComponent("View"),
    Text: makeComponent("Text"),
    Pressable: makeComponent("Pressable"),
    ScrollView: makeComponent("ScrollView"),
    useWindowDimensions: () => ({ width: 1280, height: 800 }),
  };
});

jest.mock("../text/Text", () => {
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
    Rect: () => null,
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function renderDockPanel(element: React.ReactElement) {
  let tree: any = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as any;
}

function findInteractiveByTestId(tree: any, testID: string) {
  return tree.root.findAll(
    (node: any) => node.type === "Pressable" && node.props.testID === testID && typeof node.props.onPress === "function",
  );
}

function findHostText(tree: any, text: string) {
  return tree.root.findAll(
    (node: any) => node.type === "Text" && node.props.children === text,
  );
}

const baseItems = [
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
    icon: "settings" as const,
    content: <Text>Settings panel</Text>,
  },
];

describe("DockPanel", () => {
  it("renders plain pane mode from children without items", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          dockPanelContract={dockPanelContract}
          title="Inspector"
          icon="settings"
          onClose={() => {}}
          canClose
          showHeader
          ui={createUi("dock")}
        >
          <Text>Inspector body</Text>
        </DockPanel>
      </Wrapper>,
    );

    expect(findHostText(tree, "Inspector")).toHaveLength(1);
    expect(findHostText(tree, "Inspector body")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "dock.header-close")).toHaveLength(1);
  });

  it("renders dock items and only the active item content", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          dockPanelContract={dockPanelContract}
          activeItemId="activity"
          items={baseItems}
          onActiveItemChange={() => {}}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    expect(findInteractiveByTestId(tree, "dock.item-overview")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "dock.item-activity")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "dock.item-settings")).toHaveLength(1);
    expect(findHostText(tree, "Activity panel")).toHaveLength(1);
    expect(findHostText(tree, "Overview panel")).toHaveLength(0);
  });

  it("emits the selected item id", () => {
    const onActiveItemChange = jest.fn();
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          dockPanelContract={dockPanelContract}
          activeItemId="overview"
          items={baseItems}
          onActiveItemChange={onActiveItemChange}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "dock.item-settings")[0].props.onPress();
    });

    expect(onActiveItemChange).toHaveBeenCalledWith("settings");
  });

  it("renders icon-only rail mode without labels", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          displayMode="icon-rail"
          dockPanelContract={dockPanelContract}
          activeItemId="overview"
          items={baseItems}
          onActiveItemChange={() => {}}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    expect(findHostText(tree, "Overview")).toHaveLength(0);
    expect(findInteractiveByTestId(tree, "dock.item-overview")).toHaveLength(1);
  });

  it("renders a hamburger-only trigger in menu mode", () => {
    const onMenuPress = jest.fn();
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          displayMode="menu-trigger"
          dockPanelContract={dockPanelContract}
          activeItemId="overview"
          items={baseItems}
          onActiveItemChange={() => {}}
          onMenuPress={onMenuPress}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "dock.menu")[0].props.onPress();
    });

    expect(findInteractiveByTestId(tree, "dock.item-overview")).toHaveLength(0);
    expect(onMenuPress).toHaveBeenCalled();
  });

  it("renders close and move controls when allowed", () => {
    const onCloseItem = jest.fn();
    const onMoveItem = jest.fn();
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          dockPanelContract={dockPanelContract}
          activeItemId="activity"
          items={baseItems}
          onActiveItemChange={() => {}}
          onCloseItem={onCloseItem}
          onMoveItem={onMoveItem}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "dock.move-backward")[0].props.onPress();
      findInteractiveByTestId(tree, "dock.move-forward")[0].props.onPress();
      findInteractiveByTestId(tree, "dock.close")[0].props.onPress();
    });

    expect(onMoveItem).toHaveBeenNthCalledWith(1, "activity", "backward");
    expect(onMoveItem).toHaveBeenNthCalledWith(2, "activity", "forward");
    expect(onCloseItem).toHaveBeenCalledWith("activity");
  });

  it("emits collapse and expand display mode changes", () => {
    const onDisplayModeChange = jest.fn();
    const onCollapsedChange = jest.fn();
    const expanded = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          canCollapse
          dockPanelContract={dockPanelContract}
          activeItemId="overview"
          items={baseItems}
          onActiveItemChange={() => {}}
          onDisplayModeChange={onDisplayModeChange}
          onCollapsedChange={onCollapsedChange}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(expanded, "dock.header-collapse")[0].props.onPress();
    });

    const collapsed = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          canCollapse
          canIconCollapse
          collapsed
          dockPanelContract={dockPanelContract}
          activeItemId="overview"
          items={baseItems}
          onActiveItemChange={() => {}}
          onDisplayModeChange={onDisplayModeChange}
          onCollapsedChange={onCollapsedChange}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(collapsed, "dock.expand")[0].props.onPress();
    });

    expect(onCollapsedChange).toHaveBeenNthCalledWith(1, true);
    expect(onDisplayModeChange).toHaveBeenNthCalledWith(1, "expanded");
    expect(onCollapsedChange).toHaveBeenNthCalledWith(2, false);
    expect(onDisplayModeChange).toHaveBeenNthCalledWith(2, "expanded");
  });

  it("renders null when visible is false", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          dockPanelContract={dockPanelContract}
          visible={false}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    expect(tree.toJSON()).toBeNull();
  });

  it("renders collapsed icon rail when canIconCollapse is true", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          canCollapse
          canIconCollapse
          collapsed
          dockPanelContract={dockPanelContract}
          activeItemId="overview"
          items={baseItems}
          onActiveItemChange={() => {}}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    expect(findHostText(tree, "Overview")).toHaveLength(0);
    expect(findInteractiveByTestId(tree, "dock.expand")).toHaveLength(1);
  });

  it("renders a compact collapsed rail for plain pane mode", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          canClose
          canCollapse
          canIconCollapse
          collapsed
          dockPanelContract={dockPanelContract}
          icon="settings"
          onClose={() => {}}
          onVisibleChange={() => {}}
          title="Inspector"
          ui={createUi("dock")}
        >
          <Text>Inspector body</Text>
        </DockPanel>
      </Wrapper>,
    );

    expect(findInteractiveByTestId(tree, "dock.expand")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "dock.header-close")).toHaveLength(1);
    expect(findHostText(tree, "Inspector body")).toHaveLength(0);
    expect(tree.root.findAll((node: any) => node.props.testID === "dock.content-frame")).toHaveLength(0);
  });

  it("does not icon-collapse when canIconCollapse is false", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          collapsed
          minSize={280}
          dockPanelContract={dockPanelContract}
          title="Files"
          ui={createUi("dock")}
        >
          <Text>File tree</Text>
        </DockPanel>
      </Wrapper>,
    );

    expect(findHostText(tree, "Files")).toHaveLength(1);
    expect(findHostText(tree, "File tree")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "dock.expand")).toHaveLength(0);
  });

  it("emits close and visibility changes from the header", () => {
    const onClose = jest.fn();
    const onVisibleChange = jest.fn();
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          canClose
          dockPanelContract={dockPanelContract}
          onClose={onClose}
          onVisibleChange={onVisibleChange}
          title="Console"
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "dock.header-close")[0].props.onPress();
    });

    expect(onClose).toHaveBeenCalled();
    expect(onVisibleChange).toHaveBeenCalledWith(false);
  });

  it("emits resize callbacks when resize is enabled", () => {
    const onResizeStart = jest.fn();
    const onResize = jest.fn();
    const onResizeEnd = jest.fn();
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          canResize
          collapseThreshold={220}
          dockPanelContract={dockPanelContract}
          minSize={180}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
          onResizeStart={onResizeStart}
          size={260}
          title="Outline"
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "dock.resize")[0].props.onPress();
    });

    expect(onResizeStart).toHaveBeenCalled();
    expect(onResize).toHaveBeenCalledWith(260);
    expect(onResizeEnd).toHaveBeenCalledWith(260);
  });

  it("renders the empty state when there are no items", () => {
    const tree = renderDockPanel(
      <Wrapper>
        <DockPanel
          tabsContract={tabsContract}
          dockPanelContract={dockPanelContract}
          activeItemId={null}
          emptyState={<Text>No panels</Text>}
          items={[]}
          onActiveItemChange={() => {}}
          ui={createUi("dock")}
        />
      </Wrapper>,
    );

    expect(findHostText(tree, "No panels")).toHaveLength(1);
    expect(findInteractiveByTestId(tree, "dock.item-overview")).toHaveLength(0);
  });

  it("is exported from the primitive surface", () => {
    const barrelSource = fs.readFileSync(path.join(__dirname, "index.ts"), "utf8");

    expect(barrelSource).toContain("DockPanel");
    expect(barrelSource).toContain("DockPanelProps");
  });
});
