import {
  GooglePlayBillingClient,
  mapGooglePlayPurchasesToPurchaseRecords,
  type GooglePlayBillingBridge,
} from "../google-play-client";

describe("serverless-entitlement/runtime/google-play-client", () => {
  it("maps Google Play purchases into native store purchase records", () => {
    const records = mapGooglePlayPurchasesToPurchaseRecords([
      {
        productIds: ["pro_monthly_android"],
        purchaseToken: "token_active",
        purchaseState: "purchased",
        acknowledged: true,
        purchaseTime: "2026-06-01T00:00:00.000Z",
        expiryTime: "2026-07-01T00:00:00.000Z",
        subscriptionState: "active",
      },
      {
        productIds: ["pro_hold_android"],
        purchaseToken: "token_hold",
        purchaseState: "purchased",
        acknowledged: true,
        subscriptionState: "on_hold",
      },
      {
        productIds: ["lifetime_unlock_android"],
        purchaseToken: "token_lifetime",
        purchaseState: "purchased",
        acknowledged: false,
      },
      {
        productIds: ["revoked_android"],
        purchaseToken: "token_revoked",
        purchaseState: "purchased",
        acknowledged: true,
        subscriptionState: "revoked",
      },
    ]);

    expect(records).toEqual([
      {
        productId: "pro_monthly_android",
        status: "active",
        purchasedAt: "2026-06-01T00:00:00.000Z",
        expiresAt: "2026-07-01T00:00:00.000Z",
        transactionId: "token_active",
      },
      {
        productId: "pro_hold_android",
        status: "pending",
        purchasedAt: undefined,
        expiresAt: undefined,
        transactionId: "token_hold",
      },
      {
        productId: "lifetime_unlock_android",
        status: "pending",
        purchasedAt: undefined,
        expiresAt: undefined,
        transactionId: "token_lifetime",
      },
      {
        productId: "revoked_android",
        status: "revoked",
        purchasedAt: undefined,
        expiresAt: undefined,
        transactionId: "token_revoked",
      },
    ]);
  });

  it("filters purchase results to the requested product id when needed", () => {
    const records = mapGooglePlayPurchasesToPurchaseRecords(
      [
        {
          productIds: ["pro_monthly_android", "bonus_product_android"],
          purchaseToken: "token_bundle",
          purchaseState: "purchased",
          acknowledged: true,
        },
      ],
      "pro_monthly_android",
    );

    expect(records).toEqual([
      {
        productId: "pro_monthly_android",
        status: "active",
        purchasedAt: undefined,
        expiresAt: undefined,
        transactionId: "token_bundle",
      },
    ]);
  });

  it("wraps a Google Play bridge behind the generic native billing client interface", async () => {
    const bridge = createBridge({
      queryPurchases: jest.fn().mockResolvedValue({
        ok: true,
        data: [
          {
            productIds: ["pro_monthly_android"],
            purchaseToken: "token_1",
            purchaseState: "purchased",
            acknowledged: true,
          },
        ],
      }),
    });

    const client = new GooglePlayBillingClient(bridge);
    const result = await client.refreshPurchases();

    expect(result).toEqual({
      ok: true,
      data: [
        {
          productId: "pro_monthly_android",
          status: "active",
          purchasedAt: undefined,
          expiresAt: undefined,
          transactionId: "token_1",
        },
      ],
    });
  });
});

function createBridge(
  overrides: Partial<jest.Mocked<GooglePlayBillingBridge>> = {},
): jest.Mocked<GooglePlayBillingBridge> {
  return {
    initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    queryPurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    purchaseProduct: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    restorePurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    ...overrides,
  };
}
