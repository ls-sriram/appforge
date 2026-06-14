import { Result } from "../core/types";
import { api } from "./ApiClient";
import type { EntitlementSnapshot } from "../features/entitlements/domain/model";
import { parseEntitlementSnapshotResponse, type EntitlementSnapshotResponse } from "../features/entitlements/domain/model";

export interface EntitlementService {
  getSnapshot(): Promise<Result<EntitlementSnapshot>>;
}

export class BackendEntitlementService implements EntitlementService {
  async getSnapshot(): Promise<Result<EntitlementSnapshot>> {
    const result = await api.get<EntitlementSnapshotResponse>("/billing/entitlement");
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    return { ok: true, data: parseEntitlementSnapshotResponse(result.data) };
  }
}

