import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import {
  ServerlessEntitlementProvider,
  useServerlessEntitlementContext,
} from "../ServerlessEntitlementProvider";
import type { AppleStoreBillingBridge } from "../../../features/serverless-entitlement/index";

describe("ServerlessEntitlementProvider", () => {
  it("initializes serverless entitlement state and exposes actions", async () => {
    const bridge: AppleStoreBillingBridge = {
      initialize: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
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
      purchaseProduct: jest.fn().mockResolvedValue({
        ok: true,
        data: [
          {
            productId: "pro_yearly_ios",
            transactionId: "tx_2",
            entitlementState: "active",
            expirationDate: "2027-06-01T00:00:00.000Z",
          },
        ],
      }),
      restorePurchases: jest.fn().mockResolvedValue({
        ok: true,
        data: [
          {
            productId: "lifetime_unlock_ios",
            transactionId: "tx_3",
            entitlementState: "active",
          },
        ],
      }),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ServerlessEntitlementProvider
        options={{
          platform: "ios",
          config: {
            products: [
              {
                id: "pro_monthly_ios",
                kind: "subscription",
                platform: "ios",
                planKind: "subscription",
                subscriptionPeriod: { unit: "month", count: 1 },
              },
              {
                id: "pro_yearly_ios",
                kind: "subscription",
                platform: "ios",
                planKind: "subscription",
                subscriptionPeriod: { unit: "year", count: 1 },
              },
              {
                id: "lifetime_unlock_ios",
                kind: "non_consumable",
                platform: "ios",
                planKind: "lifetime",
              },
            ],
          },
          appleBridge: bridge,
        }}
      >
        {children}
      </ServerlessEntitlementProvider>
    );

    const { result } = renderHook(() => useServerlessEntitlementContext(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.state.snapshot?.activeProductIds).toEqual(["pro_monthly_ios"]);

    await act(async () => {
      await result.current.purchaseProduct({ productId: "pro_yearly_ios" });
    });

    expect(result.current.state.snapshot?.activeProductIds).toEqual(["pro_yearly_ios"]);

    await act(async () => {
      await result.current.restorePurchases();
    });

    expect(result.current.state.snapshot?.activeProductIds).toEqual(["lifetime_unlock_ios"]);
  });
});
