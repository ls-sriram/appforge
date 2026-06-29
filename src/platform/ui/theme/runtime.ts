import { tokens } from "./defaults";
import { createLayouts } from "./layouts";
import { createContracts } from "./variants";
import type { LayoutContract, PrimitiveContracts } from "../contracts";
import type { ThemeDefinition } from "./contracts";

export interface UiRuntime {
  theme: ThemeDefinition;
  contracts: PrimitiveContracts;
  layouts: Record<string, LayoutContract>;
}

export const uiRuntime: UiRuntime = {
  theme: tokens,
  contracts: createContracts(tokens),
  layouts: createLayouts(tokens),
};

// Backwards-compatible alias while consumers migrate to UiRuntime naming.
export const theme = uiRuntime;
