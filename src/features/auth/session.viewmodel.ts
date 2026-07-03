/**
 * ─────────────────────────────────────────────────────────────────
 * USE SESSION — Hook that reads active session state from SessionProvider.
 *
 * Exposes normalized session fields and sign-out helper.
 * ─────────────────────────────────────────────────────────────────
 */

import { api } from "../../platform/api/client";
import { useSessionContext } from "../../platform/providers/SessionProvider";
import { asIsoUtcTimestamp, type IsoUtcTimestamp } from "../../platform/core/dates/index";

interface SessionInfo {
  uid: string;
  email: string;
  name?: string;
  createdAt?: IsoUtcTimestamp;
  lastLoginAt?: IsoUtcTimestamp;
}

export function useSession() {
  const { session: rawSession, loading, clearSession } = useSessionContext();

  const session: SessionInfo | undefined = rawSession
    ? {
        uid: rawSession.identity?.uid ?? rawSession.uid ?? "",
        email: rawSession.identity?.email ?? "",
        name: rawSession.identity?.name || undefined,
        createdAt: asIsoUtcTimestamp(rawSession.createdAt) || undefined,
        lastLoginAt: asIsoUtcTimestamp(rawSession.lastLoginAt) || undefined,
      }
    : undefined;

  const signOut = async () => {
    try { await api.post("/session/logout"); } catch { /* best effort */ }
    clearSession();
  };

  return { session, loading, signOut };
}
