import type { Theme as GeneratedTheme } from "./factory";
import type { LayoutContract, Variants } from "../contracts";

type Primitive = string | number | boolean | null | undefined;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Primitive ? T[K]
    : T[K] extends Array<infer U> ? Array<DeepPartial<U>>
    : DeepPartial<T[K]>;
};

export type ThemeDefinition = GeneratedTheme;
export type ThemePaletteDefinition = ThemeDefinition["palette"];
export type ThemePaletteOverride = DeepPartial<ThemePaletteDefinition>;
export type ThemeSpacingOverride = DeepPartial<ThemeDefinition["spacing"]>;
export type ThemeTypographyOverride = DeepPartial<ThemeDefinition["typography"]>;
export type ThemeRadiiOverride = DeepPartial<ThemeDefinition["radii"]>;
export type ThemeBreakpointsOverride = DeepPartial<ThemeDefinition["breakpoints"]>;
export type LayoutsOverride = Record<string, DeepPartial<LayoutContract>>;
export type VariantsOverride = DeepPartial<Variants>;

// Legacy aliases
export type ThemeColorDefinition = ThemePaletteDefinition;
export type ThemeColorOverride = ThemePaletteOverride;

export interface ThemeOverride {
  palette?: ThemePaletteOverride;
  spacing?: ThemeSpacingOverride;
  typography?: ThemeTypographyOverride;
  radii?: ThemeRadiiOverride;
  breakpoints?: ThemeBreakpointsOverride;
}

export interface UiRuntimeOverride {
  layouts?: LayoutsOverride;
  variants?: VariantsOverride;
}

export type UiOverride = ThemeOverride & UiRuntimeOverride;
