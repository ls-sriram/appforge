import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  RegisterAction,
  RegisterController,
  RegisterSurface,
  RegisterViewData,
} from "../../../../features/register";
import { routes } from "../../../../navigation/routes";
import {
  ExampleAppDisabledRegisterModel,
  notifyExampleAppAuthDisabled,
} from "./example-app-disabled-auth";

export function ExampleAppRegisterRouteScreen() {
  const router = useRouter();
  const controller = useMemo(() => new RegisterController(new ExampleAppDisabledRegisterModel()), []);
  const [data, setData] = useState<RegisterViewData>(() => controller.getInitialData());

  const dispatch = useCallback(
    async (action: RegisterAction) => {
      if (action.type === "go_to_login") {
        router.replace(routes.login);
        return;
      }
      if (
        action.type === "submit" &&
        data.fullName.trim().length >= 2 &&
        data.email.includes("@") &&
        data.password.length >= 6
      ) {
        notifyExampleAppAuthDisabled("register");
      }
      const next = await controller.dispatch(action);
      setData(next);
    },
    [controller, data.email, data.fullName, data.password, router],
  );

  return <RegisterSurface data={data} dispatch={dispatch} />;
}
