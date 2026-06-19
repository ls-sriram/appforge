/**
 * Theme tests — verifies token values and provider behavior.
 */

import { renderHook } from "@testing-library/react-native";
import { ThemeProvider, useTheme } from "@theme/ThemeProvider";

describe("ThemeProvider", () => {
  it("provides the default theme via useTheme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.bg).toBe("#F5F8FF");
    expect(result.current.colors.surface).toBe("#FFFFFF");
    expect(result.current.colors.primary).toBe("#2558D4");
  });

  it("provides light mode text colors", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.textPrimary).toBe("#0F172A");
    expect(result.current.colors.textSecondary).toBe("#334155");
    expect(result.current.colors.textMuted).toBe("#64748B");
  });

  it("provides status colors", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.success).toBe("#237A49");
    expect(result.current.colors.warning).toBe("#A8681A");
    expect(result.current.colors.error).toBe("#C03228");
    expect(result.current.colors.info).toBe("#0E7490");
  });

  it("provides spacing tokens", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.space.xs).toBe(4);
    expect(result.current.colors.space.sm).toBe(8);
    expect(result.current.colors.space.md).toBe(16);
    expect(result.current.colors.space.lg).toBe(24);
    expect(result.current.colors.space.xl).toBe(40);
  });
});
