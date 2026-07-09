import { z } from "zod";

// Curated editing surface only — NOT a type replacement. YStack/XStack are
// `styled(View, {...})` Tamagui primitives: their real prop type is
// Tamagui's entire View prop set (every shorthand, every responsive/media
// variant), which a Zod schema can't describe without narrowing it and
// breaking consumers. This is the subset an Inspector should offer for
// editing — same treatment as Body/Heading/Label/Display in
// components/text/text.contract.ts.
const stackEditableShape = {
  gap: z.number().optional(),
  p: z.number().optional(),
  px: z.number().optional(),
  py: z.number().optional(),
  ai: z.enum(["flex-start", "center", "flex-end", "stretch"]).optional(),
  jc: z.enum(["flex-start", "center", "flex-end", "space-between", "space-around"]).optional(),
  br: z.number().optional(),
  bg: z.string().optional(),
  f: z.number().optional(),
  w: z.union([z.number(), z.string()]).optional(),
  h: z.union([z.number(), z.string()]).optional(),
};

export const YStackSchema = z.object(stackEditableShape);
export const XStackSchema = z.object(stackEditableShape);
