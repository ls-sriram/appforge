import { AppleStorekitBridge } from "../../apple-storekit.bridge";

describe("serverless-entitlement/runtime/apple-storekit-bridge", () => {
  it("returns a clear error when no StoreKit implementation is configured", async () => {
    const bridge = new AppleStorekitBridge();

    await expect(bridge.initialize()).resolves.toEqual({
      ok: false,
      error: "StoreKit bridge implementation is not configured.",
    });
    await expect(bridge.refreshTransactions()).resolves.toEqual({
      ok: false,
      error: "StoreKit bridge implementation is not configured.",
    });
  });

  it("delegates to the provided StoreKit implementation", async () => {
    const bridge = new AppleStorekitBridge({
      implementation: {
        initialize: jest.fn().mockResolvedValue(undefined),
        refreshTransactions: jest.fn().mockResolvedValue([
          {
            productId: "pro_monthly_ios",
            transactionId: "tx_1",
            entitlementState: "active",
          },
        ]),
        purchaseProduct: jest.fn().mockResolvedValue([]),
        restorePurchases: jest.fn().mockResolvedValue([]),
      },
    });

    const result = await bridge.refreshTransactions();

    expect(result).toEqual({
      ok: true,
      data: [
        {
          productId: "pro_monthly_ios",
          transactionId: "tx_1",
          entitlementState: "active",
        },
      ],
    });
  });
});
