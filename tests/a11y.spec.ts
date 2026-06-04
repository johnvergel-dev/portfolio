import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { githubOffline } from "./fixtures";

test("no serious/critical accessibility violations", async ({ page }) => {
  // Reduced motion → no boot overlay and all content revealed, so axe analyses
  // the full, settled HUD deterministically.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/github", (route) =>
    route.fulfill({ json: githubOffline }),
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    // The animated WebGL/starfield canvas is decorative (aria-hidden).
    .exclude("canvas")
    .analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );

  expect(
    blocking,
    JSON.stringify(
      blocking.map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.length })),
      null,
      2,
    ),
  ).toEqual([]);
});
