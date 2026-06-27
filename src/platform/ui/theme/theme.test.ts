import React from "react";
import { renderHook } from "@testing-library/react-native";
import { applyThemeOverride, theme } from "./index";
import { ThemeProvider, useTheme } from "./ThemeProvider";

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
    const nextTheme = applyThemeOverride(theme, {
      palette: { primary: "#123456" },
    });

    expect(nextTheme.palette.primary).toBe("#123456");
    expect(nextTheme.variants.button!.primary.backgroundColor).toBe("#123456");
    expect(nextTheme.spacing.md).toBe(theme.spacing.md);
  });

  it("accepts provider-level theme overrides", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(ThemeProvider, {
      override: { palette: { primary: "#654321" } },
      children,
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.palette.primary).toBe("#654321");
    expect(result.current.variants.button!.primary.backgroundColor).toBe("#654321");
  });
});
