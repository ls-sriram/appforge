import { GooglePlayStoreBridge } from "../google-play-billing-bridge";

describe("serverless-entitlement/runtime/google-play-billing-bridge", () => {
  it("returns a clear error when no Google Play implementation is configured", async () => {
    const bridge = new GooglePlayStoreBridge();

    await expect(bridge.initialize()).resolves.toEqual({
      ok: false,
      error: "Google Play billing bridge implementation is not configured.",
    });
    await expect(bridge.queryPurchases()).resolves.toEqual({
      ok: false,
      error: "Google Play billing bridge implementation is not configured.",
    });
  });

  it("delegates to the provided Google Play implementation", async () => {
    const bridge = new GooglePlayStoreBridge({
      implementation: {
        initialize: jest.fn().mockResolvedValue(undefined),
        queryPurchases: jest.fn().mockResolvedValue([
          {
            productIds: ["pro_monthly_android"],
            purchaseToken: "token_1",
            purchaseState: "purchased",
            acknowledged: true,
          },
        ]),
        purchaseProduct: jest.fn().mockResolvedValue([]),
        restorePurchases: jest.fn().mockResolvedValue([]),
      },
    });

    const result = await bridge.queryPurchases();

    expect(result).toEqual({
      ok: true,
      data: [
        {
          productIds: ["pro_monthly_android"],
          purchaseToken: "token_1",
          purchaseState: "purchased",
          acknowledged: true,
        },
      ],
    });
  });
});
