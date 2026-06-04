import { test, expect } from "@playwright/test";
import { githubOffline } from "./fixtures";

test("reduced motion: no boot, reveals disabled, content reachable, no errors", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));

  await page.route("**/api/github", (route) =>
    route.fulfill({ json: githubOffline }),
  );
  await page.goto("/");

  // The emulation is actually active.
  expect(
    await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);

  // Boot sequence is skipped.
  await expect(page.getByText("INITIALIZING OPERATOR HUD")).toHaveCount(0);

  // Reveals are disabled → below-the-fold content is visible without scrolling.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /SKILL\.MATRIX/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /EXPERIENCE\.LOG/i }),
  ).toBeVisible();

  expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
