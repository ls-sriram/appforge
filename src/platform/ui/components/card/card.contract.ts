import { z } from "zod";
import type { ReactNode } from "react";
import type { CardContract } from "./card.styles";

export const CardSchema = z.object({
  contract: z.custom<CardContract>(),
  accessibilityLabel: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  leading: z.custom<ReactNode>().optional(),
  selected: z.boolean().default(false),
  disabled: z.boolean().optional(),
  onPress: z.custom<() => void>(),
  children: z.custom<ReactNode>().optional(),
  testID: z.string().optional(),
});

export type CardProps = z.input<typeof CardSchema>;
