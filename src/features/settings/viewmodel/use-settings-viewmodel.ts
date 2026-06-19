import { useCallback, useEffect } from "react";
import { loadSettingsIdentity } from "../usecases/load-settings-identity";
import { deleteAccount } from "../usecases/delete-account";
import { signOut } from "../usecases/sign-out";
import { settingsStoreSetState, useSettingsStore } from "../viewmodel/store";

export function useSettingsViewModel() {
  const state = useSettingsStore();

  useEffect(() => {
    let cancelled = false;
    loadSettingsIdentity().then((result) => {
      if (cancelled) return;
      settingsStoreSetState((current) => ({
        ...current,
        loading: false,
        identity: result.ok ? result.data : undefined,
        profileDraftName: result.ok && result.data.name ? result.data.name : current.profileDraftName,
      }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const runSignOut = useCallback(async () => {
    await signOut();
  }, []);

  const runDeleteAccount = useCallback(async () => {
    console.log("[settings-vm] deleteAccount: usecase start");
    const result = await deleteAccount();
    console.log("[settings-vm] deleteAccount: usecase finished", {
      ok: result.ok,
      error: result.ok ? undefined : result.error,
    });
    return result;
  }, []);

  return {
    state,
    actions: {
      signOut: runSignOut,
      deleteAccount: runDeleteAccount,
    },
  };
}
