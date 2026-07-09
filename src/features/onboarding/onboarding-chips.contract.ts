import { z } from "zod";
import type { UiStamp } from "../../platform/ui/index";

export const OnboardingChipsBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  options: z.array(z.string()),
  selected: z.string().optional(),
  onSelect: z.custom<(value: string) => void>().optional(),
});

export type OnboardingChipsBlockProps = z.infer<typeof OnboardingChipsBlockSchema>;
