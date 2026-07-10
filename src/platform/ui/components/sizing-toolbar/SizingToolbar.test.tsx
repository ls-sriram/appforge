import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { SizingToolbar } from "./SizingToolbar";

const sizingToolbarContract = defaultContracts.sizingToolbar!["default"];

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

// SizingToolbar now composes the platform Pressable, which wraps RN's own
// Pressable — both are named "Pressable" and both forward testID/onPress,
// so a plain testID match is ambiguous. accessibilityRole="button" is set
// by the inner RN-level Pressable only (the platform Pressable's own JSX
// prop is `role`, a different key), so it uniquely identifies the real
// interactive node; dedupe by testID for length-based assertions since RN
// also mirrors props onto nested host Views.
function findButtons(tree: any) {
  return tree.root.findAll(
    (node: any) =>
      typeof node.props.testID === "string" &&
      node.props.testID.startsWith("sizing-toolbar-") &&
      node.props.accessibilityRole === "button",
  );
}

function uniqueButtons(tree: any) {
  const seen = new Set<string>();
  return findButtons(tree).filter((node: any) => {
    if (seen.has(node.props.testID)) return false;
    seen.add(node.props.testID);
    return true;
  });
}

function renderToolbar(element: React.ReactElement) {
  let tree: any = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as any;
}

beforeAll(() => {
  if (typeof window !== "undefined" && typeof window.dispatchEvent !== "function") {
    // react-test-renderer expects this to exist when bubbling uncaught errors.
    (window as typeof window & { dispatchEvent: () => boolean }).dispatchEvent = () => false;
  }
});

describe("SizingToolbar", () => {
  it("renders exactly three size options", () => {
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar contract={sizingToolbarContract} value="md" onChange={() => {}} />
      </Wrapper>,
    );

    const buttons = uniqueButtons(tree);

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button: any) => button.props.testID)).toEqual([
      "sizing-toolbar-sm",
      "sizing-toolbar-md",
      "sizing-toolbar-lg",
    ]);
  });

  it("marks the selected option", () => {
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar contract={sizingToolbarContract} value="lg" onChange={() => {}} />
      </Wrapper>,
    );

    const buttons = findButtons(tree);
    const states = Object.fromEntries(buttons.map((button: any) => [button.props.testID, button.props.accessibilityState.selected]));

    expect(states["sizing-toolbar-lg"]).toBe(true);
    expect(states["sizing-toolbar-sm"]).toBe(false);
  });

  it("emits the selected size", () => {
    const onChange = jest.fn();
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar contract={sizingToolbarContract} value="md" onChange={onChange} />
      </Wrapper>,
    );

    const button = findButtons(tree).find((node: any) => node.props.testID === "sizing-toolbar-sm");

    act(() => {
      button?.props.onPress();
    });

    expect(onChange).toHaveBeenCalledWith("sm");
  });

  it("is keyboard-focusable now that it composes Pressable, not a raw accessibilityRole Pressable", () => {
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar contract={sizingToolbarContract} value="md" onChange={() => {}} />
      </Wrapper>,
    );

    const sm = findButtons(tree).find((node: any) => node.props.testID === "sizing-toolbar-sm");

    expect(sm?.props.tabIndex).toBe(0);
  });

  it("removes every option from the tab order when disabled", () => {
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar contract={sizingToolbarContract} value="md" onChange={() => {}} disabled />
      </Wrapper>,
    );

    const sm = findButtons(tree).find((node: any) => node.props.testID === "sizing-toolbar-sm");

    expect(sm?.props.tabIndex).toBe(-1);
  });

  it("blocks interaction when disabled", () => {
    const onChange = jest.fn();
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar contract={sizingToolbarContract} value="md" onChange={onChange} disabled />
      </Wrapper>,
    );

    const button = findButtons(tree).find((node: any) => node.props.testID === "sizing-toolbar-lg");

    expect(button?.props.disabled).toBe(true);
  });

  it("supports icon overrides without changing option values", () => {
    const onChange = jest.fn();
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar
          contract={sizingToolbarContract}
          value="sm"
          onChange={onChange}
          icons={{ sm: "minus", md: "table", lg: "plus" }}
        />
      </Wrapper>,
    );

    const button = findButtons(tree).find((node: any) => node.props.testID === "sizing-toolbar-lg");

    act(() => {
      button?.props.onPress();
    });

    expect(onChange).toHaveBeenCalledWith("lg");
  });
});
