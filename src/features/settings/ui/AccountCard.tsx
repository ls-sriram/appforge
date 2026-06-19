/**
 * AccountCard — account metadata (member since, last login).
 */
import React from "react";
import { Body, Icon, View, XStack, YStack } from "../../../platform/ui/index";
import { dateOwner } from "@core/dates";

export interface AccountCardProps {
  createdAt?: string;
  lastLoginAt?: string;
}

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

export function AccountCard({ createdAt, lastLoginAt }: AccountCardProps) {
  return (
    <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
      <YStack gap="$3">
        <Body fontSize="$1" color="$textMuted">
          Account Details
        </Body>

        <XStack gap="$3">
          <View f={1}>
            <View bg="$surface" borderWidth={1} borderColor="$border" br="$2" overflow="hidden" p="$3">
              <YStack gap="$2">
                <XStack ai="center" gap="$2">
                  <Icon name="calendar" size="md" tone="muted" />
                  <Body fontSize="$1" color="$textMuted">
                      Member since
                  </Body>
                </XStack>
                <Body fontSize="$2" color="$primary">{formatDate(createdAt)}</Body>
              </YStack>
            </View>
          </View>

          <View f={1}>
            <View bg="$surface" borderWidth={1} borderColor="$border" br="$2" overflow="hidden" p="$3">
              <YStack gap="$2">
                <XStack ai="center" gap="$2">
                  <Icon name="activity" size="md" tone="muted" />
                  <Body fontSize="$1" color="$textMuted">
                      Last login
                  </Body>
                </XStack>
                <Body fontSize="$2" color="$primary">{formatRelative(lastLoginAt)}</Body>
              </YStack>
            </View>
          </View>
        </XStack>
      </YStack>
    </View>
  );
}
