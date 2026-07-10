import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { defaultContracts } from "../../theme/index";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { MultiSelect } from "./MultiSelect";

const multiSelectContract = defaultContracts.multiSelect!["default"];

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

// Same disambiguation as Select.test.tsx: MultiSelect composes the
// platform Pressable, which wraps RN's own Pressable — both named
// "Pressable" and both forward testID, so accessibilityRole (set only by
// the inner RN-level node) is what uniquely picks the real one out.
function findByTestID(tree: any, testID: string) {
  return tree.root.findAll(
    (node: any) => node.props.testID === testID && typeof node.props.accessibilityRole === "string",
  )[0];
}

function menuExists(tree: any, testID: string) {
  return tree.root.findAll((node: any) => node.props.testID === testID).length > 0;
}

const options = [
  { label: "Draft", value: "draft" },
  { label: "In review", value: "review" },
  { label: "Archived", value: "archived", disabled: true },
];

describe("MultiSelect", () => {
  it("toggles a value into the selection on activation, without closing the menu", () => {
    const onValueChange = jest.fn();
    const tree = render(
      <Wrapper>
        <MultiSelect contract={multiSelectContract} options={options} value={[]} onValueChange={onValueChange} testID="ms" />
      </Wrapper>,
    );

    act(() => {
      findByTestID(tree, "ms-trigger").props.onPress();
    });
    act(() => {
      findByTestID(tree, "ms-option-review").props.onPress();
    });

    expect(onValueChange).toHaveBeenCalledWith(["review"]);
    expect(menuExists(tree, "ms-menu")).toBe(true);
  });

  it("toggles a value back out of the selection when already selected", () => {
    const onValueChange = jest.fn();
    const tree = render(
      <Wrapper>
        <MultiSelect contract={multiSelectContract} options={options} value={["draft", "review"]} onValueChange={onValueChange} testID="ms" />
      </Wrapper>,
    );

    act(() => {
      findByTestID(tree, "ms-trigger").props.onPress();
    });
    act(() => {
      findByTestID(tree, "ms-option-draft").props.onPress();
    });

    expect(onValueChange).toHaveBeenCalledWith(["review"]);
  });

  it("marks each selected option's accessibilityState independently", () => {
    const tree = render(
      <Wrapper>
        <MultiSelect contract={multiSelectContract} options={options} value={["review"]} onValueChange={() => {}} testID="ms" />
      </Wrapper>,
    );

    act(() => {
      findByTestID(tree, "ms-trigger").props.onPress();
    });

    expect(findByTestID(tree, "ms-option-draft").props.accessibilityState.selected).toBe(false);
    expect(findByTestID(tree, "ms-option-review").props.accessibilityState.selected).toBe(true);
  });

  it("blocks a disabled option and keeps it out of the tab order", () => {
    const tree = render(
      <Wrapper>
        <MultiSelect contract={multiSelectContract} options={options} value={[]} onValueChange={() => {}} testID="ms" />
      </Wrapper>,
    );

    act(() => {
      findByTestID(tree, "ms-trigger").props.onPress();
    });

    const archived = findByTestID(tree, "ms-option-archived");
    expect(archived.props.disabled).toBe(true);
    expect(archived.props.tabIndex).toBe(-1);
  });

  it("is keyboard-focusable on the trigger now that it composes Pressable", () => {
    const tree = render(
      <Wrapper>
        <MultiSelect contract={multiSelectContract} options={options} value={[]} onValueChange={() => {}} testID="ms" />
      </Wrapper>,
    );

    expect(findByTestID(tree, "ms-trigger").props.tabIndex).toBe(0);
  });

  it("exposes expanded state on the trigger", () => {
    const tree = render(
      <Wrapper>
        <MultiSelect contract={multiSelectContract} options={options} value={[]} onValueChange={() => {}} testID="ms" />
      </Wrapper>,
    );

    expect(findByTestID(tree, "ms-trigger").props.accessibilityState.expanded).toBe(false);

    act(() => {
      findByTestID(tree, "ms-trigger").props.onPress();
    });

    expect(findByTestID(tree, "ms-trigger").props.accessibilityState.expanded).toBe(true);
  });
});
