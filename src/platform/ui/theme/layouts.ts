import type { ThemeDefinition } from "./contracts";
import type { LayoutContract } from "../contracts";
import { createPlatformLayouts } from "../contracts";

export function createLayouts(t: ThemeDefinition): Record<string, LayoutContract> {
  return createPlatformLayouts(t);
}
