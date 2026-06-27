import React from "react";
import { Pressable, View } from "react-native";
import { Icon, type IconName } from "./Icon";
import { useTheme } from "../theme/ThemeProvider";

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export type SizingToolbarValue = "sm" | "md" | "lg";

export interface SizingToolbarProps {
  value: SizingToolbarValue;
  onChange: (value: SizingToolbarValue) => void;
  disabled?: boolean;
  icons?: Partial<Record<SizingToolbarValue, IconName>>;
}

const ORDER: readonly SizingToolbarValue[] = ["sm", "md", "lg"] as const;

const DEFAULT_ICONS: Record<SizingToolbarValue, IconName> = {
  sm: "panel-size-sm",
  md: "panel-size-md",
  lg: "panel-size-lg",
};

const LABELS: Record<SizingToolbarValue, string> = {
  sm: "Small size",
  md: "Medium size",
  lg: "Large size",
};

export function SizingToolbar({
  value,
  onChange,
  disabled = false,
  icons,
}: SizingToolbarProps) {
  const t = useTheme();

  return (
    <View
      accessibilityRole="toolbar"
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: t.palette.border,
        borderRadius: t.radii.pill,
        overflow: "hidden",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {ORDER.map((option, index) => {
        const selected = option === value;
        const iconName = icons?.[option] ?? DEFAULT_ICONS[option];

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={LABELS[option]}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(option)}
            testID={`sizing-toolbar-${option}`}
            style={{
              minWidth: 36,
              minHeight: 36,
              paddingHorizontal: 9,
              paddingVertical: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selected ? hexAlpha(t.palette.primary, 0.12) : t.palette.surface,
              borderLeftWidth: index === 0 ? 0 : 1,
              borderLeftColor: t.palette.border,
            }}
          >
            <Icon
              name={iconName}
              size="md"
              tone={selected ? "brand" : "muted"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
