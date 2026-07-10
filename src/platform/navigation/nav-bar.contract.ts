import { z } from "zod";
import type { ReactNode } from "react";
import type { UiStamp } from "../ui";

export const NavBarScaffoldSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  logo: z.custom<ReactNode>().optional(),
  title: z.custom<ReactNode>().optional(),
  items: z.custom<ReactNode>(),
});

export type NavBarScaffoldProps = z.infer<typeof NavBarScaffoldSchema>;
