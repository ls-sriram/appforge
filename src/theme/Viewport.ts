import { useWindowDimensions } from "react-native";
import { useTheme } from "./ThemeProvider";

export type ViewportTier = "mobile" | "tablet" | "desktop" | "wide";

export interface ViewportInfo {
  width: number;
  height: number;
  tier: ViewportTier;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
}

export function getViewportTier(
  width: number,
  breakpoints: { tablet: number; desktop: number; wide: number }
): ViewportTier {
  if (width >= breakpoints.wide) return "wide";
  if (width >= breakpoints.desktop) return "desktop";
  if (width >= breakpoints.tablet) return "tablet";
  return "mobile";
}

export function useViewport(): ViewportInfo {
  const { width, height } = useWindowDimensions();
  const t = useTheme();
  const tier = getViewportTier(width, t.colors.breakpoints);

  return {
    width,
    height,
    tier,
    isMobile: tier === "mobile",
    isTablet: tier === "tablet",
    isDesktop: tier === "desktop" || tier === "wide",
    isWide: tier === "wide",
  };
}
