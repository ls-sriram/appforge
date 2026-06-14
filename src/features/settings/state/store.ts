import { useSyncExternalStore } from "react";
import { SettingsIdentity } from "../domain/model";

export interface SettingsStoreState {
  loading: boolean;
  identity?: SettingsIdentity;
  profileDraftName: string;
}

type Listener = () => void;

const listeners = new Set<Listener>();

let state: SettingsStoreState = {
  loading: true,
  identity: undefined,
  profileDraftName: "",
};

function emit() {
  listeners.forEach((listener) => listener());
}

export function settingsStoreGetState(): SettingsStoreState {
  return state;
}

export function settingsStoreSetState(updater: (current: SettingsStoreState) => SettingsStoreState) {
  state = updater(state);
  emit();
}

export function settingsStoreReset() {
  state = {
    loading: true,
    identity: undefined,
    profileDraftName: "",
  };
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSettingsStore(): SettingsStoreState {
  return useSyncExternalStore(subscribe, settingsStoreGetState, settingsStoreGetState);
}
