import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { RegisterAction, RegisterController, RegisterViewData } from "../../../../features/register";
import { routes } from "../../../../navigation/routes";
import { SafeAreaView } from "../../../../ui";
import { app } from "../../../../config/app";
import { ExampleAppDisabledRegisterModel, notifyExampleAppAuthDisabled } from "./example-app-disabled-auth";
import { RegisterLayout } from "./register.layout";

export function ExampleAppRegisterRouteScreen() {
  const router = useRouter();
  const controller = useMemo(() => new RegisterController(new ExampleAppDisabledRegisterModel()), []);
  const [data, setData] = useState<RegisterViewData>(() => controller.getInitialData());

  const dispatch = useCallback(
    async (action: RegisterAction) => {
      if (action.type === "go_to_login") { router.replace(routes.login); return; }
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RegisterLayout
        appName={app.name}
        subtitle={app.copy.auth.registerSubtitle}
        fullNamePlaceholder={app.copy.auth.registerFullNamePlaceholder}
        emailPlaceholder={app.copy.auth.registerEmailPlaceholder}
        passwordPlaceholder={app.copy.auth.registerPasswordPlaceholder}
        submitLabel={app.copy.auth.registerSubmitLabel}
        legalText={app.copy.auth.registerLegalText}
        loginPrompt={app.copy.auth.registerLoginPrompt}
        fullName={data.fullName}
        email={data.email}
        password={data.password}
        loading={data.loading}
        generalError={data.generalError ?? ""}
        onFullNameChange={(v) => { void dispatch({ type: "full_name_changed", value: v }); }}
        onEmailChange={(v) => { void dispatch({ type: "email_changed", value: v }); }}
        onPasswordChange={(v) => { void dispatch({ type: "password_changed", value: v }); }}
        onSubmit={() => { void dispatch({ type: "submit" }); }}
        onLogin={() => { void dispatch({ type: "go_to_login" }); }}
      />
    </SafeAreaView>
  );
}
