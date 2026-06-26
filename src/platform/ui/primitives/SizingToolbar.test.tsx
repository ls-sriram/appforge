import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { SizingToolbar } from "./SizingToolbar";

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

function findButtons(tree: TestRenderer.ReactTestRenderer) {
  return tree.root.findAll(
    (node) =>
      typeof node.props.testID === "string" &&
      node.props.testID.startsWith("sizing-toolbar-") &&
      typeof node.props.onPress === "function",
  );
}

function renderToolbar(element: React.ReactElement) {
  let tree: TestRenderer.ReactTestRenderer | null = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as TestRenderer.ReactTestRenderer;
}

beforeAll(() => {
  if (typeof window !== "undefined" && typeof window.dispatchEvent !== "function") {
    // react-test-renderer expects this to exist when bubbling uncaught errors.
    (window as typeof window & { dispatchEvent: () => void }).dispatchEvent = () => {};
  }
});

describe("SizingToolbar", () => {
  it("renders exactly three size options", () => {
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar value="md" onChange={() => {}} />
      </Wrapper>,
    );

    const buttons = findButtons(tree);

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.props.testID)).toEqual([
      "sizing-toolbar-sm",
      "sizing-toolbar-md",
      "sizing-toolbar-lg",
    ]);
  });

  it("marks the selected option", () => {
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar value="lg" onChange={() => {}} />
      </Wrapper>,
    );

    const buttons = findButtons(tree);
    const states = Object.fromEntries(buttons.map((button) => [button.props.testID, button.props.accessibilityState.selected]));

    expect(states["sizing-toolbar-lg"]).toBe(true);
    expect(states["sizing-toolbar-sm"]).toBe(false);
  });

  it("emits the selected size", () => {
    const onChange = jest.fn();
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar value="md" onChange={onChange} />
      </Wrapper>,
    );

    const button = findButtons(tree).find((node) => node.props.testID === "sizing-toolbar-sm");

    act(() => {
      button?.props.onPress();
    });

    expect(onChange).toHaveBeenCalledWith("sm");
  });

  it("blocks interaction when disabled", () => {
    const onChange = jest.fn();
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar value="md" onChange={onChange} disabled />
      </Wrapper>,
    );

    const button = findButtons(tree).find((node) => node.props.testID === "sizing-toolbar-lg");

    expect(button?.props.disabled).toBe(true);
  });

  it("supports icon overrides without changing option values", () => {
    const onChange = jest.fn();
    const tree = renderToolbar(
      <Wrapper>
        <SizingToolbar
          value="sm"
          onChange={onChange}
          icons={{ sm: "minus", md: "table", lg: "plus" }}
        />
      </Wrapper>,
    );

    const button = findButtons(tree).find((node) => node.props.testID === "sizing-toolbar-lg");

    act(() => {
      button?.props.onPress();
    });

    expect(onChange).toHaveBeenCalledWith("lg");
  });
});
