import { expect, test } from "@playwright/test";

test.describe("portfolio landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with the expected title and hero content", async ({ page }) => {
    await expect(page).toHaveTitle(/Israel — Full-Stack Developer/);
    await expect(
      page.getByRole("heading", {
        name: "Israel builds the systems behind the interface.",
      })
    ).toBeVisible();
  });

  test("nav links scroll to their matching sections", async ({ page }) => {
    const nav = page.locator("nav");

    await nav.getByRole("link", { name: "work" }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work")).toBeInViewport();

    await nav.getByRole("link", { name: "experience" }).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator("#experience")).toBeInViewport();

    await nav.getByRole("link", { name: "contact" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("hero call-to-actions point at the right sections", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "See recent work" })
    ).toHaveAttribute("href", "#work");
    await expect(
      page.getByRole("link", { name: "Get in touch" })
    ).toHaveAttribute("href", "#contact");
  });

  test("renders the stack, work, experience and contact sections", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", { name: "How it's put together" })).toBeVisible();
    await expect(page.getByText("Interface layer")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Scrub.ph" })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Full-Stack Developer, Scrub Technologies Inc.",
      })
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "Let's talk" })).toBeVisible();
    await expect(page.getByRole("link", { name: "email" })).toHaveAttribute(
      "href",
      /^mailto:/
    );
  });
});
