import { Button, useUI } from "@appforge/platform/ui";
import { createContracts, createLayouts, createTheme, type UiRuntime } from "@appforge/platform/theme";
import { EntitlementProvider, SessionProvider, useSessionContext } from "@appforge/platform/providers";
import { api, apiRoutes, callProto, type ApiRouteDefinition } from "@appforge/platform/api";
import { isRoute, routes, type AppRoute } from "@appforge/platform/navigation";
import { ForgotPasswordRouteScreen } from "@appforge/platform/features/auth";
import { LoginRouteScreen } from "@appforge/platform/features/login";
import {
  FirebaseRegisterModel,
  RegisterController,
  RegisterView,
  type RegisterAction,
  type RegisterModel,
  type RegisterViewData,
} from "@appforge/platform/features/register";
import { useProfileEditViewModel } from "@appforge/platform/features/settings";

void Button;
void EntitlementProvider;
void SessionProvider;
void ForgotPasswordRouteScreen;
void LoginRouteScreen;
void RegisterView;
void useSessionContext;
void useProfileEditViewModel;
void api;
void apiRoutes;
void callProto;
void isRoute;
void routes;

const runtime: UiRuntime = (() => {
  const theme = createTheme({
    brand: {
      primary: "#0F766E",
    },
  });
  return {
    theme,
    contracts: createContracts(theme),
    layouts: createLayouts(theme),
  };
})();

const route: AppRoute = routes.login;
const routeDefinition: ApiRouteDefinition | undefined =
  apiRoutes[Object.keys(apiRoutes)[0] ?? ""];

const registerModel: RegisterModel = new FirebaseRegisterModel();
const registerController = new RegisterController(registerModel);
const registerData: RegisterViewData = registerController.getInitialData();
const registerAction: RegisterAction = { type: "go_to_login" };

function PublicApiSmoke() {
  const ui = useUI();
  void ui;
  void runtime;
  void route;
  void routeDefinition;
  void registerData;
  void registerAction;
  return null;
}

void PublicApiSmoke;
