import type { EntitlementSnapshot } from "../domain/model";

let entitlementSnapshot: EntitlementSnapshot | undefined;

export function setEntitlementSnapshot(snapshot: EntitlementSnapshot): void {
  entitlementSnapshot = snapshot;
}

export function getEntitlementSnapshot(): EntitlementSnapshot | undefined {
  return entitlementSnapshot;
}

export function clearEntitlementSnapshot(): void {
  entitlementSnapshot = undefined;
}
