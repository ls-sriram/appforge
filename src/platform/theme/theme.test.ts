/**
 * Theme tests — verifies token values and provider behavior.
 */

import React from "react";
import { renderHook } from "@testing-library/react-native";
import { applyThemeOverride, theme } from "./index";
import { ThemeProvider, useTheme } from "./ThemeProvider";

describe("ThemeProvider", () => {
  it("provides the default theme via useTheme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.bg).toBe("#0A0A0A");
    expect(result.current.colors.surface).toBe("#111111");
    expect(result.current.colors.primary).toBe("#4F8EF7");
  });

  it("provides default text colors", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.textPrimary).toBe("#F2F2F2");
    expect(result.current.colors.textSecondary).toBe("#A3A3A3");
    expect(result.current.colors.textMuted).toBe("#525252");
  });

  it("provides status colors", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.success).toBe("#34D399");
    expect(result.current.colors.warning).toBe("#F59E0B");
    expect(result.current.colors.error).toBe("#F87171");
    expect(result.current.colors.info).toBe("#22D3EE");
  });

  it("provides spacing tokens", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.space.xs).toBe(6);
    expect(result.current.colors.space.sm).toBe(10);
    expect(result.current.colors.space.md).toBe(16);
    expect(result.current.colors.space.lg).toBe(22);
    expect(result.current.colors.space.xl).toBe(30);
  });

  it("applies nested theme overrides without changing schema", () => {
    const nextTheme = applyThemeOverride(theme, {
      colors: {
        primary: "#123456",
        state: {
          hover: "rgba(1,2,3,0.4)",
        },
        layout: {
          maxContentWidth: 720,
        },
      },
    });

    expect(nextTheme.colors.primary).toBe("#123456");
    expect(nextTheme.colors.state.hover).toBe("rgba(1,2,3,0.4)");
    expect(nextTheme.colors.layout.maxContentWidth).toBe(720);
    expect(nextTheme.colors.layout.pagePadding).toBe(theme.colors.layout.pagePadding);
    expect(nextTheme.shapes.button.primary.backgroundColor).toBe("#123456");
  });

  it("accepts provider-level theme overrides", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement(ThemeProvider, {
      override: { colors: { primary: "#654321" } },
      children,
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.colors.primary).toBe("#654321");
    expect(result.current.shapes.button.primary.backgroundColor).toBe("#654321");
  });
});
