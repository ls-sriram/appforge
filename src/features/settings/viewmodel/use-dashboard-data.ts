/**
 * ─────────────────────────────────────────────────────────────────
 * USE DASHBOARD DATA — Combines session + profile for dashboard stats.
 *
 * Real data: user identity, plan, usage counters.
 * Mock data (until backend implements): chart, table, activity feed.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { BackendUserProfileService, type UsageTrendGranularity } from "../services/user-profile.service";
import { BackendEntitlementService } from "../../entitlements/services/entitlement.service";
import { api } from "../../../platform/api/client";
import { useEntitlementContext } from "../../../platform/providers/EntitlementProvider";
import { getEntitlementSnapshot, setEntitlementSnapshot } from "../../entitlements/viewmodel/store";
import { createMockEntitlementSnapshot } from "../../entitlements/domain/model";
import { buildEntitlementSnapshot } from "../../entitlements/domain/handler";
import { getLockedFeatures } from "../../entitlements/domain/policy";
import type { FeatureKey } from "../../entitlements/domain/feature-keys";
import { asIsoUtcTimestamp, dateOwner } from "../../../platform/core/dates";

export interface DashboardData {
  loading: boolean;
  error?: string;
  identity?: { uid: string; email: string; name?: string };
  plan?: { name: string; status: string };
  earlyAccessEnabled?: boolean;
  updatedAt?: string;
  lockedFeatures: { key: FeatureKey; title: string }[];
  usage?: {
    reviews?: { used: number; limit: number };
    entities?: { used: number; limit: number };
    apiCalls?: { used: number; limit: number };
    sharedLinks?: { used: number; limit: number };
    storage?: { used: string; limit: string };
  };
  usageTrends?: {
    granularity: UsageTrendGranularity;
    series: Array<{
      metric: "reviews" | "entities" | "audios" | "shares";
      total: number;
      points: Array<{ label: string; count: number }>;
    }>;
  };
  usageTrendError?: string;
  usageTrendGranularity: UsageTrendGranularity;
  setUsageTrendGranularity: (value: UsageTrendGranularity) => void;
}

const profileService = new BackendUserProfileService();
const entitlementService = new BackendEntitlementService();

export function useDashboardData(): DashboardData {
  const { snapshot: preloadedEntitlementSnapshot } = useEntitlementContext();
  const [usageTrendGranularity, setUsageTrendGranularity] = useState<UsageTrendGranularity>("day");
  const [data, setData] = useState<DashboardData>({
    loading: true,
    lockedFeatures: [],
    usageTrendGranularity: "day",
    setUsageTrendGranularity: () => {},
  });

  useEffect(() => {
    let cancelled = false;
    const now = dateOwner.now();
    const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const to = now.toISOString();
    Promise.all([
      profileService.getFullProfile(),
      profileService.getUsageSummary({
        granularity: usageTrendGranularity,
        from: asIsoUtcTimestamp(from),
        to: asIsoUtcTimestamp(to),
      }),
      api.get<{ enabled: boolean }>("/session/early-access/status"),
    ]).then(async ([res, usageSummary, earlyAccessStatus]) => {
      if (cancelled) return;
      if (res.ok && res.data) {
        const { identity, plan, usage } = res.data;
        const entitlementResult = preloadedEntitlementSnapshot
          ? { ok: true as const, data: preloadedEntitlementSnapshot }
          : await entitlementService.getSnapshot();
        const snapshot = entitlementResult.ok
          ? entitlementResult.data
          : getEntitlementSnapshot() ??
            (identity
              ? buildEntitlementSnapshot(identity.uid, plan, usage)
              : createMockEntitlementSnapshot("unknown-user", "trial"));
        setEntitlementSnapshot(snapshot);

        setData({
          loading: false,
          error: undefined,
          identity: identity
            ? { uid: identity.uid, email: identity.email, name: identity.name || undefined }
            : undefined,
          plan: plan
            ? { name: plan.name ?? "Trial", status: plan.status ?? "active" }
            : undefined,
          earlyAccessEnabled:
            earlyAccessStatus.ok ? earlyAccessStatus.data.enabled : undefined,
          updatedAt: dateOwner.nowIso(),
          lockedFeatures: getLockedFeatures(snapshot),
          usage: usage
            ? {
                reviews: usage.reviewSubmissions ?? undefined,
                entities: usage.entityCreations ?? undefined,
                apiCalls: usage.apiRequests ?? undefined,
                sharedLinks: usage.sharedLinks ?? undefined,
                storage: usage.storageBytes
                  ? { used: formatBytes(usage.storageBytes.used ?? 0), limit: formatBytes(usage.storageBytes.limit ?? 0) }
                  : undefined,
              }
            : undefined,
          usageTrends: usageSummary.ok
            ? {
                granularity: usageSummary.data.granularity,
                series: usageSummary.data.series.map((series) => ({
                  metric: series.metric,
                  total: series.total,
                  points: series.points.map((point) => ({
                    label: formatTrendLabel(point.windowStart, usageSummary.data.granularity),
                    count: point.count,
                  })),
                })),
              }
            : undefined,
          usageTrendError: usageSummary.ok ? undefined : usageSummary.error,
          usageTrendGranularity,
          setUsageTrendGranularity,
        });
      } else {
        if (!cancelled) {
          setData((d) => ({
            ...d,
            loading: false,
            error: res.ok ? "No dashboard data available." : res.error,
            earlyAccessEnabled:
              earlyAccessStatus.ok ? earlyAccessStatus.data.enabled : undefined,
            updatedAt: dateOwner.nowIso(),
            usageTrendGranularity,
            setUsageTrendGranularity,
          }));
        }
      }
    }).catch(() => {
      if (!cancelled) {
        setData((d) => ({
          ...d,
          loading: false,
          error: "Failed to load dashboard data.",
          updatedAt: dateOwner.nowIso(),
          usageTrendGranularity,
          setUsageTrendGranularity,
        }));
      }
    });
    return () => { cancelled = true; };
  }, [preloadedEntitlementSnapshot, usageTrendGranularity]);

  return {
    ...data,
    usageTrendGranularity,
    setUsageTrendGranularity,
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatTrendLabel(iso: string, granularity: UsageTrendGranularity): string {
  const date = new Date(iso);
  if (granularity === "month") {
    return date.toLocaleDateString(undefined, { month: "short" });
  }
  if (granularity === "week") {
    return `Wk ${Math.ceil(date.getDate() / 7)}`;
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
