import React from "react";
import { routes } from "../src/navigation/routes";
import { ExampleAppForgotPasswordRouteScreen } from "../src/apps/example-app/features/auth/ExampleAppForgotPasswordRouteScreen";

export default function ForgotPasswordPage() {
  return <ExampleAppForgotPasswordRouteScreen loginHref={routes.login} />;
}
