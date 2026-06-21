import type { Theme as GeneratedTheme } from "./factory";

type Primitive = string | number | boolean | null | undefined;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Primitive ? T[K]
    : T[K] extends Array<infer U> ? Array<DeepPartial<U>>
    : DeepPartial<T[K]>;
};

export type ThemeDefinition = GeneratedTheme;
export type ThemeColorDefinition = ThemeDefinition["colors"];
export type ThemeColorOverride = DeepPartial<ThemeColorDefinition>;

export interface ThemeOverride {
  colors?: ThemeColorOverride;
}
