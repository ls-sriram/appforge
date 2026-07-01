import type { Result } from "../../../platform/core/types";
import type { ServerlessEntitlementState } from "../domain/model";
import type { ServerlessEntitlementController } from "../store/controller";

export function refreshPurchases(
  controller: ServerlessEntitlementController,
): Promise<Result<ServerlessEntitlementState>> {
  return controller.refreshPurchases();
}
