/**
 * ─────────────────────────────────────────────────────────────────
 * BLOCK — Universal composition primitive.
 *
 * Every non-leaf UI element is a Block. A Block is exactly:
 *   frame  — how it occupies space (fill, shrink, center)
 *   paint  — visual surface (bg + border + radius + padding)
 *   layout — how children are arranged (direction, space, align)
 *   pad    — explicit inner padding when paint is none
 *   children — other Blocks or Primitives
 *
 * There is no `style` prop. Every visual decision is a named token.
 * If something can't be expressed here, it belongs in a Primitive.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { borderWidths } from "../../theme/tokens";

// ── Vocabulary ────────────────────────────────────────────────────

export type FrameVariant =
  | "fill"    // flex: 1
  | "shrink"  // flexShrink: 0, alignSelf: flex-start
  | "center"  // centered in parent, no flex
  | "expand"  // width: "100%", alignSelf: stretch
  | "fluid";  // flex: 1, minWidth: 0 — for text inside row containers

export type PaintVariant =
  // ── Panel cards ──────────────────────────────────────────────
  | "none"
  | "page"
  | "wash"   // surfaceWash bg, no border
  | "panel"
  | "panel-muted"
  | "panel-strong"
  | "panel-subtle"
  | "panel-inverse"
  | "selected"
  | "neutral"
  | "danger"
  // ── Chip / pill surfaces (→ extract to ScorePill / Chip) ─────
  | "chip-success"
  | "chip-warning"
  | "chip-danger"
  | "chip-info"
  // ── Table surfaces (→ extract to TableRow) ───────────────────
  | "table"
  | "table-row"
  | "table-row-selected"
;

// "all" → top + bottom edges; "top" / "bottom" → single edge
export type SafeAreaEdge = "all" | "top" | "bottom";

export type SpaceToken =
  | "none" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type DirectionVariant = "vertical" | "horizontal";
export type AlignToken       = "stretch" | "center" | "start" | "end";
export type JustifyToken     = "start" | "center" | "end" | "space-between" | "space-around";

// ── Props ─────────────────────────────────────────────────────────

export interface BlockProps {
  // How this block occupies space in its parent
  frame?: FrameVariant;

  // Visual surface treatment — bg + border + radius + default padding
  paint?: PaintVariant;

  // How children are arranged
  direction?: DirectionVariant;
  space?: SpaceToken;
  align?: AlignToken;
  justify?: JustifyToken;
  wrap?: boolean;

  // Explicit inner padding — overrides paint's default padding
  // Use when paint="none" and you need spacing, or to override a paint default
  pad?: SpaceToken;
  padH?: SpaceToken;
  padV?: SpaceToken;

  // Clipping — structural, not aesthetic
  overflow?: "hidden" | "visible";

  // Safe-area inset — wraps this Block in SafeAreaView with the given edge(s).
  // Use on full-screen root blocks that sit directly under a route entry.
  safeArea?: SafeAreaEdge;

  children?: React.ReactNode;

  // Safe pass-throughs — no style
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: React.ComponentProps<typeof View>["accessibilityRole"];
  accessibilityState?: React.ComponentProps<typeof View>["accessibilityState"];
  onLayout?: React.ComponentProps<typeof View>["onLayout"];
  onTouchEnd?: React.ComponentProps<typeof View>["onTouchEnd"];
  pointerEvents?: React.ComponentProps<typeof View>["pointerEvents"];
}

// ── Style resolvers ───────────────────────────────────────────────

function resolveSpace(token: SpaceToken, theme: ReturnType<typeof useTheme>): number {
  if (token === "none") return 0;
  return theme.colors.space[token as keyof typeof theme.colors.space];
}

function resolveAlign(a: AlignToken): "stretch" | "center" | "flex-start" | "flex-end" {
  if (a === "start") return "flex-start";
  if (a === "end")   return "flex-end";
  return a;
}

function resolveJustify(j: JustifyToken): "flex-start" | "center" | "flex-end" | "space-between" | "space-around" {
  if (j === "start") return "flex-start";
  if (j === "end")   return "flex-end";
  return j;
}

function getFrameStyle(frame?: FrameVariant) {
  switch (frame) {
    case "fill":   return { flex: 1 } as const;
    case "fluid":  return { flex: 1, minWidth: 0 } as const;
    case "shrink": return { flexShrink: 0, alignSelf: "flex-start" as const };
    case "center": return { alignItems: "center" as const, justifyContent: "center" as const };
    case "expand": return { width: "100%" as const, alignSelf: "stretch" as const };
    default:       return undefined;
  }
}

function getPaintStyle(paint: PaintVariant | undefined, theme: ReturnType<typeof useTheme>) {
  switch (paint) {
    case "none":
    case undefined:
      return undefined;
    case "page":
      return { backgroundColor: theme.colors.bg } as const;
    case "wash":
      return { backgroundColor: theme.colors.surfaceWash } as const;
    case "panel":
      return {
        backgroundColor: theme.colors.surfaceStrong,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.colors.radii.lg,
        padding: theme.colors.space.md,
      } as const;
    case "panel-muted":
      return {
        backgroundColor: theme.colors.surfaceMuted,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.colors.radii.lg,
        padding: theme.colors.space.md,
      } as const;
    case "panel-strong":
      return {
        backgroundColor: theme.colors.surfaceStrong,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.colors.radii.xl,
        padding: theme.colors.space.md,
      } as const;
    case "panel-subtle":
      return {
        backgroundColor: theme.colors.surface,
        borderWidth: borderWidths.thin,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.colors.radii.md,
        padding: theme.colors.space.md,
      } as const;
    case "panel-inverse":
      return {
        backgroundColor: theme.colors.textPrimary,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.textPrimary,
        borderRadius: theme.colors.radii.lg,
        padding: theme.colors.space.md,
      } as const;
    case "selected":
      return {
        backgroundColor: theme.colors.surface,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.borderFocus,
        borderRadius: theme.colors.radii.md,
        padding: theme.colors.space.md,
      } as const;
    case "neutral":
      return {
        backgroundColor: theme.colors.surface,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.border,
        borderRadius: theme.colors.radii.xl,
      } as const;
    case "danger":
      return {
        backgroundColor: theme.colors.errorMuted,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.error,
        borderRadius: theme.colors.radii.md,
      } as const;
    // ── Chip / pill ─────────────────────────────────────────────
    case "chip-success":
      return { backgroundColor: theme.colors.successMuted, borderRadius: theme.colors.radii.pill } as const;
    case "chip-warning":
      return { backgroundColor: theme.colors.warningMuted, borderRadius: theme.colors.radii.pill } as const;
    case "chip-danger":
      return { backgroundColor: theme.colors.errorMuted, borderRadius: theme.colors.radii.pill } as const;
    case "chip-info":
      return { backgroundColor: theme.colors.infoMuted, borderRadius: theme.colors.radii.pill } as const;
    // ── Table ───────────────────────────────────────────────────
    case "table":
      return {
        backgroundColor: theme.colors.surfaceStrong,
        borderWidth: borderWidths.normal,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.colors.radii.lg,
      } as const;
    case "table-row":
      return {
        backgroundColor: theme.colors.surfaceStrong,
        borderWidth: borderWidths.thin,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.colors.radii.md,
      } as const;
    case "table-row-selected":
      return {
        backgroundColor: theme.colors.primaryMuted,
        borderWidth: borderWidths.thin,
        borderColor: theme.colors.primaryGlow,
        borderRadius: theme.colors.radii.md,
      } as const;
  }
}

function getLayoutStyle(
  props: {
    direction?: DirectionVariant;
    space?: SpaceToken;
    align?: AlignToken;
    justify?: JustifyToken;
    wrap?: boolean;
  },
  theme: ReturnType<typeof useTheme>,
) {
  const { direction, space, align, justify, wrap } = props;
  if (!direction && !space && !align && !justify && wrap === undefined) return undefined;
  return {
    flexDirection: direction === "horizontal" ? ("row" as const) : ("column" as const),
    gap: space ? resolveSpace(space, theme) : undefined,
    alignItems: align ? resolveAlign(align) : undefined,
    justifyContent: justify ? resolveJustify(justify) : undefined,
    flexWrap: wrap ? ("wrap" as const) : undefined,
  };
}

function getPadStyle(
  pad?: SpaceToken,
  padH?: SpaceToken,
  padV?: SpaceToken,
  theme?: ReturnType<typeof useTheme>,
) {
  if (!pad && !padH && !padV) return undefined;
  return {
    padding:          pad  && theme ? resolveSpace(pad,  theme) : undefined,
    paddingHorizontal: padH && theme ? resolveSpace(padH, theme) : undefined,
    paddingVertical:   padV && theme ? resolveSpace(padV, theme) : undefined,
  };
}

// ── Component ─────────────────────────────────────────────────────

export function Block({
  frame,
  paint,
  direction,
  space,
  align,
  justify,
  wrap,
  pad,
  padH,
  padV,
  overflow,
  safeArea,
  children,
  testID,
  accessible,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  onLayout,
  onTouchEnd,
  pointerEvents,
}: BlockProps) {
  const theme = useTheme();

  const computedStyle = [
    getFrameStyle(frame),
    getPaintStyle(paint, theme),
    getLayoutStyle({ direction, space, align, justify, wrap }, theme),
    // pad overrides paint's default padding when specified
    getPadStyle(pad, padH, padV, theme),
    overflow ? { overflow } : undefined,
  ];

  const inner = (
    <View
      style={computedStyle}
      testID={testID}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      onLayout={onLayout}
      onTouchEnd={onTouchEnd}
      pointerEvents={pointerEvents}
    >
      {children}
    </View>
  );

  if (!safeArea) return inner;

  const edges = safeArea === "all"    ? (["top", "bottom"] as const)
              : safeArea === "top"    ? (["top"]           as const)
              :                         (["bottom"]        as const);

  // SafeAreaView needs the background color so the inset zone matches the Block's bg.
  const bg = getPaintStyle(paint, theme)?.backgroundColor;
  const safeStyle = [
    frame === "fill" || frame === "fluid" ? { flex: 1 } : undefined,
    bg ? { backgroundColor: bg } : undefined,
  ];

  return <SafeAreaView edges={edges} style={safeStyle}>{inner}</SafeAreaView>;
}
