import type { Theme as GeneratedTheme } from "./factory";

type Primitive = string | number | boolean | null | undefined;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Primitive ? T[K]
    : T[K] extends Array<infer U> ? Array<DeepPartial<U>>
    : DeepPartial<T[K]>;
};

export type ThemeDefinition = GeneratedTheme;
export type ThemePaletteDefinition = ThemeDefinition["palette"];
export type ThemePaletteOverride = DeepPartial<ThemePaletteDefinition>;

// Legacy aliases
export type ThemeColorDefinition = ThemePaletteDefinition;
export type ThemeColorOverride = ThemePaletteOverride;

export interface ThemeOverride {
  palette?: ThemePaletteOverride;
}
