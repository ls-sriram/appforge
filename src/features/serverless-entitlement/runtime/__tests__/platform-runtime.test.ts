import { PlatformServerlessEntitlementRuntime } from "../../platform.runtime";
import type { ServerlessEntitlementCatalog } from "../../runtime.catalog";
import type { NativeStoreBillingClient } from "../../native-store.client";

describe("serverless-entitlement/runtime/platform-runtime", () => {
  it("maps owned store records into a derived entitlement snapshot", async () => {
    const client = createClient({
      refreshPurchases: jest.fn().mockResolvedValue({
        ok: true,
        data: [
          {
            productId: "pro_monthly_ios",
            status: "active",
            transactionId: "tx_1",
          },
          {
            productId: "unknown_product",
            status: "active",
          },
          {
            productId: "lifetime_unlock_ios",
            status: "revoked",
            transactionId: "tx_2",
          },
        ],
      }),
    });

    const runtime = new PlatformServerlessEntitlementRuntime(
      "ios",
      buildCatalog(),
      client,
      () => "2026-06-30T12:00:00.000Z",
    );

    const result = await runtime.refreshPurchases();

    expect(result).toEqual({
      ok: true,
      data: {
        authority: "native_store",
        platform: "ios",
        activeProductIds: ["pro_monthly_ios"],
        ownedProducts: [
          {
            id: "pro_monthly_ios",
            kind: "subscription",
            platform: "ios",
            planKind: "subscription",
            subscriptionPeriod: { unit: "month", count: 1 },
            status: "active",
            purchasedAt: undefined,
            expiresAt: undefined,
            transactionId: "tx_1",
          },
          {
            id: "lifetime_unlock_ios",
            kind: "non_consumable",
            platform: "ios",
            planKind: "lifetime",
            status: "revoked",
            purchasedAt: undefined,
            expiresAt: undefined,
            transactionId: "tx_2",
          },
        ],
        refreshedAt: "2026-06-30T12:00:00.000Z",
      },
    });
  });

  it("rejects purchase requests for unsupported platform product ids", async () => {
    const runtime = new PlatformServerlessEntitlementRuntime("android", buildCatalog(), createClient());

    const result = await runtime.purchaseProduct({ productId: "pro_monthly_ios" });

    expect(result).toEqual({
      ok: false,
      error: "Unsupported product for android: pro_monthly_ios",
    });
  });
});

function createClient(
  overrides: Partial<jest.Mocked<NativeStoreBillingClient>> = {},
): jest.Mocked<NativeStoreBillingClient> {
  return {
    initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    refreshPurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    purchaseProduct: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    restorePurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    ...overrides,
  };
}

function buildCatalog(): ServerlessEntitlementCatalog {
  return {
    products: [
      {
        id: "pro_monthly_ios",
        kind: "subscription",
        platform: "ios",
        planKind: "subscription",
        subscriptionPeriod: { unit: "month", count: 1 },
      },
      {
        id: "lifetime_unlock_ios",
        kind: "non_consumable",
        platform: "ios",
        planKind: "lifetime",
      },
      {
        id: "pro_monthly_android",
        kind: "subscription",
        platform: "android",
        planKind: "subscription",
        subscriptionPeriod: { unit: "month", count: 1 },
      },
    ],
  };
}
