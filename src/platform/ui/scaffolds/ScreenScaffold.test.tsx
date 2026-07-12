import React from "react";
import { Text } from "react-native";
import TestRenderer, { act } from "react-test-renderer";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import { createUi } from "../viz";
import { ScreenScaffold } from "./ScreenScaffold.scaffold";

jest.mock("react-native", () => {
  const React = require("react");
  const makeComponent = (name: string) => ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(name, props, children);

  return {
    View: makeComponent("View"),
    Text: makeComponent("Text"),
    ScrollView: makeComponent("ScrollView"),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement("SafeAreaView", props, children),
  };
});

function renderScaffold(element: React.ReactElement) {
  let tree: any;
  act(() => {
    tree = TestRenderer.create(<ThemeProvider>{element}</ThemeProvider>);
  });
  return tree!;
}

function findHostByTestId(tree: any, testID: string) {
  return tree.root.find((node: any) => typeof node.type === "string" && node.props.testID === testID);
}

function hasAncestor(node: any, ancestor: any) {
  let parent = node.parent;
  while (parent) {
    if (parent === ancestor) return true;
    parent = parent.parent;
  }
  return false;
}

describe("ScreenScaffold", () => {
  it("keeps the header fixed while only the content region scrolls", () => {
    const tree = renderScaffold(
      <ScreenScaffold header={<Text>Header</Text>} scroll ui={createUi("screen")}>
        <Text>Content</Text>
      </ScreenScaffold>,
    );

    const root = findHostByTestId(tree, "screen.root");
    const header = findHostByTestId(tree, "screen.header");
    const content = findHostByTestId(tree, "screen.content");
    expect(hasAncestor(header, root)).toBe(true);
    expect(hasAncestor(content, root)).toBe(true);
    expect(hasAncestor(header, content)).toBe(false);
    expect(tree.root.findAllByType("ScrollView")).toHaveLength(1);
    expect(content.type).toBe("ScrollView");
    expect(content.props.keyboardShouldPersistTaps).toBe("handled");
  });

  it("fills remaining height without scrolling", () => {
    const tree = renderScaffold(
      <ScreenScaffold ui={createUi("screen")}><Text>Content</Text></ScreenScaffold>,
    );
    const content = findHostByTestId(tree, "screen.content");

    expect(content.type).toBe("View");
    expect(content.props.style).toEqual(expect.arrayContaining([
      expect.objectContaining({ flex: 1, minHeight: 0 }),
    ]));
  });

  it("renders an optional footer outside the scroll region", () => {
    const tree = renderScaffold(
      <ScreenScaffold footer={<Text>Footer</Text>} scroll ui={createUi("screen")}>
        <Text>Content</Text>
      </ScreenScaffold>,
    );
    const root = findHostByTestId(tree, "screen.root");
    const footer = findHostByTestId(tree, "screen.footer");
    expect(hasAncestor(footer, root)).toBe(true);
    expect(hasAncestor(footer, tree.root.findByType("ScrollView"))).toBe(false);
  });

  it("applies top and bottom safe areas once and supports toggling either edge", () => {
    const defaultTree = renderScaffold(<ScreenScaffold ui={createUi("default")}><Text>Content</Text></ScreenScaffold>);
    const toggledTree = renderScaffold(
      <ScreenScaffold safeAreaBottom={false} safeAreaTop={false} ui={createUi("toggled")}>
        <Text>Content</Text>
      </ScreenScaffold>,
    );

    expect(findHostByTestId(defaultTree, "default.root").props.edges).toEqual(["left", "right", "top", "bottom"]);
    expect(findHostByTestId(toggledTree, "toggled.root").props.edges).toEqual(["left", "right"]);
    expect(defaultTree.root.findAllByType("SafeAreaView")).toHaveLength(1);
  });

  it("uses the theme background and preserves custom content padding", () => {
    let background = "";
    function ThemeProbe() {
      background = useTheme().palette.background;
      return null;
    }

    const tree = renderScaffold(
      <>
        <ThemeProbe />
        <ScreenScaffold contentContainerStyle={{ paddingHorizontal: 24 }} scroll ui={createUi("screen")}>
          <Text>Content</Text>
        </ScreenScaffold>
      </>,
    );
    const root = findHostByTestId(tree, "screen.root");
    const content = findHostByTestId(tree, "screen.content");

    expect(root.props.style).toEqual(expect.arrayContaining([
      expect.objectContaining({ backgroundColor: background }),
    ]));
    expect(content.props.contentContainerStyle).toEqual(expect.arrayContaining([
      expect.objectContaining({ paddingHorizontal: 24 }),
    ]));
  });

  it("uses React Native host primitives compatible with web rendering", () => {
    const tree = renderScaffold(<ScreenScaffold scroll ui={createUi("web")}><Text>Content</Text></ScreenScaffold>);
    expect(findHostByTestId(tree, "web.root").type).toBe("SafeAreaView");
    expect(findHostByTestId(tree, "web.content").type).toBe("ScrollView");
  });
});
