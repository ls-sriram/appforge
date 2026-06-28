import { createTheme } from "./factory";
import type {
  DeepPartial,
  ThemeDefinition,
  ThemeOverride,
  UiRuntimeOverride,
  UiOverride,
} from "./contracts";
import { tokens } from "./defaults";
import { createLayouts } from "./layouts";
import { createVariants } from "./variants";
import type { Variants, LayoutContract } from "../contracts";

export interface UiRuntime {
  theme: ThemeDefinition;
  variants: Variants;
  layouts: Record<string, LayoutContract>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDefined<T>(base: T, override?: DeepPartial<T>): T {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override as T;
  const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const ov = (override as Record<string, unknown>)[key];
    if (ov === undefined) continue;
    const bv = merged[key];
    merged[key] = isPlainObject(bv) && isPlainObject(ov)
      ? mergeDefined(bv, ov as DeepPartial<typeof bv>)
      : ov;
  }
  return merged as T;
}

export function createUiRuntime(
  theme: ThemeDefinition,
  variantOverrides?: Partial<Variants>,
  layoutOverrides?: Record<string, DeepPartial<LayoutContract>>,
): UiRuntime {
  const base: UiRuntime = {
    theme,
    variants: createVariants(theme),
    layouts: createLayouts(theme),
  };
  if (!variantOverrides && !layoutOverrides) return base;
  return {
    ...base,
    variants: variantOverrides ? mergeDefined(base.variants, variantOverrides) : base.variants,
    layouts: layoutOverrides ? mergeDefined(base.layouts, layoutOverrides) : base.layouts,
  };
}

export const uiRuntime = createUiRuntime(tokens);

// Backwards-compatible alias while consumers migrate to UiRuntime naming.
export const theme = uiRuntime;

export function applyThemeOverride(baseUi: UiRuntime, override?: ThemeOverride): UiRuntime {
  if (!override) return baseUi;
  const nextTheme: ThemeDefinition = {
    ...baseUi.theme,
    palette: mergeDefined(baseUi.theme.palette, override.palette),
    spacing: mergeDefined(baseUi.theme.spacing, override.spacing),
    typography: mergeDefined(baseUi.theme.typography, override.typography),
    radii: mergeDefined(baseUi.theme.radii, override.radii),
    elevation: mergeDefined(baseUi.theme.elevation, override.elevation),
    breakpoints: mergeDefined(baseUi.theme.breakpoints, override.breakpoints),
  };
  return createUiRuntime(nextTheme);
}

export function applyUiRuntimeOverride(baseUi: UiRuntime, override?: UiRuntimeOverride): UiRuntime {
  if (!override) return baseUi;
  return createUiRuntime(
    baseUi.theme,
    override.variants as Partial<Variants> | undefined,
    override.layouts,
  );
}

export function applyUiOverride(baseUi: UiRuntime, override?: UiOverride): UiRuntime {
  if (!override) return baseUi;
  return applyUiRuntimeOverride(applyThemeOverride(baseUi, override), override);
}

export function createAppUiRuntime(
  options: Parameters<typeof createTheme>[0],
  override?: UiOverride,
  variantOverrides?: Partial<Variants>,
  layoutOverrides?: Record<string, DeepPartial<LayoutContract>>,
): UiRuntime {
  const baseTheme = createTheme(options);
  const withOverrides = applyUiOverride(createUiRuntime(baseTheme), override);
  if (!variantOverrides && !layoutOverrides) return withOverrides;
  return {
    ...withOverrides,
    variants: variantOverrides ? mergeDefined(withOverrides.variants, variantOverrides) : withOverrides.variants,
    layouts: layoutOverrides ? mergeDefined(withOverrides.layouts, layoutOverrides) : withOverrides.layouts,
  };
}

// Backwards-compatible alias while callers migrate from createAppTheme().
export const createAppTheme = createAppUiRuntime;
