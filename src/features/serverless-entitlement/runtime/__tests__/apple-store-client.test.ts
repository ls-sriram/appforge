import {
  AppleStoreBillingClient,
  mapAppleTransactionsToPurchaseRecords,
  type AppleStoreBillingBridge,
} from "../apple-store-client";

describe("serverless-entitlement/runtime/apple-store-client", () => {
  it("maps StoreKit-style transactions into native store purchase records", () => {
    const records = mapAppleTransactionsToPurchaseRecords([
      {
        productId: "pro_monthly_ios",
        transactionId: "tx_active",
        purchaseDate: "2026-06-01T00:00:00.000Z",
        expirationDate: "2026-07-01T00:00:00.000Z",
        entitlementState: "active",
      },
      {
        productId: "pro_old_ios",
        transactionId: "tx_upgraded",
        entitlementState: "active",
        isUpgraded: true,
      },
      {
        productId: "pro_grace_ios",
        transactionId: "tx_grace",
        entitlementState: "in_grace_period",
      },
      {
        productId: "lifetime_unlock_ios",
        transactionId: "tx_revoked",
        entitlementState: "active",
        revocationDate: "2026-06-15T00:00:00.000Z",
      },
    ]);

    expect(records).toEqual([
      {
        productId: "pro_monthly_ios",
        status: "active",
        purchasedAt: "2026-06-01T00:00:00.000Z",
        expiresAt: "2026-07-01T00:00:00.000Z",
        transactionId: "tx_active",
      },
      {
        productId: "pro_grace_ios",
        status: "pending",
        purchasedAt: undefined,
        expiresAt: undefined,
        transactionId: "tx_grace",
      },
      {
        productId: "lifetime_unlock_ios",
        status: "revoked",
        purchasedAt: undefined,
        expiresAt: undefined,
        transactionId: "tx_revoked",
      },
    ]);
  });

  it("wraps an Apple bridge behind the generic native billing client interface", async () => {
    const bridge = createBridge({
      refreshTransactions: jest.fn().mockResolvedValue({
        ok: true,
        data: [
          {
            productId: "pro_monthly_ios",
            transactionId: "tx_1",
            entitlementState: "active",
          },
        ],
      }),
    });

    const client = new AppleStoreBillingClient(bridge);
    const result = await client.refreshPurchases();

    expect(result).toEqual({
      ok: true,
      data: [
        {
          productId: "pro_monthly_ios",
          status: "active",
          purchasedAt: undefined,
          expiresAt: undefined,
          transactionId: "tx_1",
        },
      ],
    });
  });
});

function createBridge(
  overrides: Partial<jest.Mocked<AppleStoreBillingBridge>> = {},
): jest.Mocked<AppleStoreBillingBridge> {
  return {
    initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    refreshTransactions: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    purchaseProduct: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    restorePurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    ...overrides,
  };
}
