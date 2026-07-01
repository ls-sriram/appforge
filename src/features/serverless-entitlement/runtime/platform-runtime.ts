import type { Result } from "../../../platform/core/types";
import type {
  NativeStorePlatform,
  OwnedNativeStoreProduct,
  PurchaseProductInput,
  ServerlessEntitlementSnapshot,
} from "../domain/model";
import type { ServerlessEntitlementRuntime } from "./runtime";
import type { NativeStoreBillingClient, NativeStorePurchaseRecord } from "./native-store-client";
import type { ServerlessEntitlementCatalog } from "./catalog";
import { findProductForPlatform } from "./catalog";

export class PlatformServerlessEntitlementRuntime implements ServerlessEntitlementRuntime {
  constructor(
    private readonly platform: NativeStorePlatform,
    private readonly catalog: ServerlessEntitlementCatalog,
    private readonly client: NativeStoreBillingClient,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  initialize(): Promise<Result<void>> {
    return this.client.initialize();
  }

  async refreshPurchases(): Promise<Result<ServerlessEntitlementSnapshot>> {
    const result = await this.client.refreshPurchases();
    return result.ok ? this.buildSnapshot(result.data) : result;
  }

  async purchaseProduct(input: PurchaseProductInput): Promise<Result<ServerlessEntitlementSnapshot>> {
    const product = findProductForPlatform(this.catalog, this.platform, input.productId);
    if (!product) {
      return { ok: false, error: `Unsupported product for ${this.platform}: ${input.productId}` };
    }

    const result = await this.client.purchaseProduct(input.productId);
    return result.ok ? this.buildSnapshot(result.data) : result;
  }

  async restorePurchases(): Promise<Result<ServerlessEntitlementSnapshot>> {
    const result = await this.client.restorePurchases();
    return result.ok ? this.buildSnapshot(result.data) : result;
  }

  private buildSnapshot(records: NativeStorePurchaseRecord[]): Result<ServerlessEntitlementSnapshot> {
    const ownedProducts: OwnedNativeStoreProduct[] = [];

    for (const record of records) {
      const product = findProductForPlatform(this.catalog, this.platform, record.productId);
      if (!product) continue;

      ownedProducts.push({
        ...product,
        status: record.status,
        purchasedAt: record.purchasedAt,
        expiresAt: record.expiresAt,
        transactionId: record.transactionId,
      });
    }

    return {
      ok: true,
      data: {
        authority: "native_store",
        platform: this.platform,
        activeProductIds: ownedProducts
          .filter((product) => product.status === "active")
          .map((product) => product.id),
        ownedProducts,
        refreshedAt: this.now(),
      },
    };
  }
}
