import React from "react";
import { Pressable, View } from "react-native";
import { Icon, type IconName } from "./Icon";
import { useUI } from "../theme/ThemeProvider";

export interface SizingToolbarVariant {
  containerBorderWidth: number;
  containerBorderColor: string;
  containerBorderRadius: number;
  containerDisabledOpacity: number;
  buttonMinWidth: number;
  buttonMinHeight: number;
  buttonPaddingHorizontal: number;
  buttonPaddingVertical: number;
  buttonSelectedBackgroundColor: string;
  buttonUnselectedBackgroundColor: string;
  buttonDividerWidth: number;
  buttonDividerColor: string;
}

export type SizingToolbarValue = "sm" | "md" | "lg";

export interface SizingToolbarProps {
  value: SizingToolbarValue;
  onChange: (value: SizingToolbarValue) => void;
  variant?: string;
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
  variant = "default",
  disabled = false,
  icons,
}: SizingToolbarProps) {
  const { variants } = useUI();
  const s = variants.sizingToolbar?.[variant];
  if (!s) throw new Error(`Unknown sizingToolbar variant "${variant}"`);

  return (
    <View
      accessibilityRole="toolbar"
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: s.containerBorderWidth,
        borderColor: s.containerBorderColor,
        borderRadius: s.containerBorderRadius,
        overflow: "hidden",
        opacity: disabled ? s.containerDisabledOpacity : 1,
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
              minWidth: s.buttonMinWidth,
              minHeight: s.buttonMinHeight,
              paddingHorizontal: s.buttonPaddingHorizontal,
              paddingVertical: s.buttonPaddingVertical,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selected ? s.buttonSelectedBackgroundColor : s.buttonUnselectedBackgroundColor,
              borderLeftWidth: index === 0 ? 0 : s.buttonDividerWidth,
              borderLeftColor: s.buttonDividerColor,
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
