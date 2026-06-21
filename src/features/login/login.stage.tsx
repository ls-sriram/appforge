import React from "react";
import { createUi } from "../../platform/ui/index";
import { LoginSurface } from "./ui/LoginSurface";
import type { LoginViewData } from "./LoginController";

const MOCK: LoginViewData = {
  email: "",
  password: "",
  emailError: "",
  passwordError: "",
  generalError: "",
  loading: false,
  isAuthenticated: false,
};

export function LoginLayout() {
  return <LoginSurface ui={createUi("login")} data={MOCK} dispatch={() => {}} />;
}
