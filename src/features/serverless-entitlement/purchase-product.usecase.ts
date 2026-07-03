import type { Result } from "../../platform/core/types";
import type { PurchaseProductInput, ServerlessEntitlementState } from "./serverless-entitlement.model";
import type { ServerlessEntitlementController } from "./serverless-entitlement.service";

export function purchaseProduct(
  controller: ServerlessEntitlementController,
  input: PurchaseProductInput,
): Promise<Result<ServerlessEntitlementState>> {
  return controller.purchaseProduct(input);
}
