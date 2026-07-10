import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Card } from "./Card";

const cardContract = defaultContracts.card!["default"];

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

describe("Card", () => {
  it("renders title, subtitle, and body children together", () => {
    const tree = render(
      <Wrapper>
        <Card contract={cardContract} accessibilityLabel="Open onboarding.tsx" title="onboarding.tsx" subtitle="src/features/onboarding" onPress={() => {}} testID="card">
          <Text>142 lines</Text>
        </Card>
      </Wrapper>,
    );

    const texts = tree.root.findAllByType(Text).map((n: any) => n.props.children);

    expect(texts).toContain("onboarding.tsx");
    expect(texts).toContain("src/features/onboarding");
    expect(texts).toContain("142 lines");
  });

  it("omits title/subtitle nodes entirely when not provided, rather than rendering empty text", () => {
    const tree = render(
      <Wrapper>
        <Card contract={cardContract} accessibilityLabel="Open file" onPress={() => {}} testID="card">
          <Text>Just a body</Text>
        </Card>
      </Wrapper>,
    );

    expect(tree.root.findAllByType(Text)).toHaveLength(1);
  });

  it("defaults to role button as a larger clickable surface", () => {
    const tree = render(
      <Wrapper>
        <Card contract={cardContract} accessibilityLabel="Open file" title="file.ts" onPress={() => {}} testID="card" />
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityRole).toBe("button");
  });

  it("fires onPress on activation", () => {
    const onPress = jest.fn();
    const tree = render(
      <Wrapper>
        <Card contract={cardContract} accessibilityLabel="Open file" title="file.ts" onPress={onPress} testID="card" />
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
