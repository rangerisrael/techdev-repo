import { expect, test } from "@playwright/test";

test.describe("light / dark theme toggle", () => {
  test("defaults to dark mode", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(18, 20, 28)"
    );
  });

  test("switches to light mode on click and updates the visible background", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Switch to light mode" });
    await toggle.click();

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(247, 245, 240)"
    );
    await expect(
      page.getByRole("button", { name: "Switch to dark mode" })
    ).toBeVisible();
  });

  test("persists the chosen theme across reloads", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.reload();

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(
      page.getByRole("button", { name: "Switch to dark mode" })
    ).toBeVisible();
  });

  test("toggles back to dark mode", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await page.getByRole("button", { name: "Switch to dark mode" }).click();

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(18, 20, 28)"
    );
  });
});
