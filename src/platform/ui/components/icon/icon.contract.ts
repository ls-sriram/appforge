import { z } from "zod";
import type { IconName } from "./Icon";

// IconProps has an open index signature (`[key: string]: unknown`) to allow
// arbitrary passthrough props (accessibility attrs, testID, etc.) onto the
// wrapping View. .passthrough() preserves that instead of rejecting extra
// keys, which .object() would do by default.
export const IconSchema = z
  .object({
    name: z.custom<IconName>(),
    size: z.number(),
    color: z.string(),
  })
  .passthrough();

export type IconProps = z.infer<typeof IconSchema>;
