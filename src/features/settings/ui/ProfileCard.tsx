/**
 * ProfileCard — displays the user's identity.
 *
 * Supports two APIs:
 *  1. Individual props: <ProfileCard name="..." email="..." uid="..." />
 *  2. Identity object: <ProfileCard identity={{ uid, email, name }} />
 *
 * Optional onPress for tappable cards.
 */

import React from "react";
import { Body, Heading, Icon, XStack, YStack, useThemeTokens } from "../../../platform/ui/index";

export interface ProfileCardProps {
  name?: string;
  email?: string;
  uid?: string;
  identity?: {
    uid: string;
    email: string;
    name?: string;
  };
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
}

export function ProfileCard({
  name: nameProp,
  email: emailProp,
  uid: uidProp,
  identity,
  onPress,
  size = "lg",
}: ProfileCardProps) {
  const theme = useThemeTokens();
  const name = identity?.name ?? nameProp;
  const email = identity?.email ?? emailProp ?? "";
  const uid = identity?.uid ?? uidProp ?? "";
  const initials = (name || email || "?")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const content = (
    <YStack bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" overflow="hidden" p="$4">
      <XStack ai="center" jc="space-between" gap="$4">
        <XStack ai="center" gap="$4" f={1} minWidth={0}>
          <YStack
            w={size === "sm" ? 32 : size === "md" ? 40 : 56}
            h={size === "sm" ? 32 : size === "md" ? 40 : 56}
            br={9999}
            bg="$primaryMuted"
            ai="center"
            jc="center"
          >
            <Body color="$primary" fontFamily="$bold">{initials}</Body>
          </YStack>
          <YStack gap={2} f={1} minWidth={0}>
            <Heading fontSize="$4" numberOfLines={1}>
              {name || "Anonymous"}
            </Heading>
            <Body fontSize="$2" color="$textSecondary" numberOfLines={1}>
              {email || "No email available"}
            </Body>
            {uid ? (
              <Body fontSize="$1" color="$textMuted" numberOfLines={1}>
                ID: {uid.slice(0, 12)}…
              </Body>
            ) : null}
          </YStack>
        </XStack>
        {onPress ? <Icon color={theme.palette.textMuted} name="chevron-right" size={20} /> : null}
      </XStack>
    </YStack>
  );

  if (onPress) {
    return (
      <YStack onPress={onPress} pressStyle={{ opacity: 0.7 }} cursor="pointer">
        {content}
      </YStack>
    );
  }

  return content;
}
