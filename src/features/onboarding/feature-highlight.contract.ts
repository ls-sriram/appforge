import { z } from "zod";
import type { IconName } from "../../platform/ui/index";
import type { FeatureHighlightStyle } from "./feature-highlight.styles";

export const FeatureHighlightBlockSchema = z.object({
  style: z.custom<FeatureHighlightStyle>(),
  icon: z.custom<IconName>(),
  title: z.string(),
  description: z.string(),
});

export type FeatureHighlightBlockProps = z.infer<typeof FeatureHighlightBlockSchema>;
