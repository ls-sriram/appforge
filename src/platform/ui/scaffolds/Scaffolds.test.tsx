import fs from "fs";
import path from "path";
import React from "react";
import { Text, View } from "react-native";
import TestRenderer, { act } from "react-test-renderer";
import { ThemeProvider } from "../theme/ThemeProvider";
import { ViewportProvider } from "../theme/ViewportProvider";
import { createUi } from "../viz";
import { CenteredPageScaffold, PageScaffold } from "./Scaffolds";

jest.mock("react-native", () => {
  const React = require("react");
  const makeComponent = (name: string) => ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(name, props, children);

  return {
    View: makeComponent("View"),
    Text: makeComponent("Text"),
    ScrollView: makeComponent("ScrollView"),
    useWindowDimensions: () => ({ width: 1280, height: 800 }),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) => React.createElement(View, props, children),
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ViewportProvider
        value={{
          width: 1280,
          height: 800,
          tier: "desktop",
          isMobile: false,
          isTablet: false,
          isDesktop: true,
        }}
      >
        {children}
      </ViewportProvider>
    </ThemeProvider>
  );
}

function renderScaffold(element: React.ReactElement) {
  let tree: any = null;

  act(() => {
    tree = TestRenderer.create(element);
  });

  return tree as any;
}

function findByTestId(tree: any, testID: string) {
  return tree.root.findAll((node: any) => node.props.testID === testID);
}

function findHostText(tree: any, text: string) {
  return tree.root.findAll((node: any) => node.type === "Text" && node.props.children === text);
}

describe("CenteredPageScaffold", () => {
  it("renders content and optional header and footer slots", () => {
    const tree = renderScaffold(
      <Wrapper>
        <CenteredPageScaffold
          content={<Text>Content</Text>}
          footer={<Text>Footer</Text>}
          header={<Text>Header</Text>}
          ui={createUi("centered")}
        />
      </Wrapper>,
    );

    expect(findByTestId(tree, "centered.header").length).toBeGreaterThan(0);
    expect(findByTestId(tree, "centered.content").length).toBeGreaterThan(0);
    expect(findByTestId(tree, "centered.footer").length).toBeGreaterThan(0);
    expect(findHostText(tree, "Header")).toHaveLength(1);
    expect(findHostText(tree, "Content")).toHaveLength(1);
    expect(findHostText(tree, "Footer")).toHaveLength(1);
  });

  it("keeps width bounded to the finite width contract", () => {
    const tree = renderScaffold(
      <Wrapper>
        <CenteredPageScaffold
          content={<Text>Content</Text>}
          ui={createUi("centered")}
          width="regular"
        />
      </Wrapper>,
    );

    const well = findByTestId(tree, "centered.well")[0];
    expect(well.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: "100%" }),
        expect.objectContaining({ maxWidth: 640 }),
      ]),
    );
  });

  it("is exported from the scaffold barrel", () => {
    const barrelSource = fs.readFileSync(path.join(__dirname, "index.ts"), "utf8");

    expect(barrelSource).toContain("CenteredPageScaffold");
    expect(barrelSource).toContain("PageScaffold");
  });

  it("keeps the root scroll scaffold structure", () => {
    const tree = renderScaffold(
      <Wrapper>
        <CenteredPageScaffold content={<Text>Content</Text>} ui={createUi("centered")} />
      </Wrapper>,
    );

    expect(findByTestId(tree, "centered.root").length).toBeGreaterThan(0);
    expect(tree.root.findAllByType(View).length).toBeGreaterThan(0);
  });
});

describe("PageScaffold", () => {
  it("keeps sidebar placement explicit on desktop surfaces", () => {
    const tree = renderScaffold(
      <Wrapper>
        <PageScaffold
          content={<Text>Content</Text>}
          sidebar={<Text>Navigation</Text>}
          sidebarPlacement="right"
          ui={createUi("page")}
        />
      </Wrapper>,
    );

    const content = findByTestId(tree, "page.content")[0];
    const sidebar = tree.root.findAll((node: any) => node.props["data-uiid"] === "page.sidebar")[0];
    const body = content.parent;
    const contentIndex = body.children.indexOf(content);
    const sidebarIndex = body.children.indexOf(sidebar);

    expect(contentIndex).toBeGreaterThanOrEqual(0);
    expect(sidebarIndex).toBeGreaterThan(contentIndex);
    expect(body.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ flexDirection: "row" })]));
  });
});
