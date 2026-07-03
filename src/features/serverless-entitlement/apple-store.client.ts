import type { Result } from "../../platform/core/types";
import type { NativeStoreBillingClient, NativeStorePurchaseRecord } from "./native-store.client";

export type AppleStoreEntitlementState =
  | "active"
  | "expired"
  | "revoked"
  | "in_billing_retry"
  | "in_grace_period";

export interface AppleStoreTransactionSnapshot {
  productId: string;
  transactionId: string;
  purchaseDate?: string;
  expirationDate?: string;
  revocationDate?: string;
  isUpgraded?: boolean;
  entitlementState: AppleStoreEntitlementState;
}

export interface AppleStoreBillingBridge {
  initialize(): Promise<Result<void>>;
  refreshTransactions(): Promise<Result<AppleStoreTransactionSnapshot[]>>;
  purchaseProduct(productId: string): Promise<Result<AppleStoreTransactionSnapshot[]>>;
  restorePurchases(): Promise<Result<AppleStoreTransactionSnapshot[]>>;
}

export class AppleStoreBillingClient implements NativeStoreBillingClient {
  constructor(private readonly bridge: AppleStoreBillingBridge) {}

  initialize(): Promise<Result<void>> {
    return this.bridge.initialize();
  }

  async refreshPurchases(): Promise<Result<NativeStorePurchaseRecord[]>> {
    const result = await this.bridge.refreshTransactions();
    return result.ok ? { ok: true, data: mapAppleTransactionsToPurchaseRecords(result.data) } : result;
  }

  async purchaseProduct(productId: string): Promise<Result<NativeStorePurchaseRecord[]>> {
    const result = await this.bridge.purchaseProduct(productId);
    return result.ok ? { ok: true, data: mapAppleTransactionsToPurchaseRecords(result.data) } : result;
  }

  async restorePurchases(): Promise<Result<NativeStorePurchaseRecord[]>> {
    const result = await this.bridge.restorePurchases();
    return result.ok ? { ok: true, data: mapAppleTransactionsToPurchaseRecords(result.data) } : result;
  }
}

export function mapAppleTransactionsToPurchaseRecords(
  transactions: AppleStoreTransactionSnapshot[],
): NativeStorePurchaseRecord[] {
  return transactions
    .filter((transaction) => transaction.isUpgraded !== true)
    .map((transaction) => ({
      productId: transaction.productId,
      status: mapAppleEntitlementState(transaction),
      purchasedAt: transaction.purchaseDate,
      expiresAt: transaction.expirationDate,
      transactionId: transaction.transactionId,
    }));
}

function mapAppleEntitlementState(
  transaction: AppleStoreTransactionSnapshot,
): NativeStorePurchaseRecord["status"] {
  if (transaction.revocationDate) return "revoked";
  if (transaction.entitlementState === "revoked") return "revoked";
  if (transaction.entitlementState === "expired") return "expired";
  if (
    transaction.entitlementState === "in_billing_retry" ||
    transaction.entitlementState === "in_grace_period"
  ) {
    return "pending";
  }
  return "active";
}
