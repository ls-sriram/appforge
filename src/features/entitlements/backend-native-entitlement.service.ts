import type { Result } from "../../platform/core/types";
import { api } from "../../platform/api/client";
import type { NativeStorePlatform } from "../serverless-entitlement/serverless-entitlement.model";
import {
  parseEntitlementSnapshotResponse,
  type EntitlementSnapshot,
  type EntitlementSnapshotResponse,
} from "./entitlements.model";

export interface NativePurchaseConfirmation {
  platform: NativeStorePlatform;
  productId: string;
  transactionId: string;
}

export interface BackendNativeEntitlementServiceApi {
  confirmPurchase(input: NativePurchaseConfirmation): Promise<Result<EntitlementSnapshot>>;
  getSnapshot(): Promise<Result<EntitlementSnapshot>>;
}

export class BackendNativeEntitlementService implements BackendNativeEntitlementServiceApi {
  async confirmPurchase(input: NativePurchaseConfirmation): Promise<Result<EntitlementSnapshot>> {
    const result = await api.post<EntitlementSnapshotResponse>("/billing/native/confirm", input);
    return result.ok
      ? { ok: true, data: parseEntitlementSnapshotResponse(result.data) }
      : { ok: false, error: result.error };
  }

  async getSnapshot(): Promise<Result<EntitlementSnapshot>> {
    const result = await api.get<EntitlementSnapshotResponse>("/billing/entitlement");
    return result.ok
      ? { ok: true, data: parseEntitlementSnapshotResponse(result.data) }
      : { ok: false, error: result.error };
  }
}
