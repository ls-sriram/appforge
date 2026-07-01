import type { Result } from "../../../platform/core/types";
import type {
  PurchaseProductInput,
  ServerlessEntitlementCacheRecord,
  ServerlessEntitlementSnapshot,
} from "../domain/model";

export interface ServerlessEntitlementRuntime {
  initialize(): Promise<Result<void>>;
  refreshPurchases(): Promise<Result<ServerlessEntitlementSnapshot>>;
  purchaseProduct(input: PurchaseProductInput): Promise<Result<ServerlessEntitlementSnapshot>>;
  restorePurchases(): Promise<Result<ServerlessEntitlementSnapshot>>;
}

export interface ServerlessEntitlementCache {
  read(): Promise<Result<ServerlessEntitlementCacheRecord | null>>;
  write(record: ServerlessEntitlementCacheRecord): Promise<Result<void>>;
  clear(): Promise<Result<void>>;
}
