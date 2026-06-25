import React from "react";
import { ActivityIndicator } from "react-native";
import { styled } from "@tamagui/core";
import { Pressable } from "react-native";
import { Body } from "./Text";

// ── Variant contracts ─────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize    = "sm" | "md" | "lg";

const ButtonFrame = styled(Pressable, {
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

export type ButtonProps = Omit<React.ComponentProps<typeof ButtonFrame>, "style"> & {
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
  children,
  onPress,
  ...props
}: ButtonProps) {
  const { style: _style, ...rest } = props as ButtonProps & { style?: unknown };
  const tone = LABEL_TONE[variant];

  return (
    <ButtonFrame
      variant={variant}
      size={size}
      {...rest}
      onPress={onPress}
      // @ts-ignore — Tamagui styled(Pressable) swallows onPress on web; wire onClick directly
      onClick={onPress}
      opacity={rest.disabled || loading ? 0.45 : 1}
    >
      {loading
        ? <ActivityIndicator />
        : label
          ? <Body tone={tone} weight="bold" size="md">{label}</Body>
          : children}
    </ButtonFrame>
  );
}
