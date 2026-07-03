import {
  findProductForPlatform,
  listProductsForPlatform,
  validateServerlessEntitlementCatalog,
} from "../../runtime.catalog";
import type { ServerlessEntitlementCatalog } from "../../runtime.catalog";

describe("serverless-entitlement/runtime/catalog", () => {
  it("filters catalog products by native platform", () => {
    const catalog = buildCatalog();

    expect(listProductsForPlatform(catalog, "ios").map((product) => product.id)).toEqual([
      "pro_monthly_ios",
      "lifetime_unlock_ios",
    ]);
    expect(findProductForPlatform(catalog, "android", "pro_monthly_android")?.id).toBe(
      "pro_monthly_android",
    );
  });

  it("rejects duplicate platform product ids", () => {
    const result = validateServerlessEntitlementCatalog({
      products: [
        ...buildCatalog().products,
        {
          id: "pro_monthly_ios",
          kind: "subscription",
          platform: "ios",
          planKind: "subscription",
          subscriptionPeriod: { unit: "month", count: 1 },
        },
      ],
    });

    expect(result).toEqual({
      ok: false,
      error: "Duplicate native store product configured for ios:pro_monthly_ios.",
    });
  });

  it("rejects invalid product definitions before runtime creation", () => {
    const result = validateServerlessEntitlementCatalog({
      products: [
        {
          id: "bad_yearly",
          kind: "subscription",
          platform: "ios",
          planKind: "subscription",
        },
      ],
    });

    expect(result).toEqual({
      ok: false,
      error: "Unsupported native store product configuration for ios:bad_yearly.",
    });
  });
});

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
