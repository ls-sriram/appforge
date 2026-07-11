import { z } from "zod";
import type { UiStamp } from "../ui";

export const PathBreadcrumbItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  onPress: z.custom<() => void>().optional(),
});

export const PathBreadcrumbSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  items: z.array(PathBreadcrumbItemSchema).min(1),
});

export type PathBreadcrumbItem = z.input<typeof PathBreadcrumbItemSchema>;
export type PathBreadcrumbProps = z.input<typeof PathBreadcrumbSchema>;
