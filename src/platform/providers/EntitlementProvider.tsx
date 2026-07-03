import React from "react";
import { BackendEntitlementService } from "../../features/entitlements/entitlement.service";
import type { EntitlementSnapshot } from "../../features/entitlements/entitlements.model";
import { setEntitlementSnapshot, clearEntitlementSnapshot } from "../../features/entitlements/entitlements.store";
import { useSessionContext } from "./SessionProvider";

type EntitlementContextValue = {
  loading: boolean;
  snapshot?: EntitlementSnapshot;
};

const EntitlementContext = React.createContext<EntitlementContextValue | null>(null);
const entitlementService = new BackendEntitlementService();

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const { authenticated } = useSessionContext();
  const [loading, setLoading] = React.useState(false);
  const [snapshot, setSnapshot] = React.useState<EntitlementSnapshot | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;

    if (!authenticated) {
      clearEntitlementSnapshot();
      setSnapshot(undefined);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      setLoading(true);
      const result = await entitlementService.getSnapshot();
      if (cancelled) return;
      if (result.ok) {
        setSnapshot(result.data);
        setEntitlementSnapshot(result.data);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  const value = React.useMemo<EntitlementContextValue>(
    () => ({ loading, snapshot }),
    [loading, snapshot],
  );

  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>;
}

export function useEntitlementContext(): EntitlementContextValue {
  const ctx = React.useContext(EntitlementContext);
  if (!ctx) {
    throw new Error("useEntitlementContext() must be used inside EntitlementProvider");
  }
  return ctx;
}

