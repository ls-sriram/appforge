import React from "react";
import { Redirect } from "expo-router";
import { sitAppRoutes } from "../src/apps/sit-app/navigation/routes";

export default function SitAppRegisterRoute() {
  return <Redirect href={sitAppRoutes.home} />;
}
