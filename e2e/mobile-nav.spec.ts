import { expect, test } from "@playwright/test";

test.describe("mobile / tablet navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hides the inline links and shows a hamburger trigger", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "Open menu" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "stack" })).toBeHidden();
  });

  test("opens a full-screen menu covering the viewport", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();

    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.width).toBeCloseTo(viewport?.width ?? 0, 0);
    expect(box?.height).toBeCloseTo(viewport?.height ?? 0, 0);

    for (const label of ["stack", "work", "experience", "contact"]) {
      await expect(
        dialog.getByRole("link", { name: label })
      ).toBeVisible();
    }
  });

  test("closes via the close button", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page.getByRole("dialog", { name: "Navigation menu" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("closes after selecting a link", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await dialog.getByRole("link", { name: "stack" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/#stack$/);
  });
});

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("shows the inline links and hides the hamburger trigger", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "stack" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open menu" })
    ).toBeHidden();
  });
});
