import React from "react";
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
  return <ForgotPasswordSurface data={MOCK} dispatch={() => {}} />;
}
