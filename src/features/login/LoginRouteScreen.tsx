import React, { useCallback, useMemo, useState } from "react";
import { Redirect, useRouter, type Href } from "expo-router";
import { routes } from "@navigation/routes";
import {
  LoginAction,
  LoginController,
  LoginSurface,
  LoginViewData,
  FirebaseLoginModel,
} from "./index";

type Props = {
  authenticatedHref: Href;
};

export function LoginRouteScreen({ authenticatedHref }: Props) {
  const router = useRouter();
  const controller = useMemo(() => new LoginController(new FirebaseLoginModel(), { bypassValidation: false }), []);
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
      const next = await controller.dispatch(action);
      setData(next);
    },
    [controller, router],
  );

  if (data.isAuthenticated) {
    return <Redirect href={authenticatedHref} />;
  }

  return <LoginSurface data={data} dispatch={dispatch} />;
}
