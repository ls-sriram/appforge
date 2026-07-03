import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../theme/index";
import { ThemeProvider } from "../theme/ThemeProvider";
import { Tabs } from "./Tabs";

const tabsContract = defaultContracts.tabs!["default"];

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
    Rect: () => null,
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function renderTabs(element: React.ReactElement) {
  let tree: any = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as any;
}

function findTabNodes(tree: any) {
  return tree.root.findAll(
    (node: any) =>
      typeof node.props.testID === "string" &&
      node.props.testID.startsWith("tabs-tab-") &&
      typeof node.props.onPress === "function",
  );
}

beforeAll(() => {
  if (typeof window !== "undefined" && typeof window.dispatchEvent !== "function") {
    (window as typeof window & { dispatchEvent: () => boolean }).dispatchEvent = () => false;
  }
});

const options = [
  { label: "Overview", value: "overview", icon: "home" as const },
  { label: "Activity", value: "activity", icon: "activity" as const },
  { label: "Settings", value: "settings" as const },
];

describe("Tabs", () => {
  it("renders all tabs", () => {
    const tree = renderTabs(
      <Wrapper>
        <Tabs contract={tabsContract} options={options} value="overview" onValueChange={() => {}} testID="tabs" />
      </Wrapper>,
    );

    const tabs = findTabNodes(tree);

    expect(tabs).toHaveLength(3);
    expect(tabs.map((tab: any) => tab.props.testID)).toEqual([
      "tabs-tab-overview",
      "tabs-tab-activity",
      "tabs-tab-settings",
    ]);
  });

  it("marks the selected tab", () => {
    const tree = renderTabs(
      <Wrapper>
        <Tabs contract={tabsContract} options={options} value="activity" onValueChange={() => {}} testID="tabs" />
      </Wrapper>,
    );

    const tabs = findTabNodes(tree);
    const states = Object.fromEntries(tabs.map((tab: any) => [tab.props.testID, tab.props.accessibilityState.selected]));

    expect(states["tabs-tab-activity"]).toBe(true);
    expect(states["tabs-tab-overview"]).toBe(false);
  });

  it("emits the selected tab value", () => {
    const onValueChange = jest.fn();
    const tree = renderTabs(
      <Wrapper>
        <Tabs contract={tabsContract} options={options} value="overview" onValueChange={onValueChange} testID="tabs" />
      </Wrapper>,
    );

    const tab = findTabNodes(tree).find((node: any) => node.props.testID === "tabs-tab-settings");

    act(() => {
      tab?.props.onPress();
    });

    expect(onValueChange).toHaveBeenCalledWith("settings");
  });

  it("blocks disabled tabs", () => {
    const onValueChange = jest.fn();
    const disabledOptions = [
      options[0],
      { ...options[1], disabled: true },
      options[2],
    ];
    const tree = renderTabs(
      <Wrapper>
        <Tabs contract={tabsContract} options={disabledOptions} value="overview" onValueChange={onValueChange} testID="tabs" />
      </Wrapper>,
    );

    const tab = findTabNodes(tree).find((node: any) => node.props.testID === "tabs-tab-activity");

    expect(tab?.props.disabled).toBe(true);
  });
});
