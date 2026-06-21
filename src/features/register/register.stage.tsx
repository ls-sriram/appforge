import React from "react";
import { createUi } from "../../platform/ui/index";
import { RegisterSurface } from "./ui/RegisterSurface";
import type { RegisterViewData } from "./RegisterController";

const MOCK: RegisterViewData = {
  fullName: "",
  fullNameError: "",
  email: "",
  emailError: "",
  password: "",
  passwordError: "",
  generalError: "",
  loading: false,
  registered: false,
};

export function RegisterLayout() {
  return <RegisterSurface ui={createUi("register")} data={MOCK} dispatch={() => {}} />;
}
