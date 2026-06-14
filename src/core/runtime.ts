import { Platform } from "react-native";

export type RuntimePlatform = "ios" | "android" | "web";

function resolveRuntimePlatform(): RuntimePlatform {
  if (Platform.OS === "web") return "web";
  if (Platform.OS === "ios") return "ios";
  return "android";
}

export const runtime = {
  platform: resolveRuntimePlatform(),
  isWeb: Platform.OS === "web",
} as const;

