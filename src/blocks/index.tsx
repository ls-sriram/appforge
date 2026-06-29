/**
 * blocks/index.tsx
 *
 * Shared visual blocks — AppForge primitives only. No hooks, no API calls,
 * no imports from features/. These components are the static design layer:
 * they accept variant contracts and display props, render using the token
 * system, and can be previewed by external visualizer consumers.
 *
 * Variant contracts (tone, size, variant, density) are the inspector's
 * editing vocabulary. Keep blocks inside the platform's closed-form surface.
 */

import React from "react";
import { Body, Heading, Icon, XStack, YStack, useThemeTokens } from "../platform/ui/index";

// ── ProfileCard ───────────────────────────────────────────────────────────────

export type ProfileCardVariant = "default" | "flat";
export type ProfileCardDensity = "compact" | "normal" | "spacious";

export interface ProfileCardProps {
  name?: string;
  email?: string;
  uid?: string;
  variant?: ProfileCardVariant;
  density?: ProfileCardDensity;
  onPress?: () => void;
}

const DENSITY_PAD: Record<ProfileCardDensity, string> = {
  compact:  "$3",
  normal:   "$4",
  spacious: "$5",
};

const AVATAR_SIZE: Record<ProfileCardDensity, number> = {
  compact:  44,
  normal:   56,
  spacious: 68,
};

export function ProfileCard({
  name = "Display Name",
  email = "user@example.com",
  uid,
  variant = "default",
  density = "normal",
  onPress,
}: ProfileCardProps) {
  const theme = useThemeTokens();
  const initials = (name || email || "?")
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const pad = DENSITY_PAD[density];
  const avatarSize = AVATAR_SIZE[density];

  return (
    <YStack
      bg={variant === "flat" ? "transparent" : "$surfaceStrong"}
      borderColor={variant === "flat" ? "$borderSubtle" : "$borderSubtle"}
      borderWidth={1}
      br="$4"
      p={pad}
    >
      <XStack ai="center" gap="$4">
        <YStack
          w={avatarSize}
          h={avatarSize}
          br={9999}
          bg="$primaryMuted"
          ai="center"
          jc="center"
        >
          <Body color="$primary" fontFamily="$bold">{initials}</Body>
        </YStack>
        <YStack gap="$1" f={1}>
          <Heading fontSize="$4" lineHeight="$4">{name}</Heading>
          <Body color="$textSecondary" fontSize="$2" lineHeight="$2">{email}</Body>
          {uid ? <Body color="$textMuted" fontSize="$1" lineHeight="$1">ID: {uid}</Body> : null}
        </YStack>
        <Icon color={theme.palette.textMuted} name="chevron-right" size={20} />
      </XStack>
    </YStack>
  );
}
