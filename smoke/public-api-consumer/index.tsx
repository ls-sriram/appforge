import {
  Badge,
  type BadgeContract,
  Body,
  Button,
  type ButtonContract,
  DockPanel,
  DockSplitter,
  Heading,
  Icon,
  type IconName,
  Input,
  type InputContract,
  Label,
  ProgressBar,
  type ProgressBarContract,
  ScrollView,
  Select,
  SelectableChip,
  type SelectOption,
  Tabs,
  type TabsContract,
  TabbedPanel,
  type TabbedPanelContract,
  Tag,
  type TagContract,
  ThemeProvider,
  XStack,
  YStack,
  createUi,
  useLayout,
  useTheme,
  useUI,
} from "@appforge/platform/ui";
import {
  createContracts,
  createLayouts,
  createTheme,
  createUiRuntime,
  defaultContracts,
  tokens as platformDefaultTheme,
  type Theme,
  type UiRuntime,
} from "@appforge/platform/theme";
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

void Badge;
void Body;
void Button;
void DockPanel;
void DockSplitter;
void Heading;
void Icon;
void Input;
void Label;
void ProgressBar;
void ScrollView;
void Select;
void SelectableChip;
void Tabs;
void TabbedPanel;
void Tag;
void ThemeProvider;
void XStack;
void YStack;
void createUi;
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
void defaultContracts;
void platformDefaultTheme;

const badgeContract: BadgeContract | undefined = undefined;
void badgeContract;
const buttonContract: ButtonContract | undefined = undefined;
void buttonContract;
const inputContract: InputContract | undefined = undefined;
void inputContract;
const progressBarContract: ProgressBarContract | undefined = undefined;
void progressBarContract;
const tabsContract: TabsContract | undefined = undefined;
void tabsContract;
const tabbedPanelContract: TabbedPanelContract | undefined = undefined;
void tabbedPanelContract;
const tagContract: TagContract | undefined = undefined;
void tagContract;
const selectOption: SelectOption | undefined = undefined;
void selectOption;
const iconName: IconName | undefined = undefined;
void iconName;

const smokeTheme: Theme = createTheme({
  brand: {
    primary: "#0F766E",
  },
});

const runtime: UiRuntime = (() => {
  const theme = smokeTheme;
  return {
    theme,
    contracts: createContracts(theme),
    layouts: createLayouts(theme),
  };
})();

void createUiRuntime;

const route: AppRoute = routes.login;
const routeDefinition: ApiRouteDefinition | undefined =
  apiRoutes[Object.keys(apiRoutes)[0] ?? ""];

const registerModel: RegisterModel = new FirebaseRegisterModel();
const registerController = new RegisterController(registerModel);
const registerData: RegisterViewData = registerController.getInitialData();
const registerAction: RegisterAction = { type: "go_to_login" };

function PublicApiSmoke() {
  const ui = useUI();
  const theme = useTheme();
  const layout = useLayout();
  void ui;
  void theme;
  void layout;
  void runtime;
  void route;
  void routeDefinition;
  void registerData;
  void registerAction;
  return null;
}

void PublicApiSmoke;
