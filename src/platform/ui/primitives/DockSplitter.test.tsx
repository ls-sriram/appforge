import fs from "fs";
import path from "path";
import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { ThemeProvider } from "../theme/ThemeProvider";
import { defaultContracts } from "../theme/index";
import { createUi } from "../viz";
import { DockSplitter } from "./DockSplitter";

const dockSplitterContract = defaultContracts.dockSplitter!["default"];

jest.mock("react-native", () => {
  const React = require("react");
  const makeComponent = (name: string) => ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(name, props, children);

  return {
    View: makeComponent("View"),
    Text: makeComponent("Text"),
    Pressable: makeComponent("Pressable"),
    useWindowDimensions: () => ({ width: 1280, height: 800 }),
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function renderDockSplitter(element: React.ReactElement) {
  let tree: any = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as any;
}

function findInteractiveByTestId(tree: any, testID: string) {
  return tree.root.findAll(
    (node: any) => node.type === "Pressable" && node.props.testID === testID && typeof node.props.onPress === "function",
  );
}

describe("DockSplitter", () => {
  it("renders from the primitive surface", () => {
    const barrelSource = fs.readFileSync(path.join(__dirname, "index.ts"), "utf8");

    expect(barrelSource).toContain("DockSplitter");
    expect(barrelSource).toContain("DockSplitterProps");
  });

  it("emits drag lifecycle callbacks in order", () => {
    const onDragStart = jest.fn();
    const onDrag = jest.fn();
    const onDragEnd = jest.fn();
    const tree = renderDockSplitter(
      <Wrapper>
        <DockSplitter
          contract={dockSplitterContract}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          ui={createUi("splitter")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "splitter.root")[0].props.onPress();
    });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDrag).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragStart.mock.invocationCallOrder[0]).toBeLessThan(onDrag.mock.invocationCallOrder[0]);
    expect(onDrag.mock.invocationCallOrder[0]).toBeLessThan(onDragEnd.mock.invocationCallOrder[0]);
  });

  it("does not emit callbacks when disabled", () => {
    const onDragStart = jest.fn();
    const onDrag = jest.fn();
    const onDragEnd = jest.fn();
    const tree = renderDockSplitter(
      <Wrapper>
        <DockSplitter
          contract={dockSplitterContract}
          disabled
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          ui={createUi("splitter")}
        />
      </Wrapper>,
    );

    act(() => {
      findInteractiveByTestId(tree, "splitter.root")[0].props.onPress();
    });

    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDrag).not.toHaveBeenCalled();
    expect(onDragEnd).not.toHaveBeenCalled();
  });
});
