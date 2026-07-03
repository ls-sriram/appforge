import { ServerlessEntitlementController } from "./serverless-entitlement.service";
import { AppleStoreBillingClient, type AppleStoreBillingBridge } from "./apple-store.client";
import { AppleStorekitBridge, type AppleStorekitBridgeImplementation } from "./apple-storekit.bridge";
import { createServerlessEntitlementRuntime } from "./runtime.factory";
import { GooglePlayBillingClient, type GooglePlayBillingBridge } from "./google-play.client";
import {
  GooglePlayStoreBridge,
  type GooglePlayBillingBridgeImplementation,
} from "./google-play-billing.bridge";
import type { NativeStorePlatform, NativeStoreProduct } from "./serverless-entitlement.model";
import type { ServerlessEntitlementCache } from "./serverless-entitlement.runtime";

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
