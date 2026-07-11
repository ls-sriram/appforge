import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { usePathname } from "expo-router";
import { MobileBottomNavScaffold } from "./mobile-bottom-nav.scaffold";
import { MobileBottomNavItem } from "./mobile-bottom-nav-item.block";
import { defaultMobileBottomNavItemStyles, mobileBottomNavChrome } from "./mobile-bottom-nav.styles";
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
    useTheme: () => ({
      radii: { lg: 12 },
      palette: {
        surface: "#ffffff",
        borderSubtle: "#dddddd",
        primary: "#111111",
        primaryMuted: "#eeeeee",
        textSecondary: "#444444",
      },
    }),
    SafeAreaView: makeComponent("SafeAreaView"),
    Pressable: ({ children, ...props }: any) => {
      const rendered = typeof children === "function" ? children({ pressed: false, hovered: false }) : children;
      return React.createElement("Pressable", props, rendered);
    },
    Icon: makeComponent("Icon"),
  };
});

const { createUi, useTheme } = require("../ui");

function renderTree(el: React.ReactElement) {
  let tree: any = null;
  act(() => {
    tree = TestRenderer.create(el);
  });
  return tree;
}

describe("MobileBottomNavScaffold", () => {
  it("renders bottom safe-area chrome with logo and icon-only route items", () => {
    (usePathname as jest.Mock).mockReturnValue(routes.dashboard);
    const contract = defaultMobileBottomNavItemStyles(useTheme());

    const tree = renderTree(
      <MobileBottomNavScaffold
        ui={createUi("mobile-nav")}
        logo={<>{React.createElement("Text", {}, "Logo")}</>}
        items={(
          <>
            <MobileBottomNavItem contract={contract} route={routes.dashboard} icon="home" accessibilityLabel="Home" />
            <MobileBottomNavItem contract={contract} route={routes.settings} icon="user" accessibilityLabel="Profile" />
          </>
        )}
      />,
    );

    const root = tree.root.findAll((node: any) => node.type === "SafeAreaView")[0];
    const rail = tree.root.findAll((node: any) => node.props.testID === "mobile-nav.rail")[0];
    const items = tree.root.findAll((node: any) => node.props.testID === "mobile-nav.items")[0];
    const icons = tree.root.findAll((node: any) => node.type === "Icon");

    expect(root.props.edges).toEqual(["bottom", "left", "right"]);
    expect(rail.props.style.minHeight).toBe(mobileBottomNavChrome.minHeight);
    expect(items.props.style.flexDirection).toBe("row");
    expect(icons).toHaveLength(2);
    expect(icons[0].props.color).toBe(contract.interaction.activeColor);
    expect(icons[1].props.color).toBe(contract.interaction.inactiveColor);
  });
});
