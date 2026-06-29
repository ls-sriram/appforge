/**
 * PlanBlock — current subscription plan with upgrade CTA.
 */

import React from "react";
import { Body, Button, Heading, Icon, useUI, XStack, YStack } from "../../../../platform/ui/index";
import type { Plan } from "../../services/user-profile.service";
import type { PlanBlockStyle } from "../contracts/settingsContracts";

export interface PlanBlockProps {
  style: PlanBlockStyle;
  plan?: Plan;
  onUpgrade: () => void;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  trial: "Trial",
  pro: "Pro",
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

export function PlanBlock({ style, plan, onUpgrade }: PlanBlockProps) {
  const { contracts } = useUI();
  const name = plan?.name ?? "free";
  const statusLabel = plan ? STATUS_LABELS[plan.status] ?? plan.status : "Inactive";
  const badgeBg = plan?.status === "past_due" ? style.planStatus.pastDueBackgroundColor : style.planStatus.activeBackgroundColor;
  const badgeColor = plan?.status === "past_due" ? style.planStatus.pastDueColor : style.planStatus.activeColor;

  return (
    <YStack
      bg={style.shell.container.backgroundColor}
      borderColor={style.shell.container.borderColor}
      borderWidth={style.shell.container.borderWidth}
      br={style.shell.container.borderRadius}
      overflow="hidden"
      p={style.shell.container.padding}
    >
      <YStack gap="$3">
        <XStack ai="flex-start" jc="space-between" gap="$4">
          <YStack gap="$2" f={1}>
            <Body fontSize={style.shell.sectionTitle.fontSize} color={style.shell.sectionTitle.color}>
              Current Plan
            </Body>
            <XStack ai="center" gap="$3">
              <Heading fontSize="$4">
                {PLAN_LABELS[name]}
              </Heading>
              <XStack bg={badgeBg} br={9999} px={style.badge.paddingHorizontal} py={style.badge.paddingVertical} ai="center">
                <Body color={badgeColor} fontSize="$1" fontWeight={style.badge.textFontWeight}>{statusLabel}</Body>
              </XStack>
            </XStack>
            <Body fontSize={style.description.fontSize} color={style.description.color}>
              {name === "pro"
                ? "Your account is on the highest plan."
                : "Upgrade to unlock the full experience."}
            </Body>
          </YStack>

          {name !== "pro" ? (
            <Button contract={contracts.button!["secondary"]} onPress={onUpgrade}>Upgrade</Button>
          ) : null}
        </XStack>

        {plan?.expiresAt ? (
          <XStack
            bg={style.shell.card.backgroundColor}
            borderWidth={style.shell.card.borderWidth}
            borderColor={style.shell.card.borderColor}
            br={style.shell.card.borderRadius}
            overflow="hidden"
            px={style.shell.card.padding}
            py={style.badge.paddingVertical}
            ai="center"
            gap={style.renewCard.gap}
          >
            <Icon
              color={name === "pro" ? style.renewalIcon.proColor : name === "trial" ? style.renewalIcon.trialColor : style.renewalIcon.defaultColor}
              name="calendar"
              size={style.renewalIcon.size}
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
