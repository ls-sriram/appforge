import type { Theme } from "./tokens";
import type { PrimitiveContracts } from "../../contracts/runtime/index";
import type { LayoutContract } from "../../contracts/layouts";

export type LayoutLibrary = Record<string, LayoutContract>;

export interface UiRuntime {
  theme: Theme;
  contracts: PrimitiveContracts;
  layouts: LayoutLibrary;
}
