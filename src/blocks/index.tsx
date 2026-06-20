/**
 * blocks/index.tsx
 *
 * Shared visual blocks — AppForge primitives only. No hooks, no API calls,
 * no imports from features/. These components are the static design layer:
 * they accept variant contracts and display props, render using the token
 * system, and can be referenced in *.stage.tsx files.
 *
 * Variant contracts (tone, size, variant, density) are the inspector's
 * editing vocabulary. Raw style props are escape hatches for one-offs.
 */

import React from "react";
import { Body, Heading, Icon, View, XStack, YStack } from "../platform/ui/index";

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
  const initials = (name || email || "?")
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const pad = DENSITY_PAD[density];
  const avatarSize = AVATAR_SIZE[density];

  return (
    <View
      bg={variant === "flat" ? "transparent" : "$surfaceStrong"}
      borderColor={variant === "flat" ? "$borderSubtle" : "$borderSubtle"}
      borderWidth={1}
      br="$4"
      p={pad}
    >
      <XStack ai="center" gap="$4">
        <View
          w={avatarSize}
          h={avatarSize}
          br={9999}
          bg="$primaryMuted"
          ai="center"
          jc="center"
        >
          <Body tone="accent" weight="bold">{initials}</Body>
        </View>
        <YStack gap="$1" f={1}>
          <Heading size="md">{name}</Heading>
          <Body size="sm" tone="secondary">{email}</Body>
          {uid ? <Body size="xs" tone="muted">ID: {uid}</Body> : null}
        </YStack>
        <Icon name="chevron-right" size="xl" tone="muted" />
      </XStack>
    </View>
  );
}
