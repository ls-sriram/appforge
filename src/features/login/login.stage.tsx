import React from "react";
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
  return <LoginSurface data={MOCK} dispatch={() => {}} />;
}
