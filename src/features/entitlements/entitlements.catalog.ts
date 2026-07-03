import type { FeatureKey } from "./feature.keys";
import type { EntitlementPlan } from "./entitlements.model";

export interface EntitlementCatalogFeatureConfig {
  title: string;
  unlocked: boolean;
  limit?: number;
}

export const FEATURE_TITLES: Record<FeatureKey, string> = {
  review_submissions: "Review Submissions",
  entity_creations: "Entity Creations",
  api_requests: "API Requests",
  shared_links: "Shared Links",
  storage_bytes: "Storage Bytes",
};

export const ENTITLEMENT_PLAN_CATALOG: Record<
  EntitlementPlan,
  Record<FeatureKey, EntitlementCatalogFeatureConfig>
> = {
  free: {
    review_submissions: { title: FEATURE_TITLES.review_submissions, unlocked: true, limit: 1 },
    entity_creations: { title: FEATURE_TITLES.entity_creations, unlocked: false, limit: 0 },
    api_requests: { title: FEATURE_TITLES.api_requests, unlocked: false, limit: 0 },
    shared_links: { title: FEATURE_TITLES.shared_links, unlocked: true, limit: 1 },
    storage_bytes: { title: FEATURE_TITLES.storage_bytes, unlocked: false, limit: 0 },
  },
  trial: {
    review_submissions: { title: FEATURE_TITLES.review_submissions, unlocked: true, limit: 3 },
    entity_creations: { title: FEATURE_TITLES.entity_creations, unlocked: true, limit: 5 },
    api_requests: { title: FEATURE_TITLES.api_requests, unlocked: true, limit: 50 },
    shared_links: { title: FEATURE_TITLES.shared_links, unlocked: true, limit: 3 },
    storage_bytes: { title: FEATURE_TITLES.storage_bytes, unlocked: true, limit: 10_485_760 },
  },
  pro: {
    review_submissions: { title: FEATURE_TITLES.review_submissions, unlocked: true, limit: 100 },
    entity_creations: { title: FEATURE_TITLES.entity_creations, unlocked: true, limit: 100 },
    api_requests: { title: FEATURE_TITLES.api_requests, unlocked: true, limit: 1000 },
    shared_links: { title: FEATURE_TITLES.shared_links, unlocked: true, limit: 100 },
    storage_bytes: { title: FEATURE_TITLES.storage_bytes, unlocked: true, limit: 1_073_741_824 },
  },
  plus: {
    review_submissions: { title: FEATURE_TITLES.review_submissions, unlocked: true, limit: 100 },
    entity_creations: { title: FEATURE_TITLES.entity_creations, unlocked: true, limit: 100 },
    api_requests: { title: FEATURE_TITLES.api_requests, unlocked: true, limit: 1000 },
    shared_links: { title: FEATURE_TITLES.shared_links, unlocked: true, limit: 100 },
    storage_bytes: { title: FEATURE_TITLES.storage_bytes, unlocked: true, limit: 1_073_741_824 },
  },
};
