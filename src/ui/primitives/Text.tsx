import React from "react";
import { Text as RNText, TextStyle } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export type TextTone =
  | "primary"
  | "secondary"
  | "muted"
  | "tertiary"
  | "brand"
  | "accent"
  | "successAccent"
  | "success"
  | "warning"
  | "alert"
  | "danger"
  | "action"
  | "inverse";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "pageTitle"
  | "displayLg"
  | "displaySm"
  | "tableHeader"
  | "statLabel"
  | "statValue"
  | "numericLg"
  | "action"
  | "body"
  | "bodySm"
  | "caption"
  | "link"
  | "mono";

export type TextWeight = "regular" | "medium" | "semibold" | "bold" | "extrabold";

function variantStyles(theme: ReturnType<typeof useTheme>): Record<TextVariant, TextStyle> {
  const c = theme.colors;
  const t = c.typography;
  return {
    h1: {
      fontSize: t.sizes["2xl"],
      fontWeight: t.weights.bold,
      color: c.textPrimary,
      letterSpacing: t.letterSpacing.tight,
      lineHeight: t.sizes["2xl"] * t.lineHeights.tight,
    },
    h2: {
      fontSize: t.sizes.xl,
      fontWeight: t.weights.semibold,
      color: c.textPrimary,
      letterSpacing: t.letterSpacing.normal,
      lineHeight: t.sizes.xl * t.lineHeights.tight,
    },
    h3: {
      fontSize: t.sizes.lg,
      fontWeight: t.weights.semibold,
      color: c.textPrimary,
      lineHeight: t.sizes.lg * t.lineHeights.tight,
    },
    pageTitle: {
      fontSize: t.roles.pageTitle,
      fontWeight: t.weights.semibold,
      color: c.textPrimary,
      letterSpacing: t.letterSpacing.tight,
      lineHeight: t.roles.pageTitle * t.lineHeights.tight,
    },
    displayLg: {
      fontSize: t.roles.displayLg,
      fontWeight: t.weights.semibold,
      color: c.textPrimary,
      lineHeight: t.roles.displayLg * 1.2,
    },
    displaySm: {
      fontSize: t.roles.displaySm,
      fontWeight: t.weights.medium,
      color: c.textSecondary,
      lineHeight: t.roles.displaySm * 1.3,
    },
    tableHeader: {
      fontSize: t.roles.tableHeader,
      fontWeight: t.weights.semibold,
      color: c.textTertiary,
      letterSpacing: 0.7,
      textTransform: "uppercase",
    },
    statLabel: {
      fontSize: t.roles.statLabel,
      fontWeight: t.weights.medium,
      color: c.textTertiary,
      letterSpacing: 0.35,
    },
    statValue: {
      fontSize: t.roles.statValue,
      fontWeight: t.weights.semibold,
      color: c.textPrimary,
      lineHeight: t.roles.statValue * 1.2,
    },
    numericLg: {
      fontSize: t.roles.numericLg,
      fontWeight: t.weights.bold,
      color: c.textPrimary,
      letterSpacing: t.letterSpacing.tight,
      lineHeight: t.roles.numericLg * 1.1,
    },
    action: {
      fontSize: t.roles.action,
      fontWeight: t.weights.semibold,
      color: c.actionAccent,
    },
    body: {
      fontSize: t.sizes.md,
      fontWeight: t.weights.regular,
      color: c.textPrimary,
      lineHeight: t.sizes.md * t.lineHeights.normal,
    },
    bodySm: {
      fontSize: t.sizes.sm,
      fontWeight: t.weights.regular,
      color: c.textSecondary,
      lineHeight: t.sizes.sm * t.lineHeights.normal,
    },
    caption: {
      fontSize: t.sizes.xs,
      fontWeight: t.weights.medium,
      color: c.textMuted,
      letterSpacing: t.letterSpacing.wide,
    },
    link: {
      fontSize: t.sizes.sm,
      fontWeight: t.weights.medium,
      color: c.textLink,
    },
    mono: {
      fontSize: t.sizes.sm,
      fontFamily: t.fontFamilyMono,
      color: c.textSecondary,
    },
  };
}

function resolveTone(theme: ReturnType<typeof useTheme>, tone?: TextTone) {
  const c = theme.colors;
  switch (tone) {
    case "primary":
      return c.textPrimary;
    case "secondary":
      return c.textSecondary;
    case "muted":
      return c.textMuted;
    case "tertiary":
      return c.textTertiary;
    case "brand":
      return c.primary;
    case "accent":
      return c.accent;
    case "successAccent":
      return c.successAccent;
    case "success":
      return c.success;
    case "warning":
      return c.warning;
    case "alert":
      return c.alertAccent;
    case "danger":
      return c.error;
    case "action":
      return c.actionAccent;
    case "inverse":
      return c.textInverse;
    default:
      return undefined;
  }
}

type TextFrame = "fluid" | "shrink";

interface TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextWeight;
  align?: "left" | "center" | "right";
  frame?: TextFrame;
  children: React.ReactNode;
  numberOfLines?: number;
}

/** Use when you need RNText with token-driven typography but a dynamic color. */
export function getVariantStyle(
  theme: ReturnType<typeof useTheme>,
  variant: TextVariant = "body",
  weight?: TextWeight,
): TextStyle {
  const base = variantStyles(theme)[variant];
  return weight ? { ...base, fontWeight: theme.colors.typography.weights[weight] } : base;
}

export function Text({
  variant = "body",
  tone,
  weight,
  align = "left",
  frame,
  children,
  numberOfLines,
}: TextProps) {
  const theme = useTheme();
  const variants = variantStyles(theme);
  const toneColor = resolveTone(theme, tone);
  const fontWeight = weight ? theme.colors.typography.weights[weight] : undefined;
  const frameStyle: TextStyle | undefined =
    frame === "fluid" ? { flex: 1 } : frame === "shrink" ? { flexShrink: 0 } : undefined;
  return (
    <RNText
      style={[
        variants[variant],
        { textAlign: align },
        toneColor && { color: toneColor },
        fontWeight && { fontWeight },
        frameStyle,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
