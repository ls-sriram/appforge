import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { MenuItem } from "./MenuItem";

const menuItemContract = defaultContracts.menuItem!["default"];

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

function findProbe(tree: any) {
  return tree.root.findByType("PressableProbe" as any);
}

describe("MenuItem", () => {
  it("always renders role menuitemcheckbox — the spec's role-correctness fix, not a configurable button", () => {
    const tree = render(
      <Wrapper>
        <MenuItem contract={menuItemContract} label="Show hidden nodes" accessibilityLabel="Show hidden nodes" onPress={() => {}} testID="mi" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityRole).toBe("menuitemcheckbox");
  });

  it("exposes checked in accessibilityState, separate from RN's usual selected semantics", () => {
    const tree = render(
      <Wrapper>
        <MenuItem contract={menuItemContract} label="Show hidden nodes" accessibilityLabel="Show hidden nodes" checked onPress={() => {}} testID="mi" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityState).toEqual({ disabled: false, selected: true, checked: true });
  });

  it("defaults to unchecked", () => {
    const tree = render(
      <Wrapper>
        <MenuItem contract={menuItemContract} label="Show hidden nodes" accessibilityLabel="Show hidden nodes" onPress={() => {}} testID="mi" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityState).toEqual({ disabled: false, selected: false, checked: false });
  });

  it("fires onPress on activation, toggling being the caller's responsibility", () => {
    const onPress = jest.fn();
    const tree = render(
      <Wrapper>
        <MenuItem contract={menuItemContract} label="Show hidden nodes" accessibilityLabel="Show hidden nodes" onPress={onPress} testID="mi" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
