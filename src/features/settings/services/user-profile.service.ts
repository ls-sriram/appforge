/**
 * ─────────────────────────────────────────────────────────────────
 * USER PROFILE SERVICE — Aggregates user identity, plan, and usage.
 *
 * Sources:
 *   GET /session/me  → identity (uid, email, name)
 *   GET /users/me    → full profile (plan, usage, dates)
 * ─────────────────────────────────────────────────────────────────
 */

import { Result } from "../../../platform/core/types";
import { api } from "../../../platform/api/client";
import type { components } from "../../../types/api";
import {
  asIsoUtcTimestamp,
  fromProtoTimestamp,
  type IsoUtcTimestamp,
  type ProtoTimestampLike,
} from "../../../platform/core/dates";
import { callProto } from "../../../platform/api/proto-client";
import type { SessionMeResponse } from "../../../generated/proto/auth/v1/auth";

type UserProfileResponse = components["schemas"]["UserProfileResponse"];
type PlanInfo = NonNullable<UserProfileResponse["plan"]>;
type UsageInfo = NonNullable<UserProfileResponse["usage"]>;
type TimestampField = string | ProtoTimestampLike | null | undefined;

// ─── Domain model (frontend's stable shape) ──────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  createdAt?: IsoUtcTimestamp;
  lastLoginAt?: IsoUtcTimestamp;
}

export interface Plan {
  name: "free" | "trial" | "pro" | "plus";
  status: "active" | "trialing" | "cancel_pending" | "past_due" | "canceled";
  expiresAt?: IsoUtcTimestamp;
  startedAt?: IsoUtcTimestamp;
  cancelAtPeriodEnd: boolean;
  checkoutUrl?: string;
}

export interface UsageMetric {
  used: number;
  limit: number;
  unlocked: boolean;
}

export interface Usage {
  reviewSubmissions: UsageMetric;
  entityCreations: UsageMetric;
  apiRequests: UsageMetric;
  sharedLinks: UsageMetric;
  storageBytes: UsageMetric;
}

export type UsageTrendGranularity = "day" | "week" | "month";
export type UsageTrendMetricKey = "reviews" | "entities" | "audios" | "shares";

export interface UsageTrendPoint {
  windowStart: IsoUtcTimestamp;
  count: number;
}

export interface UsageTrendSeries {
  metric: UsageTrendMetricKey;
  total: number;
  points: UsageTrendPoint[];
}

export interface UsageTrendSummary {
  granularity: UsageTrendGranularity;
  from?: IsoUtcTimestamp;
  to?: IsoUtcTimestamp;
  series: UsageTrendSeries[];
}

// ─── Service ─────────────────────────────────────────────────────

export interface UserProfileService {
  getIdentity(): Promise<Result<UserProfile>>;
  getFullProfile(): Promise<Result<{
    identity: UserProfile;
    plan?: Plan;
    usage?: Usage;
  }>>;
  getUsageSummary(params: {
    granularity: UsageTrendGranularity;
    from?: IsoUtcTimestamp;
    to?: IsoUtcTimestamp;
  }): Promise<Result<UsageTrendSummary>>;
  updateProfileName(name: string): Promise<Result<void>>;
}

