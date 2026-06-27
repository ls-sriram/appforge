import React from "react";
import { renderHook } from "@testing-library/react-native";
import { applyThemeOverride, applyUiOverride, uiRuntime } from "./index";
import { ThemeProvider, useTheme, useUI } from "./ThemeProvider";

describe("ThemeProvider", () => {
  it("provides the default theme via useTheme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.palette.background).toBe("#0A0A0A");
    expect(result.current.palette.surface).toBe("#111111");
    expect(result.current.palette.primary).toBe("#4F8EF7");
  });

  it("provides default text colors", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.palette.textPrimary).toBe("#F2F2F2");
    expect(result.current.palette.textSecondary).toBe("#A3A3A3");
    expect(result.current.palette.textMuted).toBe("#525252");
  });

  it("provides status colors", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.palette.success).toBe("#34D399");
    expect(result.current.palette.warning).toBe("#F59E0B");
    expect(result.current.palette.error).toBe("#F87171");
    expect(result.current.palette.info).toBe("#22D3EE");
  });

  it("provides spacing tokens", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.spacing.xs).toBe(6);
    expect(result.current.spacing.sm).toBe(10);
    expect(result.current.spacing.md).toBe(16);
    expect(result.current.spacing.lg).toBe(22);
    expect(result.current.spacing.xl).toBe(30);
  });

  it("applies palette overrides and rebuilds variants", () => {
    const nextUi = applyThemeOverride(uiRuntime, {
      palette: { primary: "#123456" },
    });

    expect(nextUi.theme.palette.primary).toBe("#123456");
    expect(nextUi.variants.button!.primary.backgroundColor).toBe("#123456");
    expect(nextUi.theme.spacing.md).toBe(uiRuntime.theme.spacing.md);
  });

  it("applies token, layout, and variant overrides together", () => {
    const nextUi = applyUiOverride(uiRuntime, {
      spacing: { md: 24 },
      typography: { family: "Test Sans", size: { md: 17 } },
      radii: { pill: 777 },
      breakpoints: { desktop: 1440 },
      layouts: { comfortable: { panelPadding: 99 } },
      variants: { button: { primary: { minHeight: 88 } } },
    });

    expect(nextUi.theme.spacing.md).toBe(24);
    expect(nextUi.theme.typography.family).toBe("Test Sans");
    expect(nextUi.theme.typography.size.md).toBe(17);
    expect(nextUi.theme.radii.pill).toBe(777);
    expect(nextUi.theme.breakpoints.desktop).toBe(1440);
    expect(nextUi.layouts.comfortable.panelPadding).toBe(99);
    expect(nextUi.variants.button!.primary.minHeight).toBe(88);
    expect(nextUi.variants.button!.primary.paddingHorizontal).not.toBeUndefined();
  });

  it("accepts provider-level theme overrides", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(ThemeProvider, {
      override: { palette: { primary: "#654321" } },
      children,
    });

    const { result } = renderHook(() => useUI(), { wrapper });

    expect(result.current.theme.palette.primary).toBe("#654321");
    expect(result.current.variants.button!.primary.backgroundColor).toBe("#654321");
  });
});
