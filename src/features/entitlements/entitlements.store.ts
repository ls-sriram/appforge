import type { EntitlementSnapshot } from "./entitlements.model";

let entitlementSnapshot: EntitlementSnapshot | undefined;
const listeners = new Set<(snapshot?: EntitlementSnapshot) => void>();

export function setEntitlementSnapshot(snapshot: EntitlementSnapshot): void {
  entitlementSnapshot = snapshot;
  listeners.forEach((listener) => listener(snapshot));
}

export function getEntitlementSnapshot(): EntitlementSnapshot | undefined {
  return entitlementSnapshot;
}

export function clearEntitlementSnapshot(): void {
  entitlementSnapshot = undefined;
  listeners.forEach((listener) => listener(undefined));
}

export function subscribeEntitlementSnapshot(listener: (snapshot?: EntitlementSnapshot) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
