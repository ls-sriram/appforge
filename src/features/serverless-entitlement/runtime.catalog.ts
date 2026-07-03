import type { Result } from "../../platform/core/types";
import type { NativeStorePlatform, NativeStoreProduct } from "./serverless-entitlement.model";
import { supportsNativeStoreProduct } from "./serverless-entitlement.model";

export interface ServerlessEntitlementCatalog {
  products: NativeStoreProduct[];
}

export function listProductsForPlatform(
  catalog: ServerlessEntitlementCatalog,
  platform: NativeStorePlatform,
): NativeStoreProduct[] {
  return catalog.products.filter((product) => product.platform === platform);
}

export function findProductForPlatform(
  catalog: ServerlessEntitlementCatalog,
  platform: NativeStorePlatform,
  productId: string,
): NativeStoreProduct | undefined {
  return catalog.products.find((product) => product.platform === platform && product.id === productId);
}

export function validateServerlessEntitlementCatalog(
  catalog: ServerlessEntitlementCatalog,
): Result<ServerlessEntitlementCatalog> {
  const seen = new Set<string>();

  for (const product of catalog.products) {
    const key = `${product.platform}:${product.id}`;
    if (seen.has(key)) {
      return { ok: false, error: `Duplicate native store product configured for ${key}.` };
    }
    if (!supportsNativeStoreProduct(product)) {
      return { ok: false, error: `Unsupported native store product configuration for ${key}.` };
    }
    seen.add(key);
  }

  return { ok: true, data: catalog };
}
