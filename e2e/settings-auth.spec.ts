import { test, expect } from "@playwright/test";
import { authEnvOrSkip, gotoSettings, loginViaUi } from "./helpers";

test.describe("Settings auth actions", () => {
  test("sign out confirm cancel keeps session", async ({ page }, testInfo) => {
    const { email, password } = authEnvOrSkip(testInfo);
    await loginViaUi(page, email, password);
    await gotoSettings(page);

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Are you sure you want to sign out?");
      await dialog.dismiss();
    });

    await page.getByText("Sign out of all devices").click();
    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByText("Plan & Usage")).toBeVisible();
  });

  test("sign out confirm accept logs user out", async ({ page }, testInfo) => {
    const { email, password } = authEnvOrSkip(testInfo);
    await loginViaUi(page, email, password);
    await gotoSettings(page);

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Are you sure you want to sign out?");
      await dialog.accept();
    });

    await page.getByText("Sign out of all devices").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("welcome-start-journey")).toBeVisible();
  });

  test("delete account has inline double-confirm then system confirm", async ({ page }, testInfo) => {
    const { email, password } = authEnvOrSkip(testInfo);
    await loginViaUi(page, email, password);
    await gotoSettings(page);

    await page.getByText("Delete account").click();
    await expect(page.getByText("Confirm Delete")).toBeVisible();
    await expect(page.getByText("This action cannot be undone.")).toBeVisible();
    await page.getByText("Cancel").click();
    await expect(page.getByText("Confirm Delete")).not.toBeVisible();

    await page.getByText("Delete account").click();
    await expect(page.getByText("Confirm Delete")).toBeVisible();

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("permanently delete your account");
      await dialog.dismiss();
    });

    await page.getByText("Confirm Delete").click();
    await expect(page).toHaveURL(/\/settings$/);
  });
});
