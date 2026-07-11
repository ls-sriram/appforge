import { styled, Text as TamaguiText } from "@tamagui/core";
export { BodySchema, HeadingSchema, LabelSchema, DisplaySchema, LogoSchema } from "./text.contract";

export const Text = TamaguiText;

export const Body = styled(TamaguiText, {
  name: "Body",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$md",
  lineHeight: "$md",
});

export const Heading = styled(TamaguiText, {
  name: "Heading",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$xl",
  lineHeight: "$xl",
});

export const Label = styled(TamaguiText, {
  name: "Label",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$sm",
  lineHeight: "$sm",
});

export const Display = styled(TamaguiText, {
  name: "Display",
  fontFamily: "$bold",
  color: "$textPrimary",
  fontSize: "$xxl",
  lineHeight: "$xxl",
});

export const Logo = styled(TamaguiText, {
  name: "Logo",
  fontFamily: "$bold",
  color: "$textPrimary",
  fontSize: "$xl",
  lineHeight: "$xl",
});
