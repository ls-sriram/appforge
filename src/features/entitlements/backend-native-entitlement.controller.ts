import type { Result } from "../../platform/core/types";
import type { EntitlementSnapshot } from "./entitlements.model";
import type { BackendNativeEntitlementServiceApi } from "./backend-native-entitlement.service";
import type {
  NativeStorePlatform,
  NativeStoreProduct,
  PurchaseProductInput,
} from "../serverless-entitlement/serverless-entitlement.model";
import type {
  NativeStoreBillingClient,
  NativeStorePurchaseRecord,
} from "../serverless-entitlement/native-store.client";

export interface BackendNativeEntitlementState {
  authority: "server";
  initialized: boolean;
  loading: boolean;
  snapshot?: EntitlementSnapshot;
  error?: string;
}

export type BackendNativeEntitlementListener = (state: BackendNativeEntitlementState) => void;

export class BackendNativeEntitlementController {
  private state: BackendNativeEntitlementState = {
    authority: "server",
    initialized: false,
    loading: false,
  };
  private readonly listeners = new Set<BackendNativeEntitlementListener>();

  constructor(
    private readonly platform: NativeStorePlatform,
    private readonly products: NativeStoreProduct[],
    private readonly client: NativeStoreBillingClient,
    private readonly service: BackendNativeEntitlementServiceApi,
  ) {}

  getState(): BackendNativeEntitlementState {
    return { ...this.state };
  }

  subscribe(listener: BackendNativeEntitlementListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  async initialize(): Promise<Result<BackendNativeEntitlementState>> {
    this.setState({ loading: true, error: undefined });
    const initialized = await this.client.initialize();
    if (!initialized.ok) return this.fail(initialized.error);
    return this.refreshPurchases();
  }

  async purchaseProduct(input: PurchaseProductInput): Promise<Result<BackendNativeEntitlementState>> {
    const product = this.findProduct(input.productId);
    if (!product) return this.fail(`Unsupported product for ${this.platform}: ${input.productId}`);

    this.setState({ loading: true, error: undefined });
    const purchased = await this.client.purchaseProduct(product.id);
    if (!purchased.ok) return this.fail(purchased.error);
    const record = purchased.data.find(
      (item) => item.productId === product.id && item.status === "active" && item.transactionId,
    );
    if (!record?.transactionId) return this.fail(`Store did not return an active ${product.id} transaction.`);
    return this.confirm(product, record);
  }

  async refreshPurchases(): Promise<Result<BackendNativeEntitlementState>> {
    this.setState({ loading: true, error: undefined });
    const purchases = await this.client.refreshPurchases();
    return purchases.ok ? this.reconcile(purchases.data) : this.fail(purchases.error);
  }

  async restorePurchases(): Promise<Result<BackendNativeEntitlementState>> {
    this.setState({ loading: true, error: undefined });
    const purchases = await this.client.restorePurchases();
    return purchases.ok ? this.reconcile(purchases.data) : this.fail(purchases.error);
  }

  private async reconcile(records: NativeStorePurchaseRecord[]): Promise<Result<BackendNativeEntitlementState>> {
    let snapshot: EntitlementSnapshot | undefined;
    for (const record of records) {
      if (record.status !== "active" || !record.transactionId) continue;
      const product = this.findProduct(record.productId);
      if (!product) continue;
      const confirmed = await this.service.confirmPurchase({
        platform: this.platform,
        productId: product.canonicalProductId ?? product.id,
        transactionId: record.transactionId,
      });
      if (!confirmed.ok) return this.fail(confirmed.error);
      snapshot = confirmed.data;
    }
    if (!snapshot) {
      const current = await this.service.getSnapshot();
      if (!current.ok) return this.fail(current.error);
      snapshot = current.data;
    }
    return this.succeed(snapshot);
  }

  private async confirm(
    product: NativeStoreProduct,
    record: NativeStorePurchaseRecord,
  ): Promise<Result<BackendNativeEntitlementState>> {
    const result = await this.service.confirmPurchase({
      platform: this.platform,
      productId: product.canonicalProductId ?? product.id,
      transactionId: record.transactionId!,
    });
    return result.ok ? this.succeed(result.data) : this.fail(result.error);
  }

  private findProduct(productId: string): NativeStoreProduct | undefined {
    return this.products.find(
      (product) => product.platform === this.platform &&
        (product.id === productId || product.canonicalProductId === productId),
    );
  }

  private succeed(snapshot: EntitlementSnapshot): Result<BackendNativeEntitlementState> {
    this.setState({ initialized: true, loading: false, snapshot, error: undefined });
    return { ok: true, data: this.getState() };
  }

  private fail(error: string): Result<BackendNativeEntitlementState> {
    this.setState({ initialized: true, loading: false, error });
    return { ok: false, error };
  }

  private setState(patch: Partial<BackendNativeEntitlementState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener(this.getState());
  }
}
