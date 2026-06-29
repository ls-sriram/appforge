/**
 * ProfileBlock — displays the user's identity.
 *
 * Supports two APIs:
 *  1. Individual props: <ProfileBlock name="..." email="..." uid="..." />
 *  2. Identity object: <ProfileBlock identity={{ uid, email, name }} />
 *
 * Optional onPress for tappable cards.
 */

import React from "react";
import { Body, Heading, Icon, XStack, YStack } from "../../../../platform/ui/index";
import type { ProfileBlockStyle } from "../contracts/settingsContracts";

export interface ProfileBlockProps {
  style: ProfileBlockStyle;
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

export function ProfileBlock({
  style,
  name: nameProp,
  email: emailProp,
  uid: uidProp,
  identity,
  onPress,
  size = "lg",
}: ProfileBlockProps) {
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
    <YStack
      bg={style.shell.container.backgroundColor}
      borderColor={style.shell.container.borderColor}
      borderWidth={style.shell.container.borderWidth}
      br={style.shell.container.borderRadius}
      overflow="hidden"
      p={style.shell.container.padding}
    >
      <XStack ai="center" jc="space-between" gap="$4">
        <XStack ai="center" gap="$4" f={1} minWidth={0}>
          <YStack
            w={size === "sm" ? style.avatar.sizeSm : size === "md" ? style.avatar.sizeMd : style.avatar.sizeLg}
            h={size === "sm" ? style.avatar.sizeSm : size === "md" ? style.avatar.sizeMd : style.avatar.sizeLg}
            br={9999}
            bg={style.avatar.backgroundColor}
            ai="center"
            jc="center"
          >
            <Body color={style.avatar.textColor} fontWeight={style.avatar.textFontWeight}>{initials}</Body>
          </YStack>
          <YStack gap={2} f={1} minWidth={0}>
            <Heading fontSize="$4" numberOfLines={1}>
              {name || "Anonymous"}
            </Heading>
            <Body fontSize={style.email.fontSize} color={style.email.color} numberOfLines={1}>
              {email || "No email available"}
            </Body>
            {uid ? (
              <Body fontSize={style.uid.fontSize} color={style.uid.color} numberOfLines={1}>
                ID: {uid.slice(0, 12)}…
              </Body>
            ) : null}
          </YStack>
        </XStack>
        {onPress ? <Icon color={style.chevron.color} name="chevron-right" size={style.chevron.size} /> : null}
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
