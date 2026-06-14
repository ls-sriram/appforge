import { test, expect } from "@playwright/test";

const email = process.env.E2E_FLOW_EMAIL ?? "";
const password = process.env.E2E_FLOW_PASSWORD ?? "Passw0rd!";
const fullName = process.env.E2E_FLOW_NAME ?? "E2E User";

test.beforeAll(() => {
  if (!email) {
    throw new Error("E2E_FLOW_EMAIL is required");
  }
});

test("register is blocked before approval", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("appforge_onboarding_complete", "true");
  });

  await page.goto("/register");
  await expect(page).toHaveURL(/\/register$/);

  await page.getByTestId("register-name-input").fill(fullName);
  await page.getByTestId("register-email-input").fill(email);
  await page.getByTestId("register-password-input").fill(password);

  await page.getByTestId("register-submit-button").click();
  await expect(page.getByText("Registration is blocked until this email is approved.")).toBeVisible();
});

test("register succeeds after approval and login works", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("appforge_onboarding_complete", "true");
  });

  await page.goto("/register");
  await expect(page).toHaveURL(/\/register$/);

  await page.getByTestId("register-name-input").fill(fullName);
  await page.getByTestId("register-email-input").fill(email);
  await page.getByTestId("register-password-input").fill(password);

  await page.getByTestId("register-submit-button").click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.context().clearCookies();
  await page.goto("/");
  await page.getByTestId("welcome-have-login").click();
  await page.getByTestId("email-input").fill(email);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("submit-button").click();

  await expect(page).toHaveURL(/\/dashboard$/);
});
