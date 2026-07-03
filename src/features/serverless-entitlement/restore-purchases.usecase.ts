import type { Result } from "../../platform/core/types";
import type { ServerlessEntitlementState } from "./serverless-entitlement.model";
import type { ServerlessEntitlementController } from "./serverless-entitlement.service";

export function restorePurchases(
  controller: ServerlessEntitlementController,
): Promise<Result<ServerlessEntitlementState>> {
  return controller.restorePurchases();
}
