import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text, View } from "react-native";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Chip } from "./Chip";

const neutral = defaultContracts.chip!["neutral"];
const accent = defaultContracts.chip!["accent"];

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

function findProbe(tree: any) {
  return tree.root.findByType("PressableProbe" as any);
}

// Chip/Pressable resolve `contract` internally into a style object applied
// to a plain RN View — they don't forward the raw contract prop anywhere
// observable, so assertions on resolved styling read that View's `style`.
function findStyledView(tree: any) {
  return tree.root.find((n: any) => n.type === View && n.props.style && "borderRadius" in n.props.style);
}

describe("Chip", () => {
  it("renders its label", () => {
    const tree = render(
      <Wrapper>
        <Chip contract={neutral} label="Draft" accessibilityLabel="Draft filter" onPress={() => {}} />
      </Wrapper>,
    );

    const text = tree.root.findAllByType(Text).find((n: any) => n.props.children === "Draft");
    expect(text).toBeTruthy();
  });

  it("resolves pill vs rounded border radius from the shape prop", () => {
    const pillTree = render(
      <Wrapper>
        <Chip contract={neutral} shape="pill" label="Draft" accessibilityLabel="Draft filter" onPress={() => {}} />
      </Wrapper>,
    );
    const roundedTree = render(
      <Wrapper>
        <Chip contract={neutral} shape="rounded" label="Draft" accessibilityLabel="Draft filter" onPress={() => {}} />
      </Wrapper>,
    );

    expect(findStyledView(pillTree).props.style.borderRadius).toBe(neutral.shape.pillBorderRadius);
    expect(findStyledView(roundedTree).props.style.borderRadius).toBe(neutral.shape.roundedBorderRadius);
  });

  it("stretches to fill its container only in fill frame mode", () => {
    const contentTree = render(
      <Wrapper>
        <Chip contract={neutral} frame="content" label="Draft" accessibilityLabel="Draft filter" onPress={() => {}} />
      </Wrapper>,
    );
    const fillTree = render(
      <Wrapper>
        <Chip contract={neutral} frame="fill" label="Draft" accessibilityLabel="Draft filter" onPress={() => {}} />
      </Wrapper>,
    );

    expect(findStyledView(contentTree).props.style.flex).toBeUndefined();
    expect(findStyledView(fillTree).props.style.flex).toBe(1);
  });

  it("supports a themeable selected tone distinct from the default neutral fill", () => {
    const tree = render(
      <Wrapper>
        <Chip contract={accent} selected label="Active" accessibilityLabel="Active filter" onPress={() => {}} />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityState).toEqual({ disabled: false, selected: true });
    expect(findStyledView(tree).props.style.backgroundColor).toBe(accent.interaction!.selected!.backgroundColor);
    expect(accent.interaction!.selected!.backgroundColor).not.toBe(neutral.interaction!.selected!.backgroundColor);
  });
});
