import React, { useCallback, useMemo, useState } from "react";
import { Redirect, useRouter, type Href } from "expo-router";
import { routes } from "../../platform/navigation/routes";
import { LoginViewModel, type LoginAction, type LoginViewData } from "./login.viewmodel";
import { LoginView } from "./login.view";

type Props = {
  authenticatedHref: Href;
};

export function LoginScreen({ authenticatedHref }: Props) {
  const router = useRouter();
  const viewmodel = useMemo(() => new LoginViewModel(undefined, { bypassValidation: false }), []);
  const [data, setData] = useState<LoginViewData>(() => viewmodel.getInitialData());

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
      const next = await viewmodel.dispatch(action);
      setData(next);
    },
    [router, viewmodel],
  );

  if (data.isAuthenticated) {
    return <Redirect href={authenticatedHref} />;
  }

  return <LoginView data={data} dispatch={dispatch} />;
}
