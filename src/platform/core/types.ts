/**
 * ─────────────────────────────────────────────────────────────────
 * MVC CONTRACTS — Type system that enforces the MVC boundaries.
 *
 * Model    → Firebase reads only. Exposes typed observables.
 * Controller → Receives view actions, calls model, prepares data.
 * View     → Stateless. Receives `{ data, dispatch }`. Emits actions only.
 * ─────────────────────────────────────────────────────────────────
 */

// ─── Model ──────────────────────────────────────────────────────

/** Every model is a read-only Firebase adapter. */
export interface Model<TState> {
  /** Current snapshot of model state (read-only). */
  readonly state: TState;
  /** Subscribe to state changes. Returns unsubscribe function. */
  subscribe(listener: (state: TState) => void): () => void;
}

// ─── Controller ─────────────────────────────────────────────────

/**
 * Controller mediates between View and Model.
 * - Receives actions from the view
 * - Calls model methods
 * - Produces data for the view
 */
export interface Controller<ViewData, ViewAction> {
  /** Initial data for the view on mount. */
  getInitialData(): ViewData;
  /** Handle a view action. Returns updated data. */
  dispatch(action: ViewAction): Promise<ViewData>;
  /** Cleanup on unmount. */
  destroy?(): void;
}

// ─── View ───────────────────────────────────────────────────────

/**
 * Views are extremely dumb.
 * - Receive `data` (prepared by controller)
 * - Receive `dispatch` (to emit actions back)
 * - Never import Model or Controller
 * - Never hold local state
 * - Composed only of primitives, molecules, blocks, surfaces, features, or pages
 */
export interface ViewProps<D, A> {
  /** Prepared data from controller. */
  data: D;
  /** Dispatch an action back to controller. */
  dispatch: (action: A) => void;
}

// ─── Result ─────────────────────────────────────────────────────

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
