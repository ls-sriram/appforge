import type { Result } from "../../../platform/core/types";
import type { ServerlessEntitlementState } from "../domain/model";
import type { ServerlessEntitlementController } from "../store/controller";

export function restorePurchases(
  controller: ServerlessEntitlementController,
): Promise<Result<ServerlessEntitlementState>> {
  return controller.restorePurchases();
}
