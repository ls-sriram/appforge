import React, { useCallback, useEffect, useMemo, useState } from "react";
import { dialog } from "../../platform/ui/index";
import { useRouter, type Href } from "expo-router";
import { app } from "../../config/app";
import { ForgotPasswordAction, ForgotPasswordController, ForgotPasswordViewData } from "./ForgotPasswordController";
import { ForgotPasswordSurface } from "./ForgotPasswordSurface";

type Props = {
  loginHref: Href;
};

export function ForgotPasswordRouteScreen({ loginHref }: Props) {
  const router = useRouter();
  const controller = useMemo(() => new ForgotPasswordController(), []);
  const [data, setData] = useState<ForgotPasswordViewData>(() => controller.getInitialData());

  useEffect(() => {
    if (!data.isSuccess) return;
    dialog.alert(
      app.copy.auth.forgotPasswordSuccessTitle,
      app.copy.auth.forgotPasswordSuccessMessage,
      [{ text: "OK", onPress: () => router.replace(loginHref) }],
    );
  }, [data.isSuccess, loginHref, router]);

  const dispatch = useCallback(
    async (action: ForgotPasswordAction) => {
      if (action.type === "go_to_login") {
        router.replace(loginHref);
        return;
      }
      const next = await controller.dispatch(action);
      setData(next);
    },
    [controller, loginHref, router],
  );

  return <ForgotPasswordSurface data={data} dispatch={dispatch} />;
}
