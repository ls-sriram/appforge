import type { Result } from "../../../platform/core/types";
import type { NativeStoreBillingClient, NativeStorePurchaseRecord } from "./native-store-client";

export type GooglePlayPurchaseState = "purchased" | "pending" | "unspecified";
export type GooglePlaySubscriptionState =
  | "active"
  | "in_grace_period"
  | "on_hold"
  | "paused"
  | "expired"
  | "revoked";

export interface GooglePlayPurchaseSnapshot {
  productIds: string[];
  purchaseToken: string;
  purchaseState: GooglePlayPurchaseState;
  acknowledged: boolean;
  purchaseTime?: string;
  expiryTime?: string;
  subscriptionState?: GooglePlaySubscriptionState;
}

export interface GooglePlayBillingBridge {
  initialize(): Promise<Result<void>>;
  queryPurchases(): Promise<Result<GooglePlayPurchaseSnapshot[]>>;
  purchaseProduct(productId: string): Promise<Result<GooglePlayPurchaseSnapshot[]>>;
  restorePurchases(): Promise<Result<GooglePlayPurchaseSnapshot[]>>;
}

export class GooglePlayBillingClient implements NativeStoreBillingClient {
  constructor(private readonly bridge: GooglePlayBillingBridge) {}

  initialize(): Promise<Result<void>> {
    return this.bridge.initialize();
  }

  async refreshPurchases(): Promise<Result<NativeStorePurchaseRecord[]>> {
    const result = await this.bridge.queryPurchases();
    return result.ok ? { ok: true, data: mapGooglePlayPurchasesToPurchaseRecords(result.data) } : result;
  }

  async purchaseProduct(productId: string): Promise<Result<NativeStorePurchaseRecord[]>> {
    const result = await this.bridge.purchaseProduct(productId);
    return result.ok ? { ok: true, data: mapGooglePlayPurchasesToPurchaseRecords(result.data, productId) } : result;
  }

  async restorePurchases(): Promise<Result<NativeStorePurchaseRecord[]>> {
    const result = await this.bridge.restorePurchases();
    return result.ok ? { ok: true, data: mapGooglePlayPurchasesToPurchaseRecords(result.data) } : result;
  }
}

export function mapGooglePlayPurchasesToPurchaseRecords(
  purchases: GooglePlayPurchaseSnapshot[],
  requestedProductId?: string,
): NativeStorePurchaseRecord[] {
  const records: NativeStorePurchaseRecord[] = [];

  for (const purchase of purchases) {
    for (const productId of purchase.productIds) {
      if (requestedProductId && productId !== requestedProductId) continue;
      records.push({
        productId,
        status: mapGooglePlayPurchaseState(purchase),
        purchasedAt: purchase.purchaseTime,
        expiresAt: purchase.expiryTime,
        transactionId: purchase.purchaseToken,
      });
    }
  }

  return records;
}

function mapGooglePlayPurchaseState(
  purchase: GooglePlayPurchaseSnapshot,
): NativeStorePurchaseRecord["status"] {
  if (purchase.subscriptionState === "revoked") return "revoked";
  if (purchase.subscriptionState === "expired") return "expired";
  if (
    purchase.purchaseState === "pending" ||
    purchase.subscriptionState === "in_grace_period" ||
    purchase.subscriptionState === "on_hold" ||
    purchase.subscriptionState === "paused" ||
    !purchase.acknowledged
  ) {
    return "pending";
  }
  if (purchase.purchaseState === "purchased") return "active";
  return "pending";
}
