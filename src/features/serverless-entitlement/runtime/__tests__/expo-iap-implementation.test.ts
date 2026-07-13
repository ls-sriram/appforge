import { ExpoIapAppleImplementation, ExpoIapGooglePlayImplementation, type ExpoIapModuleAdapter } from "../../expo-iap.implementation";

function moduleWith(purchases: any[]): jest.Mocked<ExpoIapModuleAdapter> {
  return {
    initConnection: jest.fn().mockResolvedValue(true),
    fetchProducts: jest.fn().mockResolvedValue([]),
    getAvailablePurchases: jest.fn().mockResolvedValue(purchases),
    requestPurchase: jest.fn().mockResolvedValue(purchases),
    finishTransaction: jest.fn().mockResolvedValue(undefined),
  };
}

describe("Expo IAP implementations", () => {
  it("initializes the connection and looks up in-app and subscription products", async () => {
    const sdk = moduleWith([]);
    const implementation = new ExpoIapAppleImplementation([
      { id: "lifetime", kind: "non_consumable" },
      { id: "monthly", kind: "subscription" },
    ], async () => sdk);
    await implementation.initialize();
    expect(sdk.initConnection).toHaveBeenCalledTimes(1);
    expect(sdk.fetchProducts).toHaveBeenNthCalledWith(1, { skus: ["lifetime"], type: "in-app" });
    expect(sdk.fetchProducts).toHaveBeenNthCalledWith(2, { skus: ["monthly"], type: "subs" });
  });

  it("maps active and pending Apple transactions and finishes completed purchases", async () => {
    const sdk = moduleWith([
      { id: "tx-active", productId: "pro", purchaseState: "purchased", transactionDate: 1 },
      { id: "tx-pending", productId: "monthly", purchaseState: "pending" },
    ]);
    const implementation = new ExpoIapAppleImplementation([], async () => sdk);
    const transactions = await implementation.purchaseProduct("pro");
    expect(transactions.map((item) => item.entitlementState)).toEqual(["active", "in_billing_retry"]);
    expect(sdk.finishTransaction).toHaveBeenCalledTimes(1);
  });

  it("maps suspended and active Google purchases", async () => {
    const sdk = moduleWith([
      { id: "one", productId: "monthly", purchaseState: "pending", isSuspendedAndroid: true },
      { id: "two", productId: "lifetime", purchaseState: "purchased", purchaseToken: "token" },
    ]);
    const implementation = new ExpoIapGooglePlayImplementation([], async () => sdk);
    const purchases = await implementation.queryPurchases();
    expect(purchases[0].subscriptionState).toBe("on_hold");
    expect(purchases[1].purchaseState).toBe("purchased");
  });
});
