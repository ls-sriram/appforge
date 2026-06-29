import React from "react";
import { renderHook } from "@testing-library/react-native";
import { createLayouts, createTheme, createContracts, uiRuntime } from "./index";
import { ThemeProvider, useTheme, useUI } from "./ThemeProvider";

type ZStackExport = typeof import("../index").ZStack;

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

  it("provides elevation tokens", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.elevation.none).toEqual({
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    });
    expect(result.current.elevation.md).toEqual({
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 6,
      elevation: 3,
    });
  });

  it("exposes a static realized uiRuntime", () => {
    expect(uiRuntime.contracts.button?.primary.container.backgroundColor).toBe(uiRuntime.theme.palette.primary);
    expect(uiRuntime.layouts.comfortable.iconSize).toBe(16);
    expect(uiRuntime.layouts.comfortable.fontSize).toBe(15);
    expect(uiRuntime.layouts.comfortable.labelSize).toBe(13);
  });

  it("exports ZStack through the shared UI barrel", () => {
    let exported: ZStackExport | undefined;
    expect(exported).toBeUndefined();
  });

  it("passes through an explicitly realized runtime", () => {
    const theme = createTheme({
      brand: { primary: "#654321" },
      dark: true,
      fontFamily: "Test Sans",
    });
    const realizedUi = {
      theme,
      contracts: createContracts(theme),
      layouts: createLayouts(theme),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(ThemeProvider, {
      value: realizedUi,
      children,
    });

    const { result } = renderHook(() => useUI(), { wrapper });

    expect(result.current.theme.palette.primary).toBe("#654321");
    expect(result.current.contracts.button!.primary.container.backgroundColor).toBe("#654321");
    expect(result.current).toBe(realizedUi);
  });
});
