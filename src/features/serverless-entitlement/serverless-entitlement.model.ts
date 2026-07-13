export type ServerlessEntitlementAuthority = "native_store";

export type NativeStorePlatform = "ios" | "android";

export type NativeStoreProductKind = "subscription" | "non_consumable";

export type NativeStoreEntitlementPlanKind = "lifetime" | "subscription";

export type NativeStoreSubscriptionPeriodUnit = "day" | "week" | "month" | "year";

export type NativeStoreOwnershipStatus = "active" | "expired" | "revoked" | "pending";

export interface NativeStoreSubscriptionPeriod {
  unit: NativeStoreSubscriptionPeriodUnit;
  count: number;
}

export interface NativeStoreProduct {
  id: string;
  /** Server catalog id when the store SKU is platform-specific. */
  canonicalProductId?: string;
  kind: NativeStoreProductKind;
  platform: NativeStorePlatform;
  planKind: NativeStoreEntitlementPlanKind;
  subscriptionPeriod?: NativeStoreSubscriptionPeriod;
}

export interface OwnedNativeStoreProduct extends NativeStoreProduct {
  status: NativeStoreOwnershipStatus;
  purchasedAt?: string;
  expiresAt?: string;
  transactionId?: string;
}

export interface ServerlessEntitlementSnapshot {
  authority: ServerlessEntitlementAuthority;
  platform: NativeStorePlatform;
  activeProductIds: string[];
  ownedProducts: OwnedNativeStoreProduct[];
  refreshedAt: string;
}

export type ServerlessEntitlementCacheState = "empty" | "hydrated" | "stale";

export interface ServerlessEntitlementState {
  authority: ServerlessEntitlementAuthority;
  initialized: boolean;
  loading: boolean;
  cacheState: ServerlessEntitlementCacheState;
  snapshot: ServerlessEntitlementSnapshot | null;
  error?: string;
  lastSyncedAt?: string;
}

export interface ServerlessEntitlementCacheRecord {
  snapshot: ServerlessEntitlementSnapshot;
  cachedAt: string;
}

export interface PurchaseProductInput {
  productId: string;
}

export function supportsNativeStoreProduct(product: NativeStoreProduct): boolean {
  if (product.planKind === "lifetime") {
    return product.kind === "non_consumable" && product.subscriptionPeriod === undefined;
  }

  if (product.kind !== "subscription" || !product.subscriptionPeriod) {
    return false;
  }

  return product.subscriptionPeriod.count > 0;
}

export function isLifetimeProduct(product: NativeStoreProduct): boolean {
  return product.planKind === "lifetime";
}

export function isSubscriptionProduct(product: NativeStoreProduct): boolean {
  return product.planKind === "subscription";
}

export function getNativeStorePlanLabel(product: NativeStoreProduct): string {
  if (product.planKind === "lifetime") {
    return "lifetime";
  }

  const period = product.subscriptionPeriod;
  if (!period) {
    return "subscription";
  }

  if (period.count === 1) {
    if (period.unit === "month") return "monthly";
    if (period.unit === "year") return "yearly";
    if (period.unit === "week") return "weekly";
    if (period.unit === "day") return "daily";
  }

  return `${period.count}_${period.unit}`;
}
