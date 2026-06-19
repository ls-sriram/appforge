import { dateOwner } from "@core/dates";
import type { Plan, Usage } from "../../settings/services/user-profile.service";
import { FEATURE_KEYS, type FeatureKey } from "./feature-keys";
import { ENTITLEMENT_PLAN_CATALOG } from "./catalog";
import type { EntitlementFeature, EntitlementPlan, EntitlementSnapshot } from "./model";

function resolvePlan(plan?: Plan): EntitlementPlan {
  const planName = plan?.name;
  if (planName === "free" || planName === "trial" || planName === "pro" || planName === "plus") {
    return planName;
  }
  return "trial";
}

function usageByFeature(usage?: Usage): Partial<Record<FeatureKey, { used: number; limit: number; unlocked: boolean }>> {
  if (!usage) return {};
  return {
    review_submissions: usage.reviewSubmissions,
    entity_creations: usage.entityCreations,
    api_requests: usage.apiRequests,
    shared_links: usage.sharedLinks,
    storage_bytes: usage.storageBytes,
  };
}

function buildFeature(featureKey: FeatureKey, plan: EntitlementPlan, usage?: Usage): EntitlementFeature {
  const defaults = ENTITLEMENT_PLAN_CATALOG[plan][featureKey];
  const live = usageByFeature(usage)[featureKey];
  return {
    key: featureKey,
    title: defaults.title,
    unlocked: live?.unlocked ?? defaults.unlocked,
    used: live?.used ?? 0,
    limit: live?.limit ?? defaults.limit,
  };
}

export function buildEntitlementSnapshot(
  userId: string,
  plan?: Plan,
  usage?: Usage
): EntitlementSnapshot {
  const resolvedPlan = resolvePlan(plan);
  return {
    userId,
    plan: resolvedPlan,
    updatedAt: dateOwner.nowIso(),
    features: FEATURE_KEYS.map((featureKey) => buildFeature(featureKey, resolvedPlan, usage)),
  };
}
