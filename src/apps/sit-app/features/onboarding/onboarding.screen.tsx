import React from "react";
import { Redirect } from "expo-router";
import { sitAppRoutes } from "../../navigation/routes";

export function SitAppOnboardingScreen() {
  return <Redirect href={sitAppRoutes.home} />;
}
