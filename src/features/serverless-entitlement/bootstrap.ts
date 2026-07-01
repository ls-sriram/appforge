import { ServerlessEntitlementController } from "./store/controller";
import { AppleStoreBillingClient, type AppleStoreBillingBridge } from "./runtime/apple-store-client";
import { AppleStorekitBridge, type AppleStorekitBridgeImplementation } from "./runtime/apple-storekit-bridge";
import { createServerlessEntitlementRuntime } from "./runtime/factory";
import { GooglePlayBillingClient, type GooglePlayBillingBridge } from "./runtime/google-play-client";
import {
  GooglePlayStoreBridge,
  type GooglePlayBillingBridgeImplementation,
} from "./runtime/google-play-billing-bridge";
import type { NativeStorePlatform, NativeStoreProduct } from "./domain/model";
import type { ServerlessEntitlementCache } from "./runtime/runtime";

export interface ServerlessEntitlementBootstrapConfig {
  products: NativeStoreProduct[];
}

export interface ServerlessEntitlementBootstrapOptions {
  config: ServerlessEntitlementBootstrapConfig;
  cache?: ServerlessEntitlementCache;
  platform?: NativeStorePlatform | "web";
  now?: () => string;
  appleBridge?: AppleStoreBillingBridge;
  googlePlayBridge?: GooglePlayBillingBridge;
  appleImplementation?: AppleStorekitBridgeImplementation;
  googlePlayImplementation?: GooglePlayBillingBridgeImplementation;
}

export function createServerlessEntitlementController(
  options: ServerlessEntitlementBootstrapOptions,
): ServerlessEntitlementController {
  const runtime = createServerlessEntitlementRuntime({
    catalog: { products: options.config.products },
    platform: options.platform,
    now: options.now,
    clients: {
      ios: new AppleStoreBillingClient(
        options.appleBridge ??
          new AppleStorekitBridge({
            implementation: options.appleImplementation,
          }),
      ),
      android: new GooglePlayBillingClient(
        options.googlePlayBridge ??
          new GooglePlayStoreBridge({
            implementation: options.googlePlayImplementation,
          }),
      ),
    },
  });

  return new ServerlessEntitlementController(runtime, options.cache);
}

export const serverlessEntitlementConfig: ServerlessEntitlementBootstrapConfig = {
  products: [],
};
