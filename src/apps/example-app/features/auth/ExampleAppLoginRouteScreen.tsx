import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { LoginAction, LoginController, LoginViewData } from "../../../../features/login";
import { routes } from "../../../../navigation/routes";
import { SafeAreaView } from "../../../../ui";
import { app } from "../../../../config/app";
import { ExampleAppDisabledLoginModel, notifyExampleAppAuthDisabled } from "./example-app-disabled-auth";
import { LoginLayout } from "./login.layout";

export function ExampleAppLoginRouteScreen() {
  const router = useRouter();
  const controller = useMemo(
    () => new LoginController(new ExampleAppDisabledLoginModel(), { bypassValidation: false }),
    [],
  );
  const [data, setData] = useState<LoginViewData>(() => controller.getInitialData());

  const dispatch = useCallback(
    async (action: LoginAction) => {
      if (action.type === "go_to_register") { router.push(routes.register); return; }
      if (action.type === "go_to_forgot_password") { router.push(routes.forgotPassword); return; }
      if (action.type === "submit" && data.email.includes("@") && data.password.trim().length > 0) {
        notifyExampleAppAuthDisabled("login");
      }
      const next = await controller.dispatch(action);
      setData(next);
    },
    [controller, data.email, data.password, router],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginLayout
        appName={app.name}
        subtitle={app.copy.auth.loginSubtitle}
        emailPlaceholder={app.copy.auth.loginEmailPlaceholder}
        passwordPlaceholder={app.copy.auth.loginPasswordPlaceholder}
        forgotPasswordLabel={app.copy.auth.loginForgotPasswordLabel}
        submitLabel={app.copy.auth.loginSubmitLabel}
        legalText={app.copy.auth.loginLegalText}
        registerPrompt={app.copy.auth.loginRegisterPrompt}
        email={data.email}
        password={data.password}
        loading={data.loading}
        generalError={data.generalError ?? ""}
        onEmailChange={(v) => { void dispatch({ type: "email_changed", value: v }); }}
        onPasswordChange={(v) => { void dispatch({ type: "password_changed", value: v }); }}
        onSubmit={() => { void dispatch({ type: "submit" }); }}
        onForgotPassword={() => { void dispatch({ type: "go_to_forgot_password" }); }}
        onRegister={() => { void dispatch({ type: "go_to_register" }); }}
      />
    </SafeAreaView>
  );
}
