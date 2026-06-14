import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  LoginAction,
  LoginController,
  LoginSurface,
  LoginViewData,
} from "../../../../features/login";
import { routes } from "../../../../navigation/routes";
import {
  ExampleAppDisabledLoginModel,
  notifyExampleAppAuthDisabled,
} from "./example-app-disabled-auth";

export function ExampleAppLoginRouteScreen() {
  const router = useRouter();
  const controller = useMemo(
    () => new LoginController(new ExampleAppDisabledLoginModel(), { bypassValidation: false }),
    [],
  );
  const [data, setData] = useState<LoginViewData>(() => controller.getInitialData());

  const dispatch = useCallback(
    async (action: LoginAction) => {
      if (action.type === "go_to_register") {
        router.push(routes.register);
        return;
      }
      if (action.type === "go_to_forgot_password") {
        router.push(routes.forgotPassword);
        return;
      }
      if (action.type === "submit" && data.email.includes("@") && data.password.trim().length > 0) {
        notifyExampleAppAuthDisabled("login");
      }
      const next = await controller.dispatch(action);
      setData(next);
    },
    [controller, data.email, data.password, router],
  );

  return <LoginSurface data={data} dispatch={dispatch} />;
}
