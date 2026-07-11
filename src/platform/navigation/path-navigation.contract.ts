import { z } from "zod";
import type { UiStamp } from "../ui";
import { PathBreadcrumbItemSchema } from "./path-breadcrumb.contract";
import { NavigationTerminalActionSchema } from "./navigation-action-bar.contract";

export const PathNavigationScaffoldSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  path: z.array(PathBreadcrumbItemSchema).min(1),
  backLabel: z.string().optional(),
  onBack: z.custom<() => void>(),
  backDisabled: z.boolean().optional(),
  action: NavigationTerminalActionSchema,
});

export type PathNavigationScaffoldProps = z.input<typeof PathNavigationScaffoldSchema>;
