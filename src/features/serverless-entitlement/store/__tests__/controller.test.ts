import { ServerlessEntitlementController } from "../../serverless-entitlement.service";
import type { Result } from "../../../../platform/core/types";
import type {
  PurchaseProductInput,
  ServerlessEntitlementSnapshot,
} from "../../serverless-entitlement.model";
import type {
  ServerlessEntitlementCache,
  ServerlessEntitlementRuntime,
} from "../../serverless-entitlement.runtime";

describe("serverless-entitlement/store/controller", () => {
  it("hydrates cache first, then refreshes live purchases on initialize", async () => {
    const cachedSnapshot = buildSnapshot({
      refreshedAt: "2026-06-29T00:00:00.000Z",
      activeProductIds: ["lifetime_unlock"],
      ownedProducts: [
        buildOwnedProduct({
          id: "lifetime_unlock",
          kind: "non_consumable",
          planKind: "lifetime",
        }),
      ],
    });
    const liveSnapshot = buildSnapshot({
      refreshedAt: "2026-06-30T00:00:00.000Z",
      activeProductIds: ["pro_monthly"],
      ownedProducts: [
        buildOwnedProduct({
          id: "pro_monthly",
          kind: "subscription",
          planKind: "subscription",
          subscriptionPeriod: { unit: "month", count: 1 },
        }),
      ],
    });
    const runtime = createRuntime({
      initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      refreshPurchases: jest.fn().mockResolvedValue({ ok: true, data: liveSnapshot }),
    });
    const cache = createCache({
      read: jest.fn().mockResolvedValue({
        ok: true,
        data: { snapshot: cachedSnapshot, cachedAt: cachedSnapshot.refreshedAt },
      }),
      write: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    });
    const controller = new ServerlessEntitlementController(runtime, cache);
    const listener = jest.fn();
    controller.subscribe(listener);

    const result = await controller.initialize();

    expect(result.ok).toBe(true);
    expect(runtime.initialize).toHaveBeenCalledTimes(1);
    expect(runtime.refreshPurchases).toHaveBeenCalledTimes(1);
    expect(cache.write).toHaveBeenCalledWith({
      snapshot: liveSnapshot,
      cachedAt: liveSnapshot.refreshedAt,
    });
    expect(listener).toHaveBeenCalled();
    expect(controller.getState()).toMatchObject({
      initialized: true,
      loading: false,
      cacheState: "hydrated",
      lastSyncedAt: "2026-06-30T00:00:00.000Z",
      snapshot: liveSnapshot,
    });
  });

  it("marks cache stale when live refresh fails after cached entitlement is present", async () => {
    const cachedSnapshot = buildSnapshot({
      ownedProducts: [
        buildOwnedProduct({
          id: "pro_yearly",
          kind: "subscription",
          planKind: "subscription",
          subscriptionPeriod: { unit: "year", count: 1 },
        }),
      ],
      activeProductIds: ["pro_yearly"],
    });
    const runtime = createRuntime({
      initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      refreshPurchases: jest.fn().mockResolvedValue({ ok: false, error: "Store unavailable" }),
    });
    const cache = createCache({
      read: jest.fn().mockResolvedValue({
        ok: true,
        data: { snapshot: cachedSnapshot, cachedAt: cachedSnapshot.refreshedAt },
      }),
    });
    const controller = new ServerlessEntitlementController(runtime, cache);

    const result = await controller.initialize();

    expect(result).toEqual({ ok: false, error: "Store unavailable" });
    expect(controller.getState()).toMatchObject({
      initialized: true,
      loading: false,
      cacheState: "stale",
      error: "Store unavailable",
      snapshot: cachedSnapshot,
    });
  });

  it("supports purchase and restore flows for different native store plan types", async () => {
    const runtime = createRuntime({
      purchaseProduct: jest.fn<Promise<Result<ServerlessEntitlementSnapshot>>, [PurchaseProductInput]>(async (input) => {
        if (input.productId === "lifetime_unlock") {
          return {
            ok: true,
            data: buildSnapshot({
              activeProductIds: ["lifetime_unlock"],
              ownedProducts: [
                buildOwnedProduct({
                  id: "lifetime_unlock",
                  kind: "non_consumable",
                  planKind: "lifetime",
                }),
              ],
            }),
          };
        }

        return {
          ok: true,
          data: buildSnapshot({
            activeProductIds: [input.productId],
            ownedProducts: [
              buildOwnedProduct({
                id: input.productId,
                kind: "subscription",
                planKind: "subscription",
                subscriptionPeriod: { unit: "year", count: 1 },
              }),
            ],
          }),
        };
      }),
      restorePurchases: jest.fn().mockResolvedValue({
        ok: true,
        data: buildSnapshot({
          activeProductIds: ["lifetime_unlock", "pro_yearly"],
          ownedProducts: [
            buildOwnedProduct({
              id: "lifetime_unlock",
              kind: "non_consumable",
              planKind: "lifetime",
            }),
            buildOwnedProduct({
              id: "pro_yearly",
              kind: "subscription",
              planKind: "subscription",
              subscriptionPeriod: { unit: "year", count: 1 },
            }),
          ],
        }),
      }),
    });
    const controller = new ServerlessEntitlementController(runtime);

    const lifetimeResult = await controller.purchaseProduct({ productId: "lifetime_unlock" });
    const yearlyResult = await controller.purchaseProduct({ productId: "pro_yearly" });
    const restoreResult = await controller.restorePurchases();

    expect(lifetimeResult.ok).toBe(true);
    expect(yearlyResult.ok).toBe(true);
    expect(restoreResult.ok).toBe(true);
    expect(runtime.purchaseProduct).toHaveBeenNthCalledWith(1, { productId: "lifetime_unlock" });
    expect(runtime.purchaseProduct).toHaveBeenNthCalledWith(2, { productId: "pro_yearly" });
    expect(runtime.restorePurchases).toHaveBeenCalledTimes(1);
    expect(controller.getState().snapshot?.activeProductIds).toEqual(["lifetime_unlock", "pro_yearly"]);
  });
});

