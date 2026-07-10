import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Select } from "./Select";

const selectContract = defaultContracts.select!["default"];

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

function render(element: React.ReactElement) {
  let tree: any = null;
  act(() => {
    tree = TestRenderer.create(element);
  });
  return tree as any;
}

// Select now composes the platform Pressable, which wraps RN's own
// Pressable — both are named "Pressable" and both forward testID, so a
// plain testID match is ambiguous. accessibilityRole is set only by the
// inner RN-level Pressable (the platform Pressable's own JSX prop is
// `role`), so filtering on it picks the real interactive node.
function findByTestID(tree: any, testID: string) {
  return tree.root.findAll(
    (node: any) => node.props.testID === testID && typeof node.props.accessibilityRole === "string",
  )[0];
}

// The menu container is a plain View (no role), so it needs its own
// lookup rather than the Pressable-disambiguating one above.
function menuExists(tree: any, testID: string) {
  return tree.root.findAll((node: any) => node.props.testID === testID).length > 0;
}

const options = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "Mexico", value: "mx", disabled: true },
];

describe("Select", () => {
  it("starts closed, with the trigger reflecting the placeholder", () => {
    const tree = render(
      <Wrapper>
        <Select contract={selectContract} options={options} value={null} onValueChange={() => {}} placeholder="Pick a country" testID="sel" />
      </Wrapper>,
    );

    expect(menuExists(tree, "sel-menu")).toBe(false);
    const trigger = findByTestID(tree, "sel-trigger");
    expect(trigger.props.accessibilityState.expanded).toBe(false);
  });

  it("opens the menu on trigger activation", () => {
    const tree = render(
      <Wrapper>
        <Select contract={selectContract} options={options} value={null} onValueChange={() => {}} testID="sel" />
      </Wrapper>,
    );

    act(() => {
      findByTestID(tree, "sel-trigger").props.onPress();
    });

    expect(menuExists(tree, "sel-menu")).toBe(true);
    expect(findByTestID(tree, "sel-trigger").props.accessibilityState.expanded).toBe(true);
  });

  it("selects an option and closes the menu", () => {
    const onValueChange = jest.fn();
    const tree = render(
      <Wrapper>
        <Select contract={selectContract} options={options} value={null} onValueChange={onValueChange} testID="sel" />
      </Wrapper>,
    );

    act(() => {
      findByTestID(tree, "sel-trigger").props.onPress();
    });
    act(() => {
      findByTestID(tree, "sel-option-ca").props.onPress();
    });

    expect(onValueChange).toHaveBeenCalledWith("ca");
    expect(menuExists(tree, "sel-menu")).toBe(false);
  });

  it("blocks a disabled option and keeps it out of the tab order", () => {
    const tree = render(
      <Wrapper>
        <Select contract={selectContract} options={options} value={null} onValueChange={() => {}} testID="sel" />
      </Wrapper>,
    );

    act(() => {
      findByTestID(tree, "sel-trigger").props.onPress();
    });

    const mx = findByTestID(tree, "sel-option-mx");
    expect(mx.props.disabled).toBe(true);
    expect(mx.props.tabIndex).toBe(-1);
  });

  it("is keyboard-focusable on the trigger now that it composes Pressable", () => {
    const tree = render(
      <Wrapper>
        <Select contract={selectContract} options={options} value={null} onValueChange={() => {}} testID="sel" />
      </Wrapper>,
    );

    expect(findByTestID(tree, "sel-trigger").props.tabIndex).toBe(0);
  });

  it("disables the trigger and removes it from the tab order", () => {
    const tree = render(
      <Wrapper>
        <Select contract={selectContract} options={options} value={null} onValueChange={() => {}} disabled testID="sel" />
      </Wrapper>,
    );

    const trigger = findByTestID(tree, "sel-trigger");
    expect(trigger.props.disabled).toBe(true);
    expect(trigger.props.tabIndex).toBe(-1);
  });
});
