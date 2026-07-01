import type { Result } from "../../../platform/core/types";
import type {
  AppleStoreBillingBridge,
  AppleStoreTransactionSnapshot,
} from "./apple-store-client";

export interface AppleStorekitBridgeOptions {
  implementation?: AppleStorekitBridgeImplementation;
}

export interface AppleStorekitBridgeImplementation {
  initialize(): Promise<void>;
  refreshTransactions(): Promise<AppleStoreTransactionSnapshot[]>;
  purchaseProduct(productId: string): Promise<AppleStoreTransactionSnapshot[]>;
  restorePurchases(): Promise<AppleStoreTransactionSnapshot[]>;
}

export class AppleStorekitBridge implements AppleStoreBillingBridge {
  constructor(private readonly options: AppleStorekitBridgeOptions = {}) {}

  async initialize(): Promise<Result<void>> {
    if (!this.options.implementation) {
      return notImplemented("StoreKit bridge");
    }

    try {
      await this.options.implementation.initialize();
      return { ok: true, data: undefined };
    } catch (error) {
      return toErrorResult(error, "Failed to initialize StoreKit bridge.");
    }
  }

  async refreshTransactions(): Promise<Result<AppleStoreTransactionSnapshot[]>> {
    if (!this.options.implementation) {
      return notImplemented("StoreKit bridge");
    }

    try {
      return {
        ok: true,
        data: await this.options.implementation.refreshTransactions(),
      };
    } catch (error) {
      return toErrorResult(error, "Failed to refresh StoreKit transactions.");
    }
  }

  async purchaseProduct(productId: string): Promise<Result<AppleStoreTransactionSnapshot[]>> {
    if (!this.options.implementation) {
      return notImplemented("StoreKit bridge");
    }

    try {
      return {
        ok: true,
        data: await this.options.implementation.purchaseProduct(productId),
      };
    } catch (error) {
      return toErrorResult(error, `Failed to purchase StoreKit product ${productId}.`);
    }
  }

  async restorePurchases(): Promise<Result<AppleStoreTransactionSnapshot[]>> {
    if (!this.options.implementation) {
      return notImplemented("StoreKit bridge");
    }

    try {
      return {
        ok: true,
        data: await this.options.implementation.restorePurchases(),
      };
    } catch (error) {
      return toErrorResult(error, "Failed to restore StoreKit purchases.");
    }
  }
}

function notImplemented(name: string): Result<never> {
  return {
    ok: false,
    error: `${name} implementation is not configured.`,
  };
}

function toErrorResult<T>(error: unknown, fallback: string): Result<T> {
  if (error instanceof Error && error.message) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: fallback };
}
