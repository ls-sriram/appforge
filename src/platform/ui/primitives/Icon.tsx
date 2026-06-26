import React from "react";
import { View } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";

/**
 * Icon — SVG icon atom.
 * Accepts a named icon string and renders it with theme colors.
 */

export type IconName =
  | "panel-size-sm"
  | "panel-size-md"
  | "panel-size-lg"
  | "mic"
  | "search"
  | "home"
  | "school"
  | "chart"
  | "book"
  | "table"
  | "list"
  | "activity"
  | "user"
  | "users"
  | "settings"
  | "bell"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "trending-up"
  | "trending-down"
  | "check"
  | "circle-check"
  | "minus"
  | "plus"
  | "x"
  | "menu"
  | "logout"
  | "calendar"
  | "shield"
  | "zap"
  | "flask"
  | "scissors"
  | "dollar"
  | "share"
  | "moon"
  | "mail"
  | "message"
  | "help"
  | "info"
  | "key"
  | "eye";

export type IconTone =
  | "muted"
  | "secondary"
  | "accent"
  | "action"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "inverse"
  | "brand";
export type IconSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

const ICON_SIZE_MAP: Record<IconSize, number> = {
  "2xs": 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 22,
  "3xl": 24,
  "4xl": 32,
  "5xl": 48,
};

