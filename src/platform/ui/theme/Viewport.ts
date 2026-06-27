import { useWindowDimensions } from "react-native";
import { useTheme } from "./ThemeProvider";
import { useViewportOverride } from "./ViewportProvider";

export type ViewportTier = "mobile" | "tablet" | "desktop";

export interface ViewportInfo {
  width: number;
  height: number;
  tier: ViewportTier;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function getViewportTier(
  width: number,
  breakpoints: { tablet: number; desktop: number }
): ViewportTier {
  if (width >= breakpoints.desktop) return "desktop";
  if (width >= breakpoints.tablet) return "tablet";
  return "mobile";
}

export function useViewport(): ViewportInfo {
  const override = useViewportOverride();
  const { width, height } = useWindowDimensions();
  const t = useTheme();

  if (override) return override;

  const tier = getViewportTier(width, t.breakpoints);
  return {
    width,
    height,
    tier,
    isMobile: tier === "mobile",
    isTablet: tier === "tablet",
    isDesktop: tier === "desktop",
  };
}
