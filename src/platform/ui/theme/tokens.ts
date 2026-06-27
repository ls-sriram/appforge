/**
 * ─────────────────────────────────────────────────────────────────
 * LAYOUT TOKENS — Section, grid, and spacing primitives.
 *
 * These supplement the theme with layout-specific constants
 * used across layouts, shells, features, and pages.
 * ─────────────────────────────────────────────────────────────────
 */

// ─── Section Layout ──────────────────────────────────────────────

export const section = {
  paddingHorizontal: 16,
  gap: 24,
  headerGap: 12,
  cardGap: 12,
  maxWidth: 960,
} as const;

// ─── Content Max-Widths ──────────────────────────────────────────
// Named layout widths for page-level content columns. Use these
// instead of raw pixel values in layouts and pages.

export const contentWidths = {
  xs: 320,
  narrow: 480,
  regular: 640,
  wide: 960,
} as const;

export const workspaceShell = {
  sidebarWidth: 232,
  mobileNavMinWidth: 280,
  mobileNavMaxWidth: 356,
} as const;

// ─── Workspace Grid ──────────────────────────────────────────────

export const grid = {
  mobileCols: 1,
  tabletCols: 2,
  desktopCols: 4,
  gap: 12,
  metricMinHeight: 100,
} as const;

// ─── Onboarding ──────────────────────────────────────────────────

export const onboarding = {
  dotSize: 8,
  dotActiveSize: 24,
  dotGap: 6,
  maxContentWidth: 400,
  illustrationHeight: 200,
  stepCount: 4,
} as const;

// ─── Animation Durations (ms) ───────────────────────────────────

export const anim = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

// ─── Z-Index equivalents (elevation on RN) ─────────────────────

export const elevation = {
  base: 0,
  raised: 1,
  card: 2,
  dropdown: 3,
  sticky: 4,
  overlay: 5,
  modal: 10,
  toast: 20,
} as const;

// ─── Icon Sizes ─────────────────────────────────────────────────

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

// ─── Border Widths ──────────────────────────────────────────────

export const borderWidths = {
  none: 0,
  thin: 0.5,
  normal: 1,
  thick: 2,
} as const;

// ─── Opacity Levels ─────────────────────────────────────────────

export const opacity = {
  disabled: 0.5,
  overlay: 0.6,
  backdrop: 0.8,
} as const;
