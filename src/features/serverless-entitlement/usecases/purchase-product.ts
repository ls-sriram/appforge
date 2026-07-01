import type { Result } from "../../../platform/core/types";
import type { PurchaseProductInput, ServerlessEntitlementState } from "../domain/model";
import type { ServerlessEntitlementController } from "../store/controller";

export function purchaseProduct(
  controller: ServerlessEntitlementController,
  input: PurchaseProductInput,
): Promise<Result<ServerlessEntitlementState>> {
  return controller.purchaseProduct(input);
}
