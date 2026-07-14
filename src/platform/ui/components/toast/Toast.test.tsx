import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { ToastProvider, useToast } from "./ToastProvider";
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
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}

function Trigger({ message, variant }: { message: string; variant?: "info" | "success" | "warning" | "error" }) {
  const { show } = useToast();
  return (
    <Text onPress={() => show(message, { variant, duration: 1000 })}>trigger</Text>
  );
}

function render(element: React.ReactElement) {
  let tree: any = null;
  act(() => {
    tree = TestRenderer.create(element);
  });
  return tree as any;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("Toast / ToastProvider", () => {
  it("shows a toast with the given message when show() is called", () => {
    const tree = render(
      <Wrapper>
        <Trigger message="Saved successfully" />
      </Wrapper>,
    );

    act(() => {
      tree.root.findAllByType(Text).find((n: any) => n.props.children === "trigger").props.onPress();
    });

    const texts = tree.root.findAllByType(Text).map((n: any) => n.props.children);
    expect(texts).toContain("Saved successfully");
  });

  it("auto-dismisses after the given duration", () => {
    const tree = render(
      <Wrapper>
        <Trigger message="Will disappear" />
      </Wrapper>,
    );

    act(() => {
      tree.root.findAllByType(Text).find((n: any) => n.props.children === "trigger").props.onPress();
    });
    expect(tree.root.findAllByType(Text).map((n: any) => n.props.children)).toContain("Will disappear");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(tree.root.findAllByType(Text).map((n: any) => n.props.children)).not.toContain("Will disappear");
  });

  it("fires a notification haptic for success/warning/error but not info", () => {
    const tree = render(
      <Wrapper>
        <Trigger message="info toast" variant="info" />
      </Wrapper>,
    );
    act(() => {
      tree.root.findAllByType(Text).find((n: any) => n.props.children === "trigger").props.onPress();
    });
    expect(haptics.notification).not.toHaveBeenCalled();

    const errorTree = render(
      <Wrapper>
        <Trigger message="error toast" variant="error" />
      </Wrapper>,
    );
    act(() => {
      errorTree.root.findAllByType(Text).find((n: any) => n.props.children === "trigger").props.onPress();
    });
    expect(haptics.notification).toHaveBeenCalledWith("error");
  });
});
