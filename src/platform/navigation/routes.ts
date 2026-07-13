export const routes = {
  welcome: "/" as const,
  login: "/login" as const,
  register: "/register" as const,
  forgotPassword: "/forgot-password" as const,
  onboarding: "/onboarding" as const,
  dashboard: "/dashboard" as const,
  settings: "/settings" as const,
  settingsProfile: "/settings/profile" as const,
  recordings: "/recordings" as const,
  chat: "/chat" as const,
  tasks: "/tasks" as const,
  textEditor: "/text-editor" as const,
  sharedRecordings: "/shared-recordings" as const,
  upgrade: "/upgrade" as const,
};

export type AppRoute = (typeof routes)[keyof typeof routes];

export function isRoute(pathname: string, route: string): boolean {
  return pathname === route;
}
