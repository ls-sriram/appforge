import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Pressable } from "./Pressable";

const pressableContract = defaultContracts.pressable!["default"];

// jest-expo's test renderer exercises RN's *native* Pressable, which nests
// an internal View wrapper — asserting against that internal structure is
// brittle and doesn't tell us anything about the actual contract this
// component makes with RN's Pressable API. Mock Pressable itself (same
// pattern Tabs.test.tsx uses for Text/react-native-svg) so each test can
// assert directly on the props this component passes to it: that's the
// real surface react-native-web's PressResponder consumes on web.
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

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function renderPressable(element: React.ReactElement) {
  let tree: any = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as any;
}

function findProbe(tree: any) {
  return tree.root.findByType("PressableProbe" as any);
}

describe("Pressable", () => {
  it("fires onPress on activation", () => {
    const onPress = jest.fn();
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} accessibilityLabel="Do the thing" onPress={onPress} testID="px" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("defaults to tabIndex 0 and role button", () => {
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} accessibilityLabel="Do the thing" onPress={() => {}} testID="px" />
      </Wrapper>,
    );

    const probe = findProbe(tree);

    expect(probe.props.tabIndex).toBe(0);
    expect(probe.props.accessibilityRole).toBe("button");
  });

  it("moves out of the tab order and blocks onPress when disabled", () => {
    const onPress = jest.fn();
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} accessibilityLabel="Do the thing" onPress={onPress} disabled testID="px" />
      </Wrapper>,
    );

    const probe = findProbe(tree);

    expect(probe.props.tabIndex).toBe(-1);
    expect(probe.props.disabled).toBe(true);
    expect(probe.props.accessibilityState).toEqual({ disabled: true, selected: false });
  });

  it("passes accessibilityLabel through untouched (required, no default)", () => {
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} accessibilityLabel="Close panel" onPress={() => {}} testID="px" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityLabel).toBe("Close panel");
  });

  it("does not fire onPress itself on Enter for the default button role", () => {
    const onPress = jest.fn();
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} accessibilityLabel="Do the thing" onPress={onPress} testID="px" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onKeyDown({ key: "Enter", preventDefault: () => {} });
    });

    // Enter activation for role="button" is RN-Web's own PressResponder
    // behavior (fired on its internal keyup/click path, not via the
    // onKeyDown prop this component passes) — this component's own
    // onKeyDown handler must stay a no-op for Enter so it can't double-fire.
    expect(onPress).not.toHaveBeenCalled();
  });

  it("supplements Space-key activation for non-button roles RN-Web doesn't cover", () => {
    const onPress = jest.fn();
    const preventDefault = jest.fn();
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} role="tab" accessibilityLabel="Overview tab" onPress={onPress} testID="px" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onKeyDown({ key: " ", preventDefault });
    });

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("does not supplement Space for the button role, to avoid double-firing RN-Web's own handling", () => {
    const onPress = jest.fn();
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} accessibilityLabel="Do the thing" onPress={onPress} testID="px" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onKeyDown({ key: " ", preventDefault: () => {} });
    });

    expect(onPress).not.toHaveBeenCalled();
  });

  it("blocks the Space supplement when disabled", () => {
    const onPress = jest.fn();
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} role="tab" accessibilityLabel="Overview tab" onPress={onPress} disabled testID="px" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onKeyDown({ key: " ", preventDefault: () => {} });
    });

    expect(onPress).not.toHaveBeenCalled();
  });

  it("threads selected into interaction styling instead of press/hover/focus", () => {
    const tree = renderPressable(
      <Wrapper>
        <Pressable contract={pressableContract} accessibilityLabel="Do the thing" onPress={() => {}} selected testID="px" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityState).toEqual({ disabled: false, selected: true });
  });
});
