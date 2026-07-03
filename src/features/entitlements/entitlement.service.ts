import { Result } from "../../platform/core/types";
import { api } from "../../platform/api/client";
import type { EntitlementSnapshot } from "./entitlements.model";
import { parseEntitlementSnapshotResponse, type EntitlementSnapshotResponse } from "./entitlements.model";

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

