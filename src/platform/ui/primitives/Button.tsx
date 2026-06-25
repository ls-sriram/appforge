import React from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { View, styled } from "@tamagui/core";
import { Body } from "./Text";

// ── Variant contracts ─────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize    = "sm" | "md" | "lg";

// styled(View) handles appearance only; raw Pressable handles interaction so
// onPress reaches the DOM on web without Tamagui swallowing it.
const ButtonFrame = styled(View, {
  name: "Button",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 9999,

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primary",
      },
      secondary: {
        backgroundColor: "$surfaceAlt",
        borderWidth: 1,
        borderColor: "$border",
      },
      ghost: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$borderSubtle",
      },
      danger: {
        backgroundColor: "$errorMuted",
        borderWidth: 1,
        borderColor: "$error",
      },
    },
    size: {
      sm: { minHeight: 36, paddingVertical: "$2", paddingHorizontal: "$3" },
      md: { minHeight: 54, paddingVertical: "$4", paddingHorizontal: "$5" },
      lg: { minHeight: 64, paddingVertical: "$5", paddingHorizontal: "$6" },
    },
  } as const,

  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

// Maps variant → text tone so callers only need to pass `label`.
const LABEL_TONE: Record<ButtonVariant, React.ComponentProps<typeof Body>["tone"]> = {
  primary:   "inverse",
  secondary: "primary",
  ghost:     "primary",
  danger:    "danger",
};

export type ButtonProps = React.ComponentProps<typeof Pressable> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  label,
  loading = false,
  disabled,
  onPress,
  children,
}: ButtonProps) {
  const tone = LABEL_TONE[variant];

  return (
    <Pressable onPress={onPress} disabled={disabled || loading}>
      <ButtonFrame
        variant={variant}
        size={size}
        opacity={disabled || loading ? 0.45 : 1}
        pointerEvents="none"
      >
        {loading
          ? <ActivityIndicator />
          : label
            ? <Body tone={tone} weight="bold" size="md">{label}</Body>
            : children}
      </ButtonFrame>
    </Pressable>
  );
}