function createRuntime(
  overrides: Partial<jest.Mocked<ServerlessEntitlementRuntime>> = {},
): jest.Mocked<ServerlessEntitlementRuntime> {
  return {
    initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    refreshPurchases: jest.fn().mockResolvedValue({ ok: true, data: buildSnapshot() }),
    purchaseProduct: jest.fn().mockResolvedValue({ ok: true, data: buildSnapshot() }),
    restorePurchases: jest.fn().mockResolvedValue({ ok: true, data: buildSnapshot() }),
    ...overrides,
  };
}

function createCache(
  overrides: Partial<jest.Mocked<ServerlessEntitlementCache>> = {},
): jest.Mocked<ServerlessEntitlementCache> {
  return {
    read: jest.fn().mockResolvedValue({ ok: true, data: null }),
    write: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    clear: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    ...overrides,
  };
}

function buildSnapshot(
  overrides: Partial<ServerlessEntitlementSnapshot> = {},
): ServerlessEntitlementSnapshot {
  return {
    authority: "native_store",
    platform: "ios",
    activeProductIds: [],
    ownedProducts: [],
    refreshedAt: "2026-06-30T12:00:00.000Z",
    ...overrides,
  };
}

function buildOwnedProduct(
  overrides: Partial<ServerlessEntitlementSnapshot["ownedProducts"][number]> & {
    id: string;
    kind: ServerlessEntitlementSnapshot["ownedProducts"][number]["kind"];
    planKind: ServerlessEntitlementSnapshot["ownedProducts"][number]["planKind"];
  },
): ServerlessEntitlementSnapshot["ownedProducts"][number] {
  return {
    platform: "ios",
    status: "active",
    transactionId: `${overrides.id}_tx`,
    ...overrides,
  };
}
