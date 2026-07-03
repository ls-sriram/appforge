import { runtime as appRuntime, type RuntimePlatform } from "../../platform/core/runtime";
import type { NativeStorePlatform } from "./serverless-entitlement.model";
import type { NativeStoreBillingClient } from "./native-store.client";
import { PlatformServerlessEntitlementRuntime } from "./platform.runtime";
import type { ServerlessEntitlementCatalog } from "./runtime.catalog";
import { validateServerlessEntitlementCatalog } from "./runtime.catalog";
import type { ServerlessEntitlementRuntime } from "./serverless-entitlement.runtime";
import { UnsupportedServerlessEntitlementRuntime } from "./unsupported.runtime";

export interface CreateServerlessEntitlementRuntimeOptions {
  catalog: ServerlessEntitlementCatalog;
  platform?: RuntimePlatform;
  clients: Partial<Record<NativeStorePlatform, NativeStoreBillingClient>>;
  now?: () => string;
}

export function createServerlessEntitlementRuntime(
  options: CreateServerlessEntitlementRuntimeOptions,
): ServerlessEntitlementRuntime {
  const catalogResult = validateServerlessEntitlementCatalog(options.catalog);
  if (!catalogResult.ok) {
    return new UnsupportedServerlessEntitlementRuntime(catalogResult.error);
  }

  const platform = options.platform ?? appRuntime.platform;
  if (platform === "web") {
    return new UnsupportedServerlessEntitlementRuntime(
      "Serverless entitlement is only supported on iOS and Android.",
    );
  }

  const client = options.clients[platform];
  if (!client) {
    return new UnsupportedServerlessEntitlementRuntime(
      `No native store billing client configured for ${platform}.`,
    );
  }

  return new PlatformServerlessEntitlementRuntime(
    platform,
    options.catalog,
    client,
    options.now,
  );
}
