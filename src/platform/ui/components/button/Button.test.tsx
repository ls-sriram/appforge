import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Button } from "./Button";

const primary = defaultContracts.button!["primary"];

// RN's real ActivityIndicator trips a lazy-stylesheet load-order issue
// under this preset when pulled in outside its own test file (same class
// of problem as TextInput elsewhere in this repo's tests) — stub it
// rather than fight that; it's not what the loading-state tests below
// are actually checking.
jest.mock("react-native/Libraries/Components/ActivityIndicator/ActivityIndicator", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props: any) => React.createElement("ActivityIndicatorProbe", props),
  };
});

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

describe("Button", () => {
  it("derives accessibilityLabel from string children — no explicit label needed for the common case", () => {
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={() => {}}>
          Save changes
        </Button>
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityLabel).toBe("Save changes");
  });

  it("prefers an explicit accessibilityLabel over the children text", () => {
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={() => {}} accessibilityLabel="Save the current document">
          Save
        </Button>
      </Wrapper>,
    );

    expect(findProbe(tree).props.accessibilityLabel).toBe("Save the current document");
  });

  it("is keyboard-focusable now that it composes Pressable", () => {
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={() => {}}>
          Save
        </Button>
      </Wrapper>,
    );

    expect(findProbe(tree).props.tabIndex).toBe(0);
  });

  it("fires onPress on activation", () => {
    const onPress = jest.fn();
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={onPress}>
          Save
        </Button>
      </Wrapper>,
    );

    act(() => {
      findProbe(tree).props.onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("blocks activation and leaves the tab order while loading, same as disabled", () => {
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={() => {}} loading>
          Save
        </Button>
      </Wrapper>,
    );

    const probe = findProbe(tree);
    expect(probe.props.disabled).toBe(true);
    expect(probe.props.tabIndex).toBe(-1);
  });

  it("blocks activation while disabled", () => {
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={() => {}} disabled>
          Save
        </Button>
      </Wrapper>,
    );

    const probe = findProbe(tree);
    expect(probe.props.disabled).toBe(true);
    expect(probe.props.tabIndex).toBe(-1);
  });

  it("swaps the label for a spinner while loading, still on the visible-text-in-children path", () => {
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={() => {}} loading>
          Save
        </Button>
      </Wrapper>,
    );

    expect(tree.root.findAllByType(Text).some((n: any) => n.props.children === "Save")).toBe(false);
  });

  it("renders the label text when not loading", () => {
    const tree = render(
      <Wrapper>
        <Button contract={primary} onPress={() => {}}>
          Save
        </Button>
      </Wrapper>,
    );

    expect(tree.root.findAllByType(Text).some((n: any) => n.props.children === "Save")).toBe(true);
  });

  it("tolerates a missing onPress rather than crashing (matches the prior optional-onPress contract)", () => {
    expect(() =>
      render(
        <Wrapper>
          <Button contract={primary}>Save</Button>
        </Wrapper>,
      ),
    ).not.toThrow();
  });
});
