import { z } from "zod";
import type { InputContract } from "./input.styles";

// Curated editing surface only — NOT a full replacement for InputProps.
// InputProps is `Omit<ComponentProps<typeof TextInput>, "style"> & {
// contract, disabled }`: the spread half is React Native's entire TextInput
// prop set, which isn't worth (or safely possible to) reproduce in Zod
// without narrowing it. Same treatment as the wrapped Tamagui primitives'
// curated-subset schemas — this describes the two platform-owned fields,
// schema is not the type source here.
export const InputSchema = z.object({
  contract: z.custom<InputContract>(),
  disabled: z.boolean().optional(),
});
