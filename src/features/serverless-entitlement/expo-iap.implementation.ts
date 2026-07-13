import { Platform } from "react-native";
import type { AppleStorekitBridgeImplementation } from "./apple-storekit.bridge";
import type { AppleStoreTransactionSnapshot } from "./apple-store.client";
import type { GooglePlayBillingBridgeImplementation } from "./google-play-billing.bridge";
import type { GooglePlayPurchaseSnapshot } from "./google-play.client";

type ExpoIapPurchase = {
  id?: string;
  productId: string;
  purchaseState?: string;
  purchaseToken?: string | null;
  transactionDate?: number;
  expirationDateIOS?: number | null;
  revocationDateIOS?: number | null;
  isAutoRenewing?: boolean;
  isSuspendedAndroid?: boolean | null;
};

export type ExpoIapModuleAdapter = {
  initConnection(): Promise<boolean>;
  fetchProducts(input: { skus: string[]; type: "in-app" | "subs" | "all" }): Promise<unknown>;
  getAvailablePurchases(options?: Record<string, unknown>): Promise<ExpoIapPurchase[]>;
  requestPurchase(input: Record<string, unknown>): Promise<ExpoIapPurchase | ExpoIapPurchase[] | null>;
  finishTransaction(input: { purchase: ExpoIapPurchase; isConsumable: boolean }): Promise<unknown>;
};

async function loadExpoIap(): Promise<ExpoIapModuleAdapter> {
  try {
    const dynamicImport = new Function("specifier", "return import(specifier)") as (specifier: string) => Promise<ExpoIapModuleAdapter>;
    return await dynamicImport("expo-iap");
  } catch {
    throw new Error("expo-iap is required for paid serverless apps. Install it and use a development or store build.");
  }
}

function asPurchases(value: ExpoIapPurchase | ExpoIapPurchase[] | null): ExpoIapPurchase[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function iso(value?: number | null): string | undefined {
  return typeof value === "number" && Number.isFinite(value) ? new Date(value).toISOString() : undefined;
}

function appleSnapshot(purchase: ExpoIapPurchase): AppleStoreTransactionSnapshot {
  const expired = typeof purchase.expirationDateIOS === "number" && purchase.expirationDateIOS <= Date.now();
  return {
    productId: purchase.productId,
    transactionId: purchase.id ?? purchase.purchaseToken ?? purchase.productId,
    purchaseDate: iso(purchase.transactionDate),
    expirationDate: iso(purchase.expirationDateIOS),
    revocationDate: iso(purchase.revocationDateIOS),
    entitlementState: purchase.revocationDateIOS ? "revoked" : expired ? "expired" : purchase.purchaseState === "pending" ? "in_billing_retry" : "active",
  };
}

function googleSnapshot(purchase: ExpoIapPurchase): GooglePlayPurchaseSnapshot {
  return {
    productIds: [purchase.productId],
    purchaseToken: purchase.purchaseToken ?? purchase.id ?? purchase.productId,
    purchaseState: purchase.purchaseState === "pending" ? "pending" : "purchased",
    acknowledged: true,
    purchaseTime: iso(purchase.transactionDate),
    subscriptionState: purchase.isSuspendedAndroid ? "on_hold" : purchase.isAutoRenewing ? "active" : undefined,
  };
}

async function purchase(productId: string, type: "in-app" | "subs", load: () => Promise<ExpoIapModuleAdapter>): Promise<ExpoIapPurchase[]> {
  const iap = await load();
  const result = await iap.requestPurchase({
    request: Platform.OS === "ios"
      ? { apple: { sku: productId } }
      : { google: { skus: [productId] } },
    type,
  });
  const purchases = asPurchases(result);
  for (const item of purchases) {
    if (item.purchaseState === "purchased" || item.purchaseState === undefined) {
      await iap.finishTransaction({ purchase: item, isConsumable: false });
    }
  }
  return purchases;
}

export class ExpoIapAppleImplementation implements AppleStorekitBridgeImplementation {
  constructor(private readonly products: Array<{ id: string; kind: "subscription" | "non_consumable" }> = [], private readonly load: () => Promise<ExpoIapModuleAdapter> = loadExpoIap) {}
  async initialize() { const sdk = await this.load(); await sdk.initConnection(); await lookupProducts(sdk, this.products); }
  async refreshTransactions() { return (await (await this.load()).getAvailablePurchases({ onlyIncludeActiveItemsIOS: false })).map(appleSnapshot); }
  async purchaseProduct(productId: string) { return (await purchase(productId, productType(this.products, productId), this.load)).map(appleSnapshot); }
  async restorePurchases() { return this.refreshTransactions(); }
}

export class ExpoIapGooglePlayImplementation implements GooglePlayBillingBridgeImplementation {
  constructor(private readonly products: Array<{ id: string; kind: "subscription" | "non_consumable" }> = [], private readonly load: () => Promise<ExpoIapModuleAdapter> = loadExpoIap) {}
  async initialize() { const sdk = await this.load(); await sdk.initConnection(); await lookupProducts(sdk, this.products); }
  async queryPurchases() { return (await (await this.load()).getAvailablePurchases({ includeSuspendedAndroid: true })).map(googleSnapshot); }
  async purchaseProduct(productId: string) { return (await purchase(productId, productType(this.products, productId), this.load)).map(googleSnapshot); }
  async restorePurchases() { return this.queryPurchases(); }
}

function productType(products: Array<{ id: string; kind: "subscription" | "non_consumable" }>, productId: string): "in-app" | "subs" {
  return products.find((product) => product.id === productId)?.kind === "subscription" ? "subs" : "in-app";
}

async function lookupProducts(sdk: ExpoIapModuleAdapter, products: Array<{ id: string; kind: "subscription" | "non_consumable" }>) {
  const inApp = products.filter((product) => product.kind === "non_consumable").map((product) => product.id);
  const subscriptions = products.filter((product) => product.kind === "subscription").map((product) => product.id);
  if (inApp.length) await sdk.fetchProducts({ skus: inApp, type: "in-app" });
  if (subscriptions.length) await sdk.fetchProducts({ skus: subscriptions, type: "subs" });
}
