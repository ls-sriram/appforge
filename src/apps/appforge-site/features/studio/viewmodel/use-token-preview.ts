/**
 * ViewModel — owns the scoped theme-preview state for the UI Playground.
 *
 * Built only from `ThemeOptions` (the same finite shape `createAppTheme`
 * already accepts as the app's "edit design globally" primitive). The
 * resulting theme is meant to be applied to a local ThemeProvider wrapping
 * only the preview canvas, never the rest of the app.
 */
import React from "react";
import { createAppTheme, type Theme } from "../../../../../theme";

export interface TokenPreviewOptions {
  primary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  bg: string;
  dark: boolean;
  radiusScale: number;
}

export const RADIUS_SCALE_OPTIONS = [0.5, 1, 1.45, 2] as const;

export const BG_PRESETS = [
  { label: "Light",  value: "#FFFFFF" },
  { label: "Warm",   value: "#F5F0E8" },
  { label: "Slate",  value: "#1E2433" },
  { label: "Dark",   value: "#0F111A" },
  { label: "Black",  value: "#000000" },
] as const;

export const BRAND_SWATCHES: {
  key: keyof Pick<TokenPreviewOptions, "primary" | "success" | "warning" | "error" | "info">;
  label: string;
  values: string[];
}[] = [
  { key: "primary", label: "Primary", values: ["#2558D4", "#7C3AED", "#0EA5A0", "#E11D48"] },
  { key: "success", label: "Success", values: ["#237A49", "#16A34A", "#0D9488"] },
  { key: "warning", label: "Warning", values: ["#A8681A", "#D97706", "#B45309"] },
  { key: "error",   label: "Error",   values: ["#C03228", "#DC2626", "#9B1C1C"] },
  { key: "info",    label: "Info",    values: ["#0E7490", "#2563EB", "#0891B2"] },
];

const DEFAULT_OPTIONS: TokenPreviewOptions = {
  primary: "#2558D4",
  success: "#237A49",
  warning: "#A8681A",
  error: "#C03228",
  info: "#0E7490",
  bg: "#FFFFFF",
  dark: false,
  radiusScale: 1.45,
};

export interface TokenPreviewState {
  options: TokenPreviewOptions;
  previewTheme: Theme;
  setBrandColor: (key: keyof Pick<TokenPreviewOptions, "primary" | "success" | "warning" | "error" | "info">, value: string) => void;
  setBg: (bg: string) => void;
  setDark: (dark: boolean) => void;
  setRadiusScale: (scale: number) => void;
  reset: () => void;
}

export function useTokenPreview(): TokenPreviewState {
  const [options, setOptions] = React.useState<TokenPreviewOptions>(DEFAULT_OPTIONS);

  const previewTheme = React.useMemo(
    () =>
      createAppTheme(
        {
          brand: {
            primary: options.primary,
            success: options.success,
            warning: options.warning,
            error: options.error,
            info: options.info,
          },
          dark: options.dark,
          radiusScale: options.radiusScale,
        },
        { bg: options.bg },
      ),
    [options],
  );

  const setBrandColor = React.useCallback((key: keyof Pick<TokenPreviewOptions, "primary" | "success" | "warning" | "error" | "info">, value: string) => {
    setOptions((o) => ({ ...o, [key]: value }));
  }, []);

  const setBg = React.useCallback((bg: string) => setOptions((o) => ({ ...o, bg })), []);
  const setDark = React.useCallback((dark: boolean) => setOptions((o) => ({ ...o, dark })), []);
  const setRadiusScale = React.useCallback((radiusScale: number) => setOptions((o) => ({ ...o, radiusScale })), []);
  const reset = React.useCallback(() => setOptions(DEFAULT_OPTIONS), []);

  return { options, previewTheme, setBrandColor, setBg, setDark, setRadiusScale, reset };
}
