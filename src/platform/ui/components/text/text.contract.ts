import { z } from "zod";

// Curated editing surface only — NOT a type replacement. Body/Heading/Label/
// Display are Tamagui `styled(TamaguiText, {...})` variants: their real prop
// type is Tamagui's entire text/view prop set, which a Zod schema can't
// describe (and z.infer would narrow it, breaking every consumer that
// passes a Tamagui-specific prop). This describes the subset an Inspector
// should offer for editing, same treatment as the wrapped Tamagui
// primitives (YStack, XStack, ...) in the visualizer.
const textEditableShape = {
  color: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.union([z.number(), z.string()]).optional(),
  lineHeight: z.union([z.number(), z.string()]).optional(),
  fontWeight: z.union([z.string(), z.number()]).optional(),
  letterSpacing: z.number().optional(),
  numberOfLines: z.number().optional(),
  textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
};

export const BodySchema = z.object(textEditableShape);
export const HeadingSchema = z.object(textEditableShape);
export const LabelSchema = z.object(textEditableShape);
export const DisplaySchema = z.object(textEditableShape);
