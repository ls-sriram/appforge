import type { Result } from "../../platform/core/types";
import type { PurchaseProductInput, ServerlessEntitlementSnapshot } from "./serverless-entitlement.model";
import type { ServerlessEntitlementRuntime } from "./serverless-entitlement.runtime";

export class UnsupportedServerlessEntitlementRuntime implements ServerlessEntitlementRuntime {
  constructor(private readonly reason: string) {}

  initialize(): Promise<Result<void>> {
    return Promise.resolve({ ok: false, error: this.reason });
  }

  refreshPurchases(): Promise<Result<ServerlessEntitlementSnapshot>> {
    return Promise.resolve({ ok: false, error: this.reason });
  }

  purchaseProduct(_input: PurchaseProductInput): Promise<Result<ServerlessEntitlementSnapshot>> {
    return Promise.resolve({ ok: false, error: this.reason });
  }

  restorePurchases(): Promise<Result<ServerlessEntitlementSnapshot>> {
    return Promise.resolve({ ok: false, error: this.reason });
  }
}
