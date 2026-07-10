import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { IconButton, ToolbarButton } from "./IconButton";

const iconButtonContract = defaultContracts.iconButton!["default"];

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

describe("IconButton", () => {
  it("requires accessibilityLabel — there is no visible text to fall back to", () => {
    const tree = render(
      <Wrapper>
        <IconButton contract={iconButtonContract} icon="x" accessibilityLabel="Close panel" onPress={() => {}} testID="ib" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityLabel).toBe("Close panel");
  });

  it("fires onPress on activation", () => {
    const onPress = jest.fn();
    const tree = render(
      <Wrapper>
        <IconButton contract={iconButtonContract} icon="x" accessibilityLabel="Close panel" onPress={onPress} testID="ib" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("resolves a fixed square from the contract", () => {
    const { View } = require("react-native");
    const tree = render(
      <Wrapper>
        <IconButton contract={iconButtonContract} icon="x" accessibilityLabel="Close panel" onPress={() => {}} testID="ib" />
      </Wrapper>,
    );

    const styledView = tree.root.find((n: any) => n.type === View && n.props.style && n.props.style.width !== undefined);

    expect(styledView.props.style.width).toBe(iconButtonContract.frame.width);
    expect(styledView.props.style.height).toBe(iconButtonContract.frame.height);
    expect(styledView.props.style.width).toBe(styledView.props.style.height);
  });

  it("exposes ToolbarButton as the same component, not a separate implementation", () => {
    expect(ToolbarButton).toBe(IconButton);
  });
});
