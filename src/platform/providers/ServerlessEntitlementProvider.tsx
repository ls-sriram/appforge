import React from "react";
import type {
  PurchaseProductInput,
  ServerlessEntitlementState,
} from "../../features/serverless-entitlement";
import {
  createServerlessEntitlementController,
  serverlessEntitlementConfig,
  type ServerlessEntitlementBootstrapOptions,
} from "../../features/serverless-entitlement/bootstrap";

type ServerlessEntitlementContextValue = {
  state: ServerlessEntitlementState;
  purchaseProduct: (input: PurchaseProductInput) => Promise<void>;
  restorePurchases: () => Promise<void>;
  refreshPurchases: () => Promise<void>;
};

const ServerlessEntitlementContext = React.createContext<ServerlessEntitlementContextValue | null>(null);

const EMPTY_STATE: ServerlessEntitlementState = {
  authority: "native_store",
  initialized: false,
  loading: false,
  cacheState: "empty",
  snapshot: null,
};

export function ServerlessEntitlementProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: Omit<ServerlessEntitlementBootstrapOptions, "config"> & {
    config?: ServerlessEntitlementBootstrapOptions["config"];
  };
}) {
  const controller = React.useMemo(
    () =>
      createServerlessEntitlementController({
        ...options,
        config: options?.config ?? serverlessEntitlementConfig,
      }),
    [options],
  );
  const [state, setState] = React.useState<ServerlessEntitlementState>(EMPTY_STATE);

  React.useEffect(() => controller.subscribe(setState), [controller]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await controller.initialize();
      if (cancelled || result.ok) return;
      setState(controller.getState());
    })();
    return () => {
      cancelled = true;
    };
  }, [controller]);

  const value = React.useMemo<ServerlessEntitlementContextValue>(
    () => ({
      state,
      purchaseProduct: async (input) => {
        await controller.purchaseProduct(input);
        setState(controller.getState());
      },
      restorePurchases: async () => {
        await controller.restorePurchases();
        setState(controller.getState());
      },
      refreshPurchases: async () => {
        await controller.refreshPurchases();
        setState(controller.getState());
      },
    }),
    [controller, state],
  );

  return (
    <ServerlessEntitlementContext.Provider value={value}>
      {children}
    </ServerlessEntitlementContext.Provider>
  );
}

export function useServerlessEntitlementContext(): ServerlessEntitlementContextValue {
  const ctx = React.useContext(ServerlessEntitlementContext);
  if (!ctx) {
    throw new Error("useServerlessEntitlementContext() must be used inside ServerlessEntitlementProvider");
  }
  return ctx;
}
