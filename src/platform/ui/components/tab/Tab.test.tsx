import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Tab } from "./Tab";

const tabContract = defaultContracts.tab!["default"];

jest.mock("react-native/Libraries/Components/Pressable/Pressable", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ children, ...props }: any) =>
      React.createElement(
        "PressableProbe",
        props,
        typeof children === "function" ? children({ pressed: false, hovered: false, focused: false }) : children,
      ),
  };
});

jest.mock("../text/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Body: ({ children, color }: { children?: React.ReactNode; color?: string }) =>
      React.createElement(Text, { color }, children),
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function render(element: React.ReactElement) {
  let tree: any = null;
  act(() => {
    tree = TestRenderer.create(element);
  });
  return tree as any;
}

const options = [
  { label: "Hug", value: "hug" },
  { label: "Fixed", value: "fixed" },
  { label: "Fill", value: "fill" },
];

function findSegments(tree: any) {
  return tree.root.findAll(
    (node: any) => node.type === "PressableProbe" && typeof node.props.testID === "string",
  );
}

describe("Tab", () => {
  it("renders one segment per option, all with role tab", () => {
    const tree = render(
      <Wrapper>
        <Tab contract={tabContract} options={options} value="hug" onValueChange={() => {}} testID="seg" />
      </Wrapper>,
    );

    const segments = findSegments(tree);

    expect(segments).toHaveLength(3);
    expect(segments.every((s: any) => s.props.accessibilityRole === "tab")).toBe(true);
  });

  it("marks only the selected segment", () => {
    const tree = render(
      <Wrapper>
        <Tab contract={tabContract} options={options} value="fixed" onValueChange={() => {}} testID="seg" />
      </Wrapper>,
    );

    const states = Object.fromEntries(
      findSegments(tree).map((s: any) => [s.props.testID, s.props.accessibilityState.selected]),
    );

    expect(states["seg-tab-hug"]).toBe(false);
    expect(states["seg-tab-fixed"]).toBe(true);
    expect(states["seg-tab-fill"]).toBe(false);
  });

  it("emits the selected segment's value", () => {
    const onValueChange = jest.fn();
    const tree = render(
      <Wrapper>
        <Tab contract={tabContract} options={options} value="hug" onValueChange={onValueChange} testID="seg" />
      </Wrapper>,
    );

    const fill = findSegments(tree).find((s: any) => s.props.testID === "seg-tab-fill");

    act(() => {
      fill.props.onPress();
    });

    expect(onValueChange).toHaveBeenCalledWith("fill");
  });

  it("blocks a disabled segment", () => {
    const disabledOptions = [options[0], { ...options[1], disabled: true }, options[2]];
    const tree = render(
      <Wrapper>
        <Tab contract={tabContract} options={disabledOptions} value="hug" onValueChange={() => {}} testID="seg" />
      </Wrapper>,
    );

    const fixed = findSegments(tree).find((s: any) => s.props.testID === "seg-tab-fixed");

    expect(fixed.props.disabled).toBe(true);
    expect(fixed.props.tabIndex).toBe(-1);
  });

  it("gives every segment equal width via flex", () => {
    const tree = render(
      <Wrapper>
        <Tab contract={tabContract} options={options} value="hug" onValueChange={() => {}} testID="seg" />
      </Wrapper>,
    );

    // flex isn't a Pressable-probe prop (it's applied by the inner
    // Pressable to the resolved View style), so read it the same way
    // Chip.test.tsx does — off the styled host View, one per segment.
    const { View } = require("react-native");
    const styledViews = tree.root.findAll(
      (n: any) => n.type === View && n.props.style && n.props.style.flex !== undefined,
    );

    expect(styledViews.length).toBeGreaterThanOrEqual(3);
    expect(styledViews.every((v: any) => v.props.style.flex === 1)).toBe(true);
  });
});
