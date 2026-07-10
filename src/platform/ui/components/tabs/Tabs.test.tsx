import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Tabs } from "./Tabs";

const tabsContract = defaultContracts.tabs!["default"];

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

function renderTabs(element: React.ReactElement) {
  let tree: any = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as any;
}

// Tabs now composes the platform Pressable, which itself wraps RN's own
// Pressable — both happen to be named "Pressable" and both forward
// testID/onPress, so a plain testID match is ambiguous across the tree.
// accessibilityRole="tab" is set by the inner RN-level Pressable only (the
// platform Pressable's own JSX prop is `role`, a different key), so it
// uniquely identifies the real interactive node.
function findTabNodes(tree: any) {
  return tree.root.findAll(
    (node: any) =>
      typeof node.props.testID === "string" &&
      node.props.testID.startsWith("tabs-tab-") &&
      node.props.accessibilityRole === "tab",
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

    const testIDs = [...new Set(findTabNodes(tree).map((tab: any) => tab.props.testID))];

    expect(testIDs).toEqual(["tabs-tab-overview", "tabs-tab-activity", "tabs-tab-settings"]);
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

  it("is keyboard-focusable now that it composes Pressable, not a raw accessibilityRole View", () => {
    const tree = renderTabs(
      <Wrapper>
        <Tabs contract={tabsContract} options={options} value="overview" onValueChange={() => {}} testID="tabs" />
      </Wrapper>,
    );

    const overview = findTabNodes(tree).find((node: any) => node.props.testID === "tabs-tab-overview");

    expect(overview?.props.tabIndex).toBe(0);
  });

  it("removes disabled tabs from the tab order", () => {
    const disabledOptions = [options[0], { ...options[1], disabled: true }, options[2]];
    const tree = renderTabs(
      <Wrapper>
        <Tabs contract={tabsContract} options={disabledOptions} value="overview" onValueChange={() => {}} testID="tabs" />
      </Wrapper>,
    );

    const activity = findTabNodes(tree).find((node: any) => node.props.testID === "tabs-tab-activity");

    expect(activity?.props.tabIndex).toBe(-1);
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
