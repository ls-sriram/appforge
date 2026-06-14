import { test, expect } from "@playwright/test";
import { authEnvOrSkip, loginViaUi } from "./helpers";

test.describe("Auth", () => {
  test("shows welcome entry for unauthenticated users", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("welcome-start-journey")).toBeVisible();
    await expect(page.getByTestId("welcome-have-login")).toBeVisible();
  });

  test("shows error on invalid login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("welcome-have-login").click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByTestId("email-input").fill("invalid@example.com");
    await page.getByTestId("password-input").fill("wrong-password");
    await page.getByTestId("submit-button").click();
    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("start the journey opens onboarding flow", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("welcome-start-journey").click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByText("Step 1 of")).toBeVisible();
  });

  test("logs in successfully and restores authenticated session on refresh", async ({ page }, testInfo) => {
    const { email, password } = authEnvOrSkip(testInfo);
    await loginViaUi(page, email, password);

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText("Settings", { exact: true }).first()).toBeVisible();
  });
});
