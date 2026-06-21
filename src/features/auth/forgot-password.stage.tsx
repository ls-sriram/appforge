import React from "react";
import { createUi } from "../../platform/ui/index";
import { ForgotPasswordSurface } from "./ForgotPasswordSurface";
import type { ForgotPasswordViewData } from "./ForgotPasswordController";

const MOCK: ForgotPasswordViewData = {
  email: "",
  emailError: "",
  generalError: "",
  loading: false,
  isSuccess: false,
};

export function ForgotPasswordLayout() {
  return <ForgotPasswordSurface ui={createUi("forgot-password")} data={MOCK} dispatch={() => {}} />;
}
