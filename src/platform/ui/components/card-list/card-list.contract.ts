import type { ReactNode } from "react";
import { z } from "zod";
import type { CardListContract } from "./card-list.styles";

export const CardListSchema = z.object({
  contract: z.custom<CardListContract>(),
  accessibilityLabel: z.string().optional(),
  children: z.custom<ReactNode>(),
  testID: z.string().optional(),
});

export type CardListProps = z.input<typeof CardListSchema>;
