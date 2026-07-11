import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { usePathname } from "expo-router";
import { NavBarScaffold } from "./nav-bar.scaffold";
import { NavItem } from "./nav-item.block";
import { defaultNavItemStyles } from "./nav-item.styles";
import { routes } from "./routes";

jest.mock("expo-router", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("react-native", () => {
  const React = require("react");
  const makeComponent = (name: string) => ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(name, props, children);

  return {
    View: makeComponent("View"),
    Text: makeComponent("Text"),
  };
});

jest.mock("../ui", () => {
  const React = require("react");
  const makeComponent = (name: string) => ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(name, props, children);

  return {
    noopUi: (() => ({})) as any,
    createUi: (prefix = "") => {
      const stamp = (id: string, label: string) => ({ __uiid: prefix ? `${prefix}.${id}` : id, __uilabel: label });
      (stamp as any).scope = (segment: string) => (require("../ui") as any).createUi(prefix ? `${prefix}.${segment}` : segment);
      return stamp;
    },
    useViewport: jest.fn(),
    pageShell: { sidebarWidth: 232, mobileNavMinWidth: 280, mobileNavMaxWidth: 356 },
    Icon: makeComponent("Icon"),
    Body: makeComponent("Text"),
    Pressable: ({ children, ...props }: any) => {
      const rendered = typeof children === "function" ? children({ pressed: false, hovered: false }) : children;
      return React.createElement("Pressable", props, rendered);
    },
  };
});

const { useViewport } = require("../ui");

const theme = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  typography: {
    family: "",
    mono: "",
    size: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24 },
    weight: { regular: "400", medium: "500", semibold: "600", bold: "700" },
  },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, pill: 999 },
  palette: {
    primary: "#111",
    primaryMuted: "#eee",
    accent: "#222",
    success: "#0a0",
    successMuted: "#efe",
    warning: "#a90",
    warningMuted: "#ffe",
    error: "#a00",
    errorMuted: "#fee",
    info: "#00a",
    infoMuted: "#eef",
    background: "#fff",
    surface: "#fff",
    surfaceStrong: "#eee",
    surfaceAlt: "#eee",
    border: "#ccc",
    borderSubtle: "#ddd",
    borderFocus: "#00f",
    textPrimary: "#000",
    textSecondary: "#333",
    textMuted: "#666",
    textInverse: "#fff",
  },
} as any;

function renderTree(el: React.ReactElement) {
  let tree: any = null;
  act(() => {
    tree = TestRenderer.create(el);
  });
  return tree;
}

function textNode(tree: any, text: string) {
  return tree.root.findAll((node: any) => node.type === "Text" && node.props.children === text)[0];
}

describe("NavBarScaffold", () => {
  const contract = defaultNavItemStyles(theme);

  it("highlights the item matching the current route and dims the rest, laid out as a bar on mobile", () => {
    (useViewport as jest.Mock).mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
    (usePathname as jest.Mock).mockReturnValue(routes.dashboard);

    const tree = renderTree(
      <NavBarScaffold
        items={
          <>
            <NavItem contract={contract} route={routes.dashboard} label="Dashboard" />
            <NavItem contract={contract} route={routes.settings} label="Settings" />
          </>
        }
      />,
    );

    const activeText = textNode(tree, "Dashboard");
    const inactiveText = textNode(tree, "Settings");
    const activeItemView = activeText.parent.parent;
    const inactiveItemView = inactiveText.parent.parent;

    expect(activeText.props.color).toBe(theme.palette.primary);
    expect(activeItemView.props.style.opacity).toBe(1);
    expect(activeItemView.props.style.backgroundColor).toBe(theme.palette.primaryMuted);

    expect(inactiveText.props.color).toBe(theme.palette.textSecondary);
    expect(inactiveItemView.props.style.opacity).toBe(contract.frame.restingOpacity);
    expect(inactiveItemView.props.style.backgroundColor).toBeUndefined();
    const root = tree.root.findAll((node: any) => node.props.testID === undefined && node.type === "View")[0];
    const items = tree.root.findAll((node: any) => node.props.testID === undefined && node.type === "View")[2];
    expect(root.props.style.flexDirection).toBe("row");
    expect(root.props.style.width).toBe("100%");
    expect(items.props.style.flexDirection).toBe("row");
    expect(items.props.style.minWidth).toBe(280);
    expect(items.props.style.maxWidth).toBe(356);
  });

  it("switches to a vertical sidebar layout on wider viewport tiers", () => {
    (useViewport as jest.Mock).mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
    (usePathname as jest.Mock).mockReturnValue(routes.dashboard);

    const tree = renderTree(
      <NavBarScaffold
        ui={(require("../ui") as any).createUi("navbar")}
        items={<NavItem contract={contract} route={routes.dashboard} label="Dashboard" />}
      />,
    );

    const root = tree.root.findAll((node: any) => node.props.testID === "navbar.root")[0];
    expect(root.props.style.flexDirection).toBe("column");
    expect(root.props.style.width).toBe(232);
  });
});