export class BackendUserProfileService implements UserProfileService {
  async getIdentity(): Promise<Result<UserProfile>> {
    try {
      const result = await callProto<Record<string, never>, SessionMeResponse>(
        "auth.v1.AuthService.SessionMe",
      );

      if (!result.ok) {
        return { ok: false, error: result.error };
      }

      const d = result.data.identity;
      if (!d?.uid) {
        return { ok: false, error: "Session identity is missing uid." };
      }

      return {
        ok: true,
        data: {
          uid: d.uid,
          email: d.email ?? "",
          name: d.name || undefined,
          createdAt: fromProtoTimestamp(d.createdAt) || undefined,
          lastLoginAt: fromProtoTimestamp(d.lastLoginAt) || undefined,
        },
      };
    } catch (err: unknown) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch identity.",
      };
    }
  }

  async getFullProfile(): Promise<Result<{
    identity: UserProfile;
    plan?: Plan;
    usage?: Usage;
  }>> {
    try {
      const result = await api.get<UserProfileResponse>("/users/me");

      if (!result.ok) {
        return { ok: false, error: result.error };
      }

      const d = result.data;
      if (!d.uid) {
        return { ok: false, error: "Profile response missing uid." };
      }

      return {
        ok: true,
        data: {
          identity: {
            uid: d.uid,
            email: d.email ?? "",
            name: d.name || undefined,
            createdAt: normalizeTimestamp(d.createdAt as TimestampField),
            lastLoginAt: normalizeTimestamp(d.lastLoginAt as TimestampField),
          },
          plan: d.plan ? this._mapPlan(d.plan) : undefined,
          usage: d.usage ? this._mapUsage(d.usage) : undefined,
        },
      };
    } catch (err: unknown) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch profile.",
      };
    }
  }

  async updateProfileName(name: string): Promise<Result<void>> {
    const trimmed = name.trim();
    if (!trimmed) {
      return { ok: false, error: "Name cannot be empty." };
    }
    try {
      const result = await api.put<{ success: boolean }>("/users/me", { name: trimmed });
      if (!result.ok) {
        return { ok: false, error: result.error };
      }
      if (!result.data?.success) {
        return { ok: false, error: "Profile update failed." };
      }
      return { ok: true, data: undefined };
    } catch (err: unknown) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to update profile.",
      };
    }
  }

  async getUsageSummary(params: {
    granularity: UsageTrendGranularity;
    from?: IsoUtcTimestamp;
    to?: IsoUtcTimestamp;
  }): Promise<Result<UsageTrendSummary>> {
    const query = new URLSearchParams();
    query.set("granularity", params.granularity);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    const path = `/users/me/usage?${query.toString()}`;
    try {
      const result = await api.get<{
        granularity: string;
        from?: TimestampField;
        to?: TimestampField;
        series: Array<{
          metric: string;
          total: number;
          buckets: Array<{ windowStart: TimestampField; count: number }>;
        }>;
      }>(path);
      if (!result.ok) return { ok: false, error: result.error };

      const mapped: UsageTrendSummary = {
        granularity: normalizeGranularity(result.data.granularity),
        from: normalizeTimestamp(result.data.from),
        to: normalizeTimestamp(result.data.to),
        series: result.data.series.map((series) => ({
          metric: normalizeMetric(series.metric),
          total: series.total,
          points: series.buckets
            .map((bucket) => {
              const windowStart = normalizeTimestamp(bucket.windowStart);
              if (!windowStart) return null;
              return { windowStart, count: bucket.count };
            })
            .filter((point): point is UsageTrendPoint => point !== null),
        })),
      };
      return { ok: true, data: mapped };
    } catch (err: unknown) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch usage summary.",
      };
    }
  }

  private _mapPlan(p: PlanInfo): Plan {
    return {
      name: p.name as Plan["name"],
      status: p.status as Plan["status"],
      expiresAt: normalizeTimestamp(p.expiresAt as TimestampField),
      startedAt: normalizeTimestamp(p.startedAt as TimestampField),
      cancelAtPeriodEnd: p.cancelAtPeriodEnd,
      checkoutUrl: p.checkoutUrl || undefined,
    };
  }

  private _mapUsage(u: UsageInfo): Usage {
    return {
      reviewSubmissions: this._mapUsageFeature(u.reviewSubmissions),
      entityCreations: this._mapUsageFeature(u.entityCreations),
      apiRequests: this._mapUsageFeature(u.apiRequests),
      sharedLinks: this._mapUsageFeature(u.sharedLinks),
      storageBytes: this._mapUsageFeature(u.storageBytes),
    };
  }

  private _mapUsageFeature(f: NonNullable<UsageInfo["reviewSubmissions"]>): UsageMetric {
    return { used: f.used, limit: f.limit, unlocked: f.unlocked };
  }
}

function normalizeTimestamp(value: TimestampField): IsoUtcTimestamp | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return asIsoUtcTimestamp(value);
  return fromProtoTimestamp(value);
}

function normalizeMetric(metric: string): UsageTrendMetricKey {
  switch (metric) {
    case "entities":
      return "entities";
    case "audios":
      return "audios";
    case "shares":
      return "shares";
    case "reviews":
    default:
      return "reviews";
  }
}

function normalizeGranularity(value: string): UsageTrendGranularity {
  if (value === "week" || value === "month") return value;
  return "day";
}
