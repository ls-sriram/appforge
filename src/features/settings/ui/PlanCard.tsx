/**
 * PlanCard — current subscription plan with upgrade CTA.
 */

import React from "react";
import { useTheme } from "../../../theme/ThemeProvider";
import { Block, Badge, Button, Icon, Text } from "../../../ui/primitives"
import { Panel } from "../../../ui/panels";
import type { Plan } from "../../../services/UserProfileService";

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
  const name = plan?.name ?? "free";
  const statusLabel = plan ? STATUS_LABELS[plan.status] ?? plan.status : "Inactive";

  return (
    <Panel variant="strong" overflow="hidden">
      <Block space="sm">
        <Block direction="horizontal" align="start" justify="space-between" space="md">
          <Block space="xs" frame="fluid">
            <Text variant="caption" tone="muted">
              Current Plan
            </Text>
            <Block direction="horizontal" align="center" space="sm">
              <Text variant="h3">
                {PLAN_LABELS[name]}
              </Text>
              <Badge label={statusLabel} variant={plan?.status === "past_due" ? "warning" : "success"} size="sm" />
            </Block>
            <Text variant="bodySm" tone="secondary">
              {name === "pro"
                ? "Your account is on the highest plan."
                : "Upgrade to unlock the full experience."}
            </Text>
          </Block>

          {name !== "pro" ? (
            <Button
              label="Upgrade"
              variant="secondary"
              size="sm"
              fullWidth={false}
              onPress={onUpgrade}
            />
          ) : null}
        </Block>

        {plan?.expiresAt ? (
          <Panel variant="subtle" overflow="hidden">
            <Block padH="sm" padV="xs">
              <Block direction="horizontal" align="center" space="xs">
                <Icon name="calendar" size="sm" tone={name === "pro" ? "brand" : name === "trial" ? "warning" : "muted"} />
                <Text variant="caption" tone="secondary">
                  {plan.cancelAtPeriodEnd ? "Access ends" : "Renews"} {formatDate(plan.expiresAt)}
                </Text>
              </Block>
            </Block>
          </Panel>
        ) : null}
      </Block>
    </Panel>
  );
}
