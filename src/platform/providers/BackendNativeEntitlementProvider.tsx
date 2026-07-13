import React from "react";
import type { PurchaseProductInput } from "../../features/serverless-entitlement/serverless-entitlement.model";
import {
  createBackendNativeEntitlementController,
  type BackendNativeEntitlementOptions,
} from "../../features/entitlements/backend-native-entitlement.factory";
import type { BackendNativeEntitlementState } from "../../features/entitlements/backend-native-entitlement.controller";
import { setEntitlementSnapshot } from "../../features/entitlements/entitlements.store";
import type { Result } from "../core/types";

interface BackendNativeEntitlementContextValue {
  state: BackendNativeEntitlementState;
  purchaseProduct(input: PurchaseProductInput): Promise<Result<BackendNativeEntitlementState>>;
  restorePurchases(): Promise<Result<BackendNativeEntitlementState>>;
  refreshPurchases(): Promise<Result<BackendNativeEntitlementState>>;
}

const Context = React.createContext<BackendNativeEntitlementContextValue | null>(null);

export function BackendNativeEntitlementProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options: BackendNativeEntitlementOptions;
}) {
  const controller = React.useMemo(() => createBackendNativeEntitlementController(options), [options]);
  const [state, setState] = React.useState<BackendNativeEntitlementState>(controller.getState());

  React.useEffect(() => controller.subscribe(setState), [controller]);
  React.useEffect(() => { void controller.initialize(); }, [controller]);
  React.useEffect(() => {
    if (state.snapshot) setEntitlementSnapshot(state.snapshot);
  }, [state.snapshot]);

  const value = React.useMemo<BackendNativeEntitlementContextValue>(() => ({
    state,
    purchaseProduct: (input) => controller.purchaseProduct(input),
    restorePurchases: () => controller.restorePurchases(),
    refreshPurchases: () => controller.refreshPurchases(),
  }), [controller, state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBackendNativeEntitlementContext(): BackendNativeEntitlementContextValue {
  const value = React.useContext(Context);
  if (!value) throw new Error("useBackendNativeEntitlementContext() must be used inside BackendNativeEntitlementProvider");
  return value;
}

export function useOptionalBackendNativeEntitlementContext(): BackendNativeEntitlementContextValue | null {
  return React.useContext(Context);
}
