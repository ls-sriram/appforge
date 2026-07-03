import type { EntitlementSnapshot } from "./entitlements.model";
import type { FeatureKey } from "./feature.keys";
import { FEATURE_KEYS } from "./feature.keys";
import { FEATURE_TITLES } from "./entitlements.catalog";

export interface LockedFeatureView {
  key: FeatureKey;
  title: string;
}

export function canAccessFeature(featureKey: FeatureKey, snapshot: EntitlementSnapshot): boolean {
  return snapshot.features.find((feature) => feature.key === featureKey)?.unlocked ?? false;
}

export function isFeatureLocked(featureKey: FeatureKey, snapshot: EntitlementSnapshot): boolean {
  return !canAccessFeature(featureKey, snapshot);
}

export function getLockedFeatures(snapshot: EntitlementSnapshot): LockedFeatureView[] {
  return FEATURE_KEYS
    .filter((featureKey) => isFeatureLocked(featureKey, snapshot))
    .map((featureKey) => ({
      key: featureKey,
      title: snapshot.features.find((feature) => feature.key === featureKey)?.title ?? FEATURE_TITLES[featureKey],
    }));
}
