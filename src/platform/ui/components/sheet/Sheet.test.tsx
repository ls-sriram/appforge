import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text, View } from "react-native";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { SheetProvider, useSheet } from "./SheetProvider";
import { haptics } from "../../primitives/haptics";

jest.mock("../../primitives/haptics", () => ({
  haptics: {
    impact: jest.fn(() => Promise.resolve()),
    notification: jest.fn(() => Promise.resolve()),
    selection: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock("react-native/Libraries/Modal/Modal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ visible, children }: { visible?: boolean; children?: React.ReactNode }) =>
      visible ? React.createElement(View, null, children) : null,
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SheetProvider>{children}</SheetProvider>
    </ThemeProvider>
  );
}

function Trigger() {
  const { open, close } = useSheet();
  return (
    <View>
      <Text onPress={() => open(<Text>Sheet body</Text>)}>open</Text>
      <Text onPress={close}>close</Text>
    </View>
  );
}

function render(element: React.ReactElement) {
  let tree: any = null;
  act(() => {
    tree = TestRenderer.create(element);
  });
  return tree as any;
}

function press(tree: any, label: string) {
  act(() => {
    tree.root.findAllByType(Text).find((n: any) => n.props.children === label).props.onPress();
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("Sheet / SheetProvider", () => {
  it("is not rendered until open() is called", () => {
    const tree = render(
      <Wrapper>
        <Trigger />
      </Wrapper>,
    );

    expect(tree.root.findAllByType(Text).map((n: any) => n.props.children)).not.toContain("Sheet body");
  });

  it("renders the given content once open() is called, and fires an impact haptic", () => {
    const tree = render(
      <Wrapper>
        <Trigger />
      </Wrapper>,
    );

    press(tree, "open");

    expect(tree.root.findAllByType(Text).map((n: any) => n.props.children)).toContain("Sheet body");
    expect(haptics.impact).toHaveBeenCalledWith("light");
  });

  it("unmounts its content after close() plus the exit-animation settle time", () => {
    const tree = render(
      <Wrapper>
        <Trigger />
      </Wrapper>,
    );

    press(tree, "open");
    expect(tree.root.findAllByType(Text).map((n: any) => n.props.children)).toContain("Sheet body");

    press(tree, "close");
    // Still mounted immediately after close() — the exit animation needs to settle first.
    expect(tree.root.findAllByType(Text).map((n: any) => n.props.children)).toContain("Sheet body");

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(tree.root.findAllByType(Text).map((n: any) => n.props.children)).not.toContain("Sheet body");
  });
});
