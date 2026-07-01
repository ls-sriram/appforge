import type { Result } from "../../../platform/core/types";
import type {
  GooglePlayBillingBridge,
  GooglePlayPurchaseSnapshot,
} from "./google-play-client";

export interface GooglePlayBillingBridgeOptions {
  implementation?: GooglePlayBillingBridgeImplementation;
}

export interface GooglePlayBillingBridgeImplementation {
  initialize(): Promise<void>;
  queryPurchases(): Promise<GooglePlayPurchaseSnapshot[]>;
  purchaseProduct(productId: string): Promise<GooglePlayPurchaseSnapshot[]>;
  restorePurchases(): Promise<GooglePlayPurchaseSnapshot[]>;
}

export class GooglePlayStoreBridge implements GooglePlayBillingBridge {
  constructor(private readonly options: GooglePlayBillingBridgeOptions = {}) {}

  async initialize(): Promise<Result<void>> {
    if (!this.options.implementation) {
      return notImplemented("Google Play billing bridge");
    }

    try {
      await this.options.implementation.initialize();
      return { ok: true, data: undefined };
    } catch (error) {
      return toErrorResult(error, "Failed to initialize Google Play billing bridge.");
    }
  }

  async queryPurchases(): Promise<Result<GooglePlayPurchaseSnapshot[]>> {
    if (!this.options.implementation) {
      return notImplemented("Google Play billing bridge");
    }

    try {
      return {
        ok: true,
        data: await this.options.implementation.queryPurchases(),
      };
    } catch (error) {
      return toErrorResult(error, "Failed to query Google Play purchases.");
    }
  }

  async purchaseProduct(productId: string): Promise<Result<GooglePlayPurchaseSnapshot[]>> {
    if (!this.options.implementation) {
      return notImplemented("Google Play billing bridge");
    }

    try {
      return {
        ok: true,
        data: await this.options.implementation.purchaseProduct(productId),
      };
    } catch (error) {
      return toErrorResult(error, `Failed to purchase Google Play product ${productId}.`);
    }
  }

  async restorePurchases(): Promise<Result<GooglePlayPurchaseSnapshot[]>> {
    if (!this.options.implementation) {
      return notImplemented("Google Play billing bridge");
    }

    try {
      return {
        ok: true,
        data: await this.options.implementation.restorePurchases(),
      };
    } catch (error) {
      return toErrorResult(error, "Failed to restore Google Play purchases.");
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
