import { z } from "zod";
import type { ReactNode } from "react";
import type { UiStamp } from "../ui";

export const MobileBottomNavScaffoldSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  logo: z.custom<ReactNode>().optional(),
  items: z.custom<ReactNode>(),
});

export type MobileBottomNavScaffoldProps = z.input<typeof MobileBottomNavScaffoldSchema>;
