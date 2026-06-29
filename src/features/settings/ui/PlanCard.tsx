/**
 * PlanCard — current subscription plan with upgrade CTA.
 */

import React from "react";
import { Body, Button, Heading, Icon, XStack, YStack, useThemeTokens } from "../../../platform/ui/index";
import type { Plan } from "../services/user-profile.service";

export interface PlanCardProps {
  plan?: Plan;
  onUpgrade: () => void;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  trial: "Trial",
  pro: "Pro",
};

const PLAN_COLORS: Record<string, string> = {
  free: "#A3A3A3",
  trial: "#FBBF24",
  pro: "#8B5CF6",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  trialing: "Trialing",
  cancel_pending: "Cancels soon",
  past_due: "Past due",
  canceled: "Canceled",
};

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PlanCard({ plan, onUpgrade }: PlanCardProps) {
  const theme = useThemeTokens();
  const name = plan?.name ?? "free";
  const statusLabel = plan ? STATUS_LABELS[plan.status] ?? plan.status : "Inactive";
  const badgeBg = plan?.status === "past_due" ? "$warningMuted" : "$successMuted";
  const badgeColor = plan?.status === "past_due" ? "$warning" : "$success";

  return (
    <YStack bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" overflow="hidden" p="$4">
      <YStack gap="$3">
        <XStack ai="flex-start" jc="space-between" gap="$4">
          <YStack gap="$2" f={1}>
            <Body fontSize="$1" color="$textMuted">
              Current Plan
            </Body>
            <XStack ai="center" gap="$3">
              <Heading fontSize="$4">
                {PLAN_LABELS[name]}
              </Heading>
              <XStack bg={badgeBg} br={9999} px="$3" py={4} ai="center">
                <Body color={badgeColor} fontSize="$1" fontFamily="$bold">{statusLabel}</Body>
              </XStack>
            </XStack>
            <Body fontSize="$2" color="$textSecondary">
              {name === "pro"
                ? "Your account is on the highest plan."
                : "Upgrade to unlock the full experience."}
            </Body>
          </YStack>

          {name !== "pro" ? (
            <Button variant="secondary" onPress={onUpgrade}>Upgrade</Button>
          ) : null}
        </XStack>

        {plan?.expiresAt ? (
          <XStack bg="$surface" borderWidth={1} borderColor="$border" br="$2" overflow="hidden" px="$3" py="$2" ai="center" gap="$2">
            <Icon
              color={name === "pro" ? theme.palette.primary : name === "trial" ? theme.palette.warning : theme.palette.textMuted}
              name="calendar"
              size={14}
            />
            <Body fontSize="$1" color="$textSecondary">
              {plan.cancelAtPeriodEnd ? "Access ends" : "Renews"} {formatDate(plan.expiresAt)}
            </Body>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
  );
}
