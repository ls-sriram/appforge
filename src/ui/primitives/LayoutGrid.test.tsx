/**
 * LayoutGrid tests — verifies column distribution and width intent.
 */

import React from "react";
import { View } from "react-native";
import { useViewport } from "../../theme/Viewport";
import { LayoutGrid } from "./LayoutGrid";

const renderer = require("react-test-renderer");

jest.mock("../../theme/Viewport", () => ({
  useViewport: jest.fn(),
}));

const mockedUseViewport = useViewport as jest.MockedFunction<typeof useViewport>;

describe("LayoutGrid", () => {
  it("uses one column on mobile", () => {
    mockedUseViewport.mockReturnValue({
      width: 375,
      height: 812,
      tier: "mobile",
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isWide: false,
    });
    const tree = renderer.create(
      <LayoutGrid>
        <View />
        <View />
      </LayoutGrid>,
    ).root;

    const wrappers = tree.findAllByType(View);
    expect(wrappers[1].props.style.width).toBe("100%");
    expect(wrappers[2].props.style.width).toBe("100%");
  });

  it("caps width when narrow", () => {
    mockedUseViewport.mockReturnValue({
      width: 900,
      height: 900,
      tier: "tablet",
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isWide: false,
    });
    const tree = renderer.create(
      <LayoutGrid width="narrow">
        <View />
      </LayoutGrid>,
    ).root;

    expect(tree.findAllByType(View)[0].props.style.maxWidth).toBe(500);
  });

  it("does not cap width when full", () => {
    mockedUseViewport.mockReturnValue({
      width: 900,
      height: 900,
      tier: "tablet",
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isWide: false,
    });
    const tree = renderer.create(
      <LayoutGrid width="full">
        <View />
      </LayoutGrid>,
    ).root;

    expect(tree.findAllByType(View)[0].props.style.maxWidth).toBeUndefined();
  });

  it("applies custom gap", () => {
    mockedUseViewport.mockReturnValue({
      width: 900,
      height: 900,
      tier: "tablet",
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isWide: false,
    });
    const tree = renderer.create(
      <LayoutGrid gap={16}>
        <View />
      </LayoutGrid>,
    ).root;

    const wrappers = tree.findAllByType(View);
    expect(wrappers[0].props.style.gap).toBe(16);
    expect(wrappers[1].props.style.gap).toBe(8);
  });
});
