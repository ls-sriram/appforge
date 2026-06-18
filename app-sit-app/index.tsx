import React from "react";
import { Redirect } from "expo-router";
import { sitAppRoutes } from "../src/apps/sit-app/navigation/routes";

export default function SitAppIndexRoute() {
  return <Redirect href={sitAppRoutes.home} />;
}
