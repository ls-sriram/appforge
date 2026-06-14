import { useTheme } from "../../theme/ThemeProvider";

export type SemanticTone =
  | "brand"
  | "primary"
  | "secondary"
  | "muted"
  | "tertiary"
  | "quaternary"
  | "accent"
  | "action"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "inverse";

export function resolveSemanticTone(
  theme: ReturnType<typeof useTheme>,
  tone: SemanticTone = "muted",
): string {
  const c = theme.colors;
  switch (tone) {
    case "brand":
      return c.primary;
    case "primary":
      return c.textPrimary;
    case "secondary":
      return c.textSecondary;
    case "muted":
      return c.textMuted;
    case "tertiary":
      return c.textTertiary;
    case "quaternary":
      return c.textQuaternary;
    case "accent":
      return c.accent;
    case "action":
      return c.actionAccent;
    case "success":
      return c.successAccent;
    case "warning":
      return c.warning;
    case "danger":
      return c.error;
    case "info":
      return c.info;
    case "inverse":
      return c.textInverse;
    default:
      return c.textMuted;
  }
}
