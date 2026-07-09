/**
 * AccountBlock — account metadata (member since, last login).
 */
import React from "react";
import { Body, Icon, XStack, YStack } from "../../platform/ui/index";
import { dateOwner } from "../../platform/core/dates/index";
import type { AccountBlockProps } from "./account.contract";
export type { AccountBlockProps };
export { AccountBlockSchema } from "./account.contract";

function formatDate(iso?: string): string {
  if (!iso) return "Unknown";
  return dateOwner.format(iso, "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelative(iso?: string): string {
  if (!iso) return "Unknown";
  const parsed = dateOwner.parse(iso);
  if (!parsed) return "Unknown";
  const diff = dateOwner.now().getTime() - parsed.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function AccountBlock({ style, createdAt, lastLoginAt }: AccountBlockProps) {
  return (
    <YStack
      bg={style.shell.container.backgroundColor}
      borderColor={style.shell.container.borderColor}
      borderWidth={style.shell.container.borderWidth}
      br={style.shell.container.borderRadius}
      p={style.shell.container.padding}
    >
      <YStack gap="$3">
        <Body fontSize={style.shell.sectionTitle.fontSize} color={style.shell.sectionTitle.color}>
          Account Details
        </Body>

        <XStack gap="$3">
          <YStack f={1}>
            <YStack
              bg={style.shell.card.backgroundColor}
              borderWidth={style.shell.card.borderWidth}
              borderColor={style.shell.card.borderColor}
              br={style.shell.card.borderRadius}
              overflow="hidden"
              p={style.shell.card.padding}
            >
              <YStack gap="$2">
                <XStack ai="center" gap="$2">
                  <Icon color={style.icon.color} name="calendar" size={style.icon.size} />
                  <Body fontSize={style.shell.sectionTitle.fontSize} color={style.shell.sectionTitle.color}>
                      Member since
                  </Body>
                </XStack>
                <Body fontSize={style.value.fontSize} color={style.value.color}>{formatDate(createdAt)}</Body>
              </YStack>
            </YStack>
          </YStack>

          <YStack f={1}>
            <YStack
              bg={style.shell.card.backgroundColor}
              borderWidth={style.shell.card.borderWidth}
              borderColor={style.shell.card.borderColor}
              br={style.shell.card.borderRadius}
              overflow="hidden"
              p={style.shell.card.padding}
            >
              <YStack gap="$2">
                <XStack ai="center" gap="$2">
                  <Icon color={style.icon.color} name="activity" size={style.icon.size} />
                  <Body fontSize={style.shell.sectionTitle.fontSize} color={style.shell.sectionTitle.color}>
                      Last login
                  </Body>
                </XStack>
                <Body fontSize={style.value.fontSize} color={style.value.color}>{formatRelative(lastLoginAt)}</Body>
              </YStack>
            </YStack>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
}
