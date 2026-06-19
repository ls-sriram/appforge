import React from "react";
import { getSessionMe, isSessionAuthenticated, type SessionMePayload } from "../../features/auth/services/session.client";

type SessionContextValue = {
  loading: boolean;
  session?: SessionMePayload;
  authenticated: boolean;
  onboardingComplete: boolean;
  refreshSession: () => Promise<SessionMePayload | undefined>;
  clearSession: () => void;
};

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState<SessionMePayload | undefined>(undefined);

  const refreshSession = React.useCallback(async () => {
    const res = await getSessionMe();
    setLoading(false);
    if (res.ok) {
      setSession(res.data);
      return res.data;
    } else {
      setSession(undefined);
      return undefined;
    }
  }, []);

  const clearSession = React.useCallback(() => {
    setSession(undefined);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getSessionMe();
      if (cancelled) return;
      if (res.ok) {
        setSession(res.data);
      } else {
        setSession(undefined);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = React.useMemo<SessionContextValue>(() => {
    const authenticated = isSessionAuthenticated(session);
    return {
      loading,
      session,
      authenticated,
      onboardingComplete: Boolean(session?.onboardingCompleted),
      refreshSession,
      clearSession,
    };
  }, [clearSession, loading, refreshSession, session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContext(): SessionContextValue {
  const ctx = React.useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSessionContext() must be used inside SessionProvider");
  }
  return ctx;
}
