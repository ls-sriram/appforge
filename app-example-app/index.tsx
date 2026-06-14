import React from "react";
import { Redirect } from "expo-router";
import { exampleAppRoutes } from "../src/apps/example-app/navigation/routes";

export default function ExampleAppIndexRoute() {
  return <Redirect href={exampleAppRoutes.home} />;
}
