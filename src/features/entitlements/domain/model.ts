import { dateOwner, fromProtoTimestamp, type IsoUtcTimestamp, type ProtoTimestampLike } from "@core/dates";
import type { FeatureKey } from "./feature-keys";
import { FEATURE_KEYS } from "./feature-keys";
import { ENTITLEMENT_PLAN_CATALOG } from "./catalog";

export type EntitlementPlan = "free" | "trial" | "pro" | "plus";

export interface EntitlementFeatureDto {
  key: string;
  unlocked: boolean;
  title?: string;
  used?: number;
  limit?: number;
}

export interface EntitlementSnapshotResponse {
  userId: string;
  plan: EntitlementPlan;
  updatedAt: ProtoTimestampLike;
  features: EntitlementFeatureDto[];
}

export interface EntitlementFeature {
  key: FeatureKey;
  unlocked: boolean;
  title: string;
  used: number;
  limit?: number;
}

export interface EntitlementSnapshot {
  userId: string;
  plan: EntitlementPlan;
  updatedAt: IsoUtcTimestamp;
  features: EntitlementFeature[];
}

export function parseEntitlementSnapshotResponse(
  response: EntitlementSnapshotResponse
): EntitlementSnapshot {
  return {
    userId: response.userId,
    plan: response.plan,
    updatedAt: fromProtoTimestamp(response.updatedAt) ?? dateOwner.nowIso(),
    features: response.features
      .filter((feature): feature is EntitlementFeatureDto & { key: FeatureKey } =>
        FEATURE_KEYS.includes(feature.key as FeatureKey)
      )
      .map((feature) => ({
        key: feature.key,
        unlocked: feature.unlocked,
        title: feature.title ?? feature.key.split("_").join(" "),
        used: feature.used ?? 0,
        limit: feature.limit ?? undefined,
      })),
  };
}

export function createMockEntitlementSnapshot(
  userId: string,
  plan: EntitlementPlan = "trial"
): EntitlementSnapshot {
  const catalog = ENTITLEMENT_PLAN_CATALOG[plan];
  return {
    userId,
    plan,
    updatedAt: dateOwner.nowIso(),
    features: FEATURE_KEYS.map((key) => ({
      key,
      unlocked: catalog[key].unlocked,
      title: catalog[key].title,
      used: 0,
      limit: catalog[key].limit,
    })),
  };
}