const icons: Record<IconName, (color: string) => React.ReactNode> = {
  "panel-size-sm": (c) => (
    <>
      <Rect x="5" y="7" width="14" height="10" rx="2" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M8 10h8M8 14h6" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  "panel-size-md": (c) => (
    <>
      <Rect x="4" y="6" width="16" height="12" rx="2" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M7 10h10M7 14h10" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  "panel-size-lg": (c) => (
    <>
      <Rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M6 10h12M6 14h12" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  mic: (c) => (
    <>
      <Path
        d="M12 3a3 3 0 00-3 3v6a3 3 0 106 0V6a3 3 0 00-3-3z"
        stroke={c}
        strokeWidth="2"
        fill="none"
      />
      <Path d="M19 11a7 7 0 01-14 0M12 18v3M8 21h8" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  search: (c) => (
    <>
      <Circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M16 16l4 4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  home: (c) => (
    <Path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10.5z"
      stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round" />
  ),
  school: (c) => (
    <>
      <Path d="M3 8l9-4 9 4-9 4-9-4z" stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round" />
      <Path d="M7 10.2V16c0 1.6 2.2 3 5 3s5-1.4 5-3v-5.8" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M21 8v6" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  chart: (c) => (
    <>
      <Path d="M4 20V14" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 20V8" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M20 20V4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  table: (c) => (
    <>
      <Path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
        stroke={c} strokeWidth="2" fill="none" />
      <Path d="M3 9h18M3 15h18M9 3v18" stroke={c} strokeWidth="2" />
    </>
  ),
  book: (c) => (
    <>
      <Path d="M4 5a3 3 0 013-3h13v17H7a3 3 0 00-3 3V5z" stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round" />
      <Path d="M4 19a3 3 0 013-3h13" stroke={c} strokeWidth="2" fill="none" />
    </>
  ),
  list: (c) => (
    <>
      <Path d="M8 6h13M8 12h13M8 18h13" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="4" cy="6" r="1" fill={c} />
      <Circle cx="4" cy="12" r="1" fill={c} />
      <Circle cx="4" cy="18" r="1" fill={c} />
    </>
  ),
  activity: (c) => (
    <Path d="M3 12h4l3-9 4 18 3-9h4" stroke={c} strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" fill="none" />
  ),
  user: (c) => (
    <>
      <Circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M4 21v-1a6 6 0 0112 0v1" stroke={c} strokeWidth="2" fill="none" />
    </>
  ),
  users: (c) => (
    <>
      <Circle cx="9" cy="8" r="3.5" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M3 21v-1a6 6 0 0112 0v1" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M16 11a3 3 0 100-6M17 21v-1a5 5 0 00-3-4.6" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  settings: (c) => (
    <>
      <Circle cx="12" cy="12" r="3.2" stroke={c} strokeWidth="2" fill="none" />
      <Path
        d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  bell: (c) => (
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
      stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
  ),
  "chevron-down": (c) => (
    <Path d="M6 9l6 6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" fill="none" />
  ),
  "chevron-left": (c) => (
    <Path d="M15 6l-6 6 6 6" stroke={c} strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" fill="none" />
  ),
  "chevron-right": (c) => (
    <Path d="M9 6l6 6-6 6" stroke={c} strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" fill="none" />
  ),
  "trending-up": (c) => (
    <>
      <Path d="M3 17l6-6 4 4 8-8" stroke={c} strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" fill="none" />
      <Path d="M17 7h4v4" stroke={c} strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" fill="none" />
    </>
  ),
  "trending-down": (c) => (
    <>
      <Path d="M3 7l6 6 4-4 8 8" stroke={c} strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" fill="none" />
      <Path d="M17 17h4v-4" stroke={c} strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" fill="none" />
    </>
  ),
  check: (c) => (
    <Path d="M5 12l4 4 10-10" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  "circle-check": (c) => (
    <>
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M8 12l3 3 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  minus: (c) => (
    <Path d="M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round" />
  ),
  plus: (c) => (
    <>
      <Path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  x: (c) => (
    <Path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2" strokeLinecap="round" />
  ),
  menu: (c) => (
    <>
      <Path d="M3 6h18M3 12h18M3 18h18" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  logout: (c) => (
    <>
      <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M16 17l5-5-5-5M21 12H9" stroke={c} strokeWidth="2" strokeLinecap="round"
        fill="none" />
    </>
  ),
  calendar: (c) => (
    <>
      <Path d="M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke={c} strokeWidth="2" fill="none" />
      <Path d="M16 2v4M8 2v4M3 10h18" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  shield: (c) => (
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round" />
  ),
  zap: (c) => (
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round" />
  ),
  flask: (c) => (
    <>
      <Path d="M9 3h6M10 3v5.5L5.5 18A3 3 0 008.2 22h7.6a3 3 0 002.7-4L14 8.5V3" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 16h8" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  scissors: (c) => (
    <>
      <Circle cx="6" cy="6" r="3" stroke={c} strokeWidth="2" fill="none" />
      <Circle cx="6" cy="18" r="3" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M8.5 8.5L20 20M8.5 15.5L20 4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  dollar: (c) => (
    <>
      <Path d="M12 2v20M17 6.5C16 5.5 14.4 5 12.8 5h-1.4C9.5 5 8 6.1 8 7.7c0 1.4 1 2.3 3 2.8l2 .5c2 .5 3 1.4 3 2.9 0 1.8-1.6 3.1-4 3.1-1.8 0-3.5-.6-4.8-1.8" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  share: (c) => (
    <>
      <Circle cx="18" cy="5" r="3" stroke={c} strokeWidth="2" fill="none" />
      <Circle cx="6" cy="12" r="3" stroke={c} strokeWidth="2" fill="none" />
      <Circle cx="18" cy="19" r="3" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={c} strokeWidth="2" />
    </>
  ),
  moon: (c) => (
    <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      stroke={c} strokeWidth="2" fill="none" />
  ),
  mail: (c) => (
    <>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={c} strokeWidth="2" fill="none" />
      <Path d="M22 6l-10 7L2 6" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  message: (c) => (
    <>
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round" />
    </>
  ),
  help: (c) => (
    <>
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
      <Circle cx="12" cy="17" r="0.5" fill={c} />
    </>
  ),
  info: (c) => (
    <>
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2" fill="none" />
      <Path d="M12 16v-4M12 8h.01" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  key: (c) => (
    <>
      <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
        stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  eye: (c) => (
    <>
      <Path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"
        stroke={c}
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="2.5" stroke={c} strokeWidth="2" fill="none" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: IconSize;
  tone?: IconTone;
  [key: string]: unknown;
}

export function Icon({ name, size = "3xl", tone = "muted", ...rest }: IconProps) {
  const theme = useTheme();
  const resolvedColor =
    tone === "secondary"
      ? theme.colors.textSecondary
      : tone === "accent" || tone === "brand"
        ? theme.colors.primary
        : tone === "action"
          ? theme.colors.actionAccent
          : tone === "success"
            ? theme.colors.success
            : tone === "warning"
              ? theme.colors.warning
              : tone === "danger"
                ? theme.colors.error
                : tone === "info"
                  ? theme.colors.info
                  : tone === "inverse"
                    ? theme.colors.textInverse
                    : theme.colors.textMuted;
  const resolvedSize = ICON_SIZE_MAP[size];
  return (
    <View style={{ width: resolvedSize, height: resolvedSize }} {...(rest as object)}>
      <Svg width={resolvedSize} height={resolvedSize} viewBox="0 0 24 24">
        {icons[name]?.(resolvedColor)}
      </Svg>
    </View>
  );
}
