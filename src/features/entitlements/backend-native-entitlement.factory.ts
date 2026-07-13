import { AppleStoreBillingClient } from "../serverless-entitlement/apple-store.client";
import { AppleStorekitBridge, type AppleStorekitBridgeImplementation } from "../serverless-entitlement/apple-storekit.bridge";
import { GooglePlayBillingClient } from "../serverless-entitlement/google-play.client";
import { GooglePlayStoreBridge, type GooglePlayBillingBridgeImplementation } from "../serverless-entitlement/google-play-billing.bridge";
import type { NativeStorePlatform, NativeStoreProduct } from "../serverless-entitlement/serverless-entitlement.model";
import { BackendNativeEntitlementController } from "./backend-native-entitlement.controller";
import { BackendNativeEntitlementService, type BackendNativeEntitlementServiceApi } from "./backend-native-entitlement.service";

export interface BackendNativeEntitlementOptions {
  platform: NativeStorePlatform;
  products: NativeStoreProduct[];
  appleImplementation?: AppleStorekitBridgeImplementation;
  googlePlayImplementation?: GooglePlayBillingBridgeImplementation;
  service?: BackendNativeEntitlementServiceApi;
}

export function createBackendNativeEntitlementController(
  options: BackendNativeEntitlementOptions,
): BackendNativeEntitlementController {
  const client = options.platform === "ios"
    ? new AppleStoreBillingClient(new AppleStorekitBridge({ implementation: options.appleImplementation }))
    : new GooglePlayBillingClient(new GooglePlayStoreBridge({ implementation: options.googlePlayImplementation }));
  return new BackendNativeEntitlementController(
    options.platform,
    options.products,
    client,
    options.service ?? new BackendNativeEntitlementService(),
  );
}
