import type { Result } from "../../../platform/core/types";
import type { ServerlessEntitlementState } from "../domain/model";
import type { ServerlessEntitlementController } from "../store/controller";

export function initializeEntitlement(
  controller: ServerlessEntitlementController,
): Promise<Result<ServerlessEntitlementState>> {
  return controller.initialize();
}
