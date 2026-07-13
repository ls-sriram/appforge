import { BackendNativeEntitlementController } from "../backend-native-entitlement.controller";
import type { BackendNativeEntitlementServiceApi } from "../backend-native-entitlement.service";
import type { NativeStoreBillingClient } from "../../serverless-entitlement/native-store.client";
import type { EntitlementSnapshot } from "../entitlements.model";

const snapshot: EntitlementSnapshot = {
  userId: "user-1",
  plan: "pro",
  updatedAt: "2026-07-13T12:00:00.000Z" as EntitlementSnapshot["updatedAt"],
  features: [],
};

describe("BackendNativeEntitlementController", () => {
  it("unlocks only after the server confirms the native transaction", async () => {
    const client: NativeStoreBillingClient = {
      initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      refreshPurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
      restorePurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
      purchaseProduct: jest.fn().mockResolvedValue({
        ok: true,
        data: [{ productId: "pro_monthly_ios", status: "active", transactionId: "tx-1" }],
      }),
    };
    const service: BackendNativeEntitlementServiceApi = {
      confirmPurchase: jest.fn().mockResolvedValue({ ok: true, data: snapshot }),
      getSnapshot: jest.fn().mockResolvedValue({ ok: true, data: snapshot }),
    };
    const controller = new BackendNativeEntitlementController(
      "ios",
      [{
        id: "pro_monthly_ios",
        canonicalProductId: "pro_monthly",
        platform: "ios",
        kind: "subscription",
        planKind: "subscription",
        subscriptionPeriod: { unit: "month", count: 1 },
      }],
      client,
      service,
    );

    const result = await controller.purchaseProduct({ productId: "pro_monthly" });

    expect(result.ok).toBe(true);
    expect(client.purchaseProduct).toHaveBeenCalledWith("pro_monthly_ios");
    expect(service.confirmPurchase).toHaveBeenCalledWith({
      platform: "ios",
      productId: "pro_monthly",
      transactionId: "tx-1",
    });
    expect(controller.getState().snapshot?.plan).toBe("pro");
    expect(controller.getState().authority).toBe("server");
  });

  it("does not expose a paid snapshot when server verification fails", async () => {
    const client: NativeStoreBillingClient = {
      initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      refreshPurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
      restorePurchases: jest.fn().mockResolvedValue({ ok: true, data: [] }),
      purchaseProduct: jest.fn().mockResolvedValue({
        ok: true,
        data: [{ productId: "pro", status: "active", transactionId: "bad-token" }],
      }),
    };
    const service: BackendNativeEntitlementServiceApi = {
      confirmPurchase: jest.fn().mockResolvedValue({ ok: false, error: "verification failed" }),
      getSnapshot: jest.fn().mockResolvedValue({ ok: true, data: snapshot }),
    };
    const controller = new BackendNativeEntitlementController(
      "android",
      [{ id: "pro", platform: "android", kind: "non_consumable", planKind: "lifetime" }],
      client,
      service,
    );

    const result = await controller.purchaseProduct({ productId: "pro" });

    expect(result).toEqual({ ok: false, error: "verification failed" });
    expect(controller.getState().snapshot).toBeUndefined();
  });
});
