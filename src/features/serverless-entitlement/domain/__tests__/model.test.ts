import {
  getNativeStorePlanLabel,
  isLifetimeProduct,
  isSubscriptionProduct,
  supportsNativeStoreProduct,
  type NativeStoreProduct,
} from "../../serverless-entitlement.model";

describe("serverless-entitlement/domain/model", () => {
  it("supports a lifetime unlock as a non-consumable product", () => {
    const product: NativeStoreProduct = {
      id: "lifetime_unlock",
      kind: "non_consumable",
      platform: "ios",
      planKind: "lifetime",
    };

    expect(supportsNativeStoreProduct(product)).toBe(true);
    expect(isLifetimeProduct(product)).toBe(true);
    expect(isSubscriptionProduct(product)).toBe(false);
    expect(getNativeStorePlanLabel(product)).toBe("lifetime");
  });

  it("supports monthly and yearly subscription products on either store", () => {
    const monthly: NativeStoreProduct = {
      id: "pro_monthly",
      kind: "subscription",
      platform: "android",
      planKind: "subscription",
      subscriptionPeriod: { unit: "month", count: 1 },
    };
    const yearly: NativeStoreProduct = {
      id: "pro_yearly",
      kind: "subscription",
      platform: "ios",
      planKind: "subscription",
      subscriptionPeriod: { unit: "year", count: 1 },
    };

    expect(supportsNativeStoreProduct(monthly)).toBe(true);
    expect(getNativeStorePlanLabel(monthly)).toBe("monthly");
    expect(isSubscriptionProduct(monthly)).toBe(true);

    expect(supportsNativeStoreProduct(yearly)).toBe(true);
    expect(getNativeStorePlanLabel(yearly)).toBe("yearly");
  });

  it("supports custom recurring cadences beyond monthly and yearly", () => {
    const weekly: NativeStoreProduct = {
      id: "pro_weekly",
      kind: "subscription",
      platform: "android",
      planKind: "subscription",
      subscriptionPeriod: { unit: "week", count: 1 },
    };
    const quarterly: NativeStoreProduct = {
      id: "pro_quarterly",
      kind: "subscription",
      platform: "ios",
      planKind: "subscription",
      subscriptionPeriod: { unit: "month", count: 3 },
    };

    expect(supportsNativeStoreProduct(weekly)).toBe(true);
    expect(getNativeStorePlanLabel(weekly)).toBe("weekly");

    expect(supportsNativeStoreProduct(quarterly)).toBe(true);
    expect(getNativeStorePlanLabel(quarterly)).toBe("3_month");
  });

  it("rejects mismatched lifetime and subscription metadata", () => {
    const invalidLifetime: NativeStoreProduct = {
      id: "bad_lifetime",
      kind: "non_consumable",
      platform: "ios",
      planKind: "lifetime",
      subscriptionPeriod: { unit: "year", count: 1 },
    };
    const invalidSubscription: NativeStoreProduct = {
      id: "bad_subscription",
      kind: "subscription",
      platform: "android",
      planKind: "subscription",
    };

    expect(supportsNativeStoreProduct(invalidLifetime)).toBe(false);
    expect(supportsNativeStoreProduct(invalidSubscription)).toBe(false);
  });
});
