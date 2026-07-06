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
    (node: any) => node.type === "View" && node.props.testID === testID && typeof node.props.onMouseDown === "function",
  );
}

describe("DockSplitter", () => {
  it("renders from the primitive surface", () => {
    const barrelSource = fs.readFileSync(path.join(__dirname, "index.ts"), "utf8");

    expect(barrelSource).toContain("DockSplitter");
    expect(barrelSource).toContain("DockSplitterProps");
  });

  it("emits drag lifecycle callbacks and signed deltas in order", () => {
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
      const splitter = findInteractiveByTestId(tree, "splitter.root")[0].props;
      splitter.onMouseDown({ clientX: 100 });
      splitter.onMouseMove({ clientX: 112 });
      splitter.onMouseMove({ clientX: 107 });
      splitter.onMouseUp({ clientX: 107 });
    });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDrag).toHaveBeenNthCalledWith(1, 12, { clientX: 112 });
    expect(onDrag).toHaveBeenNthCalledWith(2, -5, { clientX: 107 });
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
      const splitter = findInteractiveByTestId(tree, "splitter.root")[0].props;
      splitter.onMouseDown({ clientX: 100 });
      splitter.onMouseMove({ clientX: 120 });
      splitter.onMouseUp({ clientX: 120 });
    });

    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDrag).not.toHaveBeenCalled();
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it("supports horizontal dragging through pointer events", () => {
    const onDrag = jest.fn();
    const onDragEnd = jest.fn();
    const tree = renderDockSplitter(
      <Wrapper>
        <DockSplitter
          contract={dockSplitterContract}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          orientation="horizontal"
          ui={createUi("splitter")}
        />
      </Wrapper>,
    );

    act(() => {
      const splitter = findInteractiveByTestId(tree, "splitter.root")[0].props;
      splitter.onPointerDown({ clientY: 80 });
      splitter.onPointerMove({ clientY: 92 });
      splitter.onPointerUp({ clientY: 92 });
    });

    expect(onDrag).toHaveBeenCalledWith(12, { clientY: 92 });
    expect(onDragEnd).toHaveBeenCalledWith({ clientY: 92 });
  });
});
