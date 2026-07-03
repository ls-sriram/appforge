import { createServerlessEntitlementRuntime } from "../../runtime.factory";
import type { ServerlessEntitlementCatalog } from "../../runtime.catalog";
import type { NativeStoreBillingClient } from "../../native-store.client";

describe("serverless-entitlement/runtime/factory", () => {
  it("creates an iOS runtime when the catalog and client are configured", async () => {
    const runtime = createServerlessEntitlementRuntime({
      platform: "ios",
      catalog: buildCatalog(),
      clients: {
        ios: createClient({
          refreshPurchases: jest.fn().mockResolvedValue({
            ok: true,
            data: [{ productId: "pro_monthly_ios", status: "active", transactionId: "tx_1" }],
          }),
        }),
      },
      now: () => "2026-06-30T12:00:00.000Z",
    });

    const result = await runtime.refreshPurchases();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.platform).toBe("ios");
    expect(result.data.activeProductIds).toEqual(["pro_monthly_ios"]);
  });

  it("returns an unsupported runtime on web", async () => {
    const runtime = createServerlessEntitlementRuntime({
      platform: "web",
      catalog: buildCatalog(),
      clients: {},
    });

    const result = await runtime.initialize();

    expect(result).toEqual({
      ok: false,
      error: "Serverless entitlement is only supported on iOS and Android.",
    });
  });

  it("returns an unsupported runtime for invalid catalog configuration", async () => {
    const runtime = createServerlessEntitlementRuntime({
      platform: "ios",
      catalog: {
        products: [
          {
            id: "bad_subscription",
            kind: "subscription",
            platform: "ios",
            planKind: "subscription",
          },
        ],
      },
      clients: { ios: createClient() },
    });

    const result = await runtime.initialize();

    expect(result).toEqual({
      ok: false,
      error: "Unsupported native store product configuration for ios:bad_subscription.",
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
        id: "pro_monthly_android",
        kind: "subscription",
        platform: "android",
        planKind: "subscription",
        subscriptionPeriod: { unit: "month", count: 1 },
      },
    ],
  };
}
