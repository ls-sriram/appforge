import type { Result } from "../../../platform/core/types";
import type {
  PurchaseProductInput,
  ServerlessEntitlementCacheRecord,
  ServerlessEntitlementState,
  ServerlessEntitlementSnapshot,
} from "../domain/model";
import type { ServerlessEntitlementCache, ServerlessEntitlementRuntime } from "../runtime/runtime";

export type ServerlessEntitlementListener = (state: ServerlessEntitlementState) => void;

const EMPTY_STATE: ServerlessEntitlementState = {
  authority: "native_store",
  initialized: false,
  loading: false,
  cacheState: "empty",
  snapshot: null,
};

export class ServerlessEntitlementController {
  private state: ServerlessEntitlementState = EMPTY_STATE;
  private readonly listeners = new Set<ServerlessEntitlementListener>();

  constructor(
    private readonly runtime: ServerlessEntitlementRuntime,
    private readonly cache?: ServerlessEntitlementCache,
  ) {}

  getState(): ServerlessEntitlementState {
    return cloneState(this.state);
  }

  subscribe(listener: ServerlessEntitlementListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  async initialize(): Promise<Result<ServerlessEntitlementState>> {
    this.setState({ loading: true, error: undefined });

    await this.hydrateCache();

    const initResult = await this.runtime.initialize();
    if (!initResult.ok) {
      return this.fail(initResult.error, this.state.snapshot ? "stale" : this.state.cacheState);
    }

    return this.refreshPurchases();
  }

  async refreshPurchases(): Promise<Result<ServerlessEntitlementState>> {
    this.setState({ loading: true, error: undefined });
    const result = await this.runtime.refreshPurchases();
    return result.ok ? this.succeed(result.data) : this.fail(result.error, this.state.snapshot ? "stale" : this.state.cacheState);
  }

  async restorePurchases(): Promise<Result<ServerlessEntitlementState>> {
    this.setState({ loading: true, error: undefined });
    const result = await this.runtime.restorePurchases();
    return result.ok ? this.succeed(result.data) : this.fail(result.error, this.state.snapshot ? "stale" : this.state.cacheState);
  }

  async purchaseProduct(input: PurchaseProductInput): Promise<Result<ServerlessEntitlementState>> {
    this.setState({ loading: true, error: undefined });
    const result = await this.runtime.purchaseProduct(input);
    return result.ok ? this.succeed(result.data) : this.fail(result.error, this.state.snapshot ? "stale" : this.state.cacheState);
  }

  private async hydrateCache(): Promise<void> {
    if (!this.cache) return;
    const result = await this.cache.read();
    if (!result.ok || !result.data) return;

    this.setState({
      snapshot: result.data.snapshot,
      cacheState: "hydrated",
      lastSyncedAt: result.data.snapshot.refreshedAt,
    });
  }

  private async persistSnapshot(snapshot: ServerlessEntitlementSnapshot): Promise<void> {
    if (!this.cache) return;
    const record: ServerlessEntitlementCacheRecord = {
      snapshot,
      cachedAt: snapshot.refreshedAt,
    };
    const result = await this.cache.write(record);
    if (!result.ok) {
      this.setState({ error: result.error, cacheState: "stale" });
    }
  }

  private async succeed(snapshot: ServerlessEntitlementSnapshot): Promise<Result<ServerlessEntitlementState>> {
    this.setState({
      initialized: true,
      loading: false,
      snapshot,
      error: undefined,
      cacheState: this.cache ? "hydrated" : "empty",
      lastSyncedAt: snapshot.refreshedAt,
    });
    await this.persistSnapshot(snapshot);
    return { ok: true, data: this.getState() };
  }

  private fail(error: string, cacheState: ServerlessEntitlementState["cacheState"]): Result<ServerlessEntitlementState> {
    this.setState({
      initialized: true,
      loading: false,
      error,
      cacheState,
    });
    return { ok: false, error };
  }

  private setState(patch: Partial<ServerlessEntitlementState>): void {
    this.state = {
      ...this.state,
      ...patch,
    };
    this.emit();
  }

  private emit(): void {
    const snapshot = this.getState();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

function cloneState(state: ServerlessEntitlementState): ServerlessEntitlementState {
  return {
    ...state,
    snapshot: state.snapshot ? cloneSnapshot(state.snapshot) : null,
  };
}

function cloneSnapshot(snapshot: ServerlessEntitlementSnapshot): ServerlessEntitlementSnapshot {
  return {
    ...snapshot,
    activeProductIds: [...snapshot.activeProductIds],
    ownedProducts: snapshot.ownedProducts.map((product) => ({ ...product })),
  };
}
