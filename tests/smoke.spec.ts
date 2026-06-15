import { test, expect } from "@playwright/test";
import { githubOk } from "./fixtures";

test.describe("Operator HUD", () => {
  test("boots and switches loadout under full motion without errors", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(String(e)));
    await page.route("**/api/github", (route) =>
      route.fulfill({ json: githubOk }),
    );

    await page.goto("/");
    await expect(page).toHaveTitle(/Frontend/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /VERGEL/i,
    );

    // The switcher lives in the fixed top bar (clickable once boot clears).
    await page.getByRole("radio", { name: /DATA/i }).click();
    await expect(page).toHaveURL(/perfil=data/);
    await expect(page.getByText(/OPERATOR PROFILE.*DATA/i)).toBeVisible();

    expect(pageErrors, pageErrors.join("\n")).toEqual([]);
  });

  // Content assertions run with reduced motion so reveals don't hide
  // below-the-fold content and Lenis is off — fully deterministic.
  test.describe("content (reduced motion)", () => {
    test("renders the live GitHub feed and the locked certifications stub", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.route("**/api/github", (route) =>
        route.fulfill({ json: githubOk }),
      );
      await page.goto("/?perfil=data");

      const gh = page.locator("#github");
      await expect(gh.getByText("@johnvergel-dev")).toBeVisible();
      await expect(
        gh.getByRole("heading", { name: "alpha-engine" }),
      ).toBeVisible();
      await expect(gh.getByText("TypeScript").first()).toBeVisible();

      await expect(page.getByText("MODULE LOCKED")).toBeVisible();
    });

    test("re-filters projects when switching loadouts", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.route("**/api/github", (route) =>
        route.fulfill({ json: githubOk }),
      );
      // "House Research" is tagged data; "Mi Cocina" is frontend-only.
      await page.goto("/?perfil=data");
      await expect(page.getByText("House Research")).toBeVisible();
      await expect(page.getByText("Mi Cocina")).toHaveCount(0);

      await page.getByRole("radio", { name: /FRONTEND/i }).click();
      await expect(page.getByText("Mi Cocina")).toBeVisible();
      await expect(page.getByText("House Research")).toHaveCount(0);
    });
  });
});
