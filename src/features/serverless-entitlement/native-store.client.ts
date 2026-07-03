import type { Result } from "../../platform/core/types";
import type { NativeStoreOwnershipStatus } from "./serverless-entitlement.model";

export interface NativeStorePurchaseRecord {
  productId: string;
  status: NativeStoreOwnershipStatus;
  purchasedAt?: string;
  expiresAt?: string;
  transactionId?: string;
}

export interface NativeStoreBillingClient {
  initialize(): Promise<Result<void>>;
  refreshPurchases(): Promise<Result<NativeStorePurchaseRecord[]>>;
  purchaseProduct(productId: string): Promise<Result<NativeStorePurchaseRecord[]>>;
  restorePurchases(): Promise<Result<NativeStorePurchaseRecord[]>>;
}
