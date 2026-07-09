import { styled, Text as TamaguiText } from "@tamagui/core";
export { BodySchema, HeadingSchema, LabelSchema, DisplaySchema } from "./text.contract";

export const Text = TamaguiText;

export const Body = styled(TamaguiText, {
  name: "Body",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$3",
  lineHeight: "$3",
});

export const Heading = styled(TamaguiText, {
  name: "Heading",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$5",
  lineHeight: "$5",
});

export const Label = styled(TamaguiText, {
  name: "Label",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$2",
  lineHeight: "$2",
});

export const Display = styled(TamaguiText, {
  name: "Display",
  fontFamily: "$bold",
  color: "$textPrimary",
  fontSize: "$7",
  lineHeight: "$7",
});
