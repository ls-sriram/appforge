export const FEATURE_KEYS = [
  "review_submissions",
  "entity_creations",
  "api_requests",
  "shared_links",
  "storage_bytes",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];
