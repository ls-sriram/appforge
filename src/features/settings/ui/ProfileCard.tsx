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
import { StyleSheet, TouchableOpacity } from "react-native";
import { Body, Heading, Icon, View, XStack, YStack } from "@ui";

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
    <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" overflow="hidden" p="$4">
      <XStack ai="center" jc="space-between" gap="$4">
        <XStack ai="center" gap="$4" f={1} minWidth={0}>
          <View
            w={size === "sm" ? 32 : size === "md" ? 40 : 56}
            h={size === "sm" ? 32 : size === "md" ? 40 : 56}
            br={9999}
            bg="$primaryMuted"
            ai="center"
            jc="center"
          >
            <Body color="$primary" fontFamily="$bold">{initials}</Body>
          </View>
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
        {onPress ? <Icon name="chevron-right" size="xl" tone="muted" /> : null}
      </XStack>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({});
