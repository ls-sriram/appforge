import { expect, type Page, type TestInfo } from "@playwright/test";

export function authEnvOrSkip(testInfo: TestInfo): { email: string; password: string } {
  const email = process.env.E2E_EMAIL ?? "";
  const password = process.env.E2E_PASSWORD ?? "";
  if (!email || !password) {
    testInfo.skip(true, "Set E2E_EMAIL and E2E_PASSWORD to run authenticated E2E flows.");
  }
  return { email, password };
}

export async function loginViaUi(page: Page, email: string, password: string) {
  await page.goto("/");
  await page.getByTestId("welcome-have-login").click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Forgot Password?")).toBeVisible();

  await page.getByTestId("email-input").fill(email);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("submit-button").click();

  await expect(page).toHaveURL(/\/dashboard$/);
}

export async function gotoSettings(page: Page) {
  await page.getByText("Settings", { exact: true }).first().click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByText("Plan & Usage")).toBeVisible();
}
