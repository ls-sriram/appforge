import React from "react";
import { Redirect } from "expo-router";
import { sitAppRoutes } from "../../navigation/routes";

export function SitAppProfileScreen() {
  return <Redirect href={sitAppRoutes.home} />;
}
