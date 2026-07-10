import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { ListItem } from "./ListItem";

const listItemContract = defaultContracts.listItem!["default"];

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

// Body is a Tamagui-styled Text; swap it for RN's own Text so label
// assertions can target a plain host component, same approach
// Tabs.test.tsx uses for the same reason.
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

function findProbe(tree: any) {
  return tree.root.findByType("PressableProbe" as any);
}

describe("ListItem", () => {
  it("defaults to role button", () => {
    const tree = render(
      <Wrapper>
        <ListItem contract={listItemContract} accessibilityLabel="Open file" label="index.ts" onPress={() => {}} testID="row" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityRole).toBe("button");
  });

  it("switches to role option for selection-list rows", () => {
    const tree = render(
      <Wrapper>
        <ListItem contract={listItemContract} variant="option" accessibilityLabel="Home block" label="Home" onPress={() => {}} testID="row" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityRole).toBe("option");
  });

  it("renders label text when no children are given", () => {
    const tree = render(
      <Wrapper>
        <ListItem contract={listItemContract} accessibilityLabel="Open file" label="index.ts" onPress={() => {}} testID="row" />
      </Wrapper>,
    );

    const text = tree.root.findAllByType(Text).find((n: any) => n.props.children === "index.ts");
    expect(text).toBeTruthy();
  });

  it("renders arbitrary children instead of label for multi-column rows", () => {
    const tree = render(
      <Wrapper>
        <ListItem contract={listItemContract} accessibilityLabel="Run #42" label="ignored" onPress={() => {}} testID="row">
          <Text testID="col-1">42</Text>
          <Text testID="col-2">success</Text>
        </ListItem>
      </Wrapper>,
    );

    expect(tree.root.findAllByProps({ testID: "col-1" }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByProps({ testID: "col-2" }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByType(Text).some((n: any) => n.props.children === "ignored")).toBe(false);
  });

  it("renders trailingAction as a sibling of the row's Pressable, not nested inside it", () => {
    const tree = render(
      <Wrapper>
        <ListItem
          contract={listItemContract}
          accessibilityLabel="Designer node"
          label="Node"
          onPress={() => {}}
          trailingAction={<Text testID="expand-chevron">{"v"}</Text>}
          testID="row"
        />
      </Wrapper>,
    );

    const probe = findProbe(tree);
    const chevron = tree.root.findByProps({ testID: "expand-chevron" });

    const isDescendantOfPressable = probe.findAll((n: any) => n === chevron).length > 0;
    expect(isDescendantOfPressable).toBe(false);
  });

  it("passes selected through to the underlying Pressable", () => {
    const tree = render(
      <Wrapper>
        <ListItem contract={listItemContract} accessibilityLabel="Home" label="Home" onPress={() => {}} selected testID="row" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityState).toEqual({ disabled: false, selected: true });
  });
});
