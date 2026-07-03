import { useCallback, useEffect } from "react";
import { loadProfileEditState } from "./load-profile-edit-state.usecase";
import { saveProfileName } from "./save-profile-name.usecase";
import { settingsStoreSetState, useSettingsStore } from "./settings.store";

export function useProfileEditViewModel() {
  const state = useSettingsStore();

  useEffect(() => {
    if (state.identity) return;
    let cancelled = false;
    loadProfileEditState().then((res) => {
      if (cancelled) return;
      settingsStoreSetState((current) => {
        if (!res.ok) {
          return {
            ...current,
            loading: false,
          };
        }
        return {
          ...current,
          loading: false,
        identity: {
          uid: res.data.uid,
          email: res.data.email,
          name: res.data.name,
          createdAt: res.data.createdAt,
          lastLoginAt: res.data.lastLoginAt,
        },
        profileDraftName: res.data.name || current.profileDraftName,
      };
    });
    });
    return () => {
      cancelled = true;
    };
  }, [state.identity]);

  const setDraftName = useCallback((name: string) => {
    settingsStoreSetState((current) => ({
      ...current,
      profileDraftName: name,
    }));
  }, []);

  const saveDraftName = useCallback(async () => {
    const name = state.profileDraftName.trim();
    if (!name) return false;
    const ok = await saveProfileName(name);
    if (!ok) return false;
    settingsStoreSetState((current) => ({
      ...current,
      identity: current.identity ? { ...current.identity, name } : current.identity,
      profileDraftName: name,
    }));
    return true;
  }, [state.profileDraftName]);

  return {
    state: {
      loading: state.loading,
      uid: state.identity?.uid ?? "",
      email: state.identity?.email ?? "",
      name: state.profileDraftName || state.identity?.name || "",
      createdAt: state.identity?.createdAt,
      lastLoginAt: state.identity?.lastLoginAt,
    },
    actions: {
      setDraftName,
      saveDraftName,
    },
  };
}
