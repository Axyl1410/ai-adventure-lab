import { expect, test } from "@playwright/test";

test.describe("Home session", () => {
  test("hiển thị hero và tạo session khi vào game", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-hero")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /AI Vui Nhộn/i })
    ).toBeVisible();

    await page
      .getByTestId("game-card-games-ai-detective")
      .getByRole("link")
      .click();
    await expect(page).toHaveURL(/\/games\/ai-detective/);

    await expect
      .poll(async () =>
        page.evaluate(() => localStorage.getItem("ai-lab-session"))
      )
      .not.toBeNull();
  });

  test("hiển thị đủ 11 game cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-testid^="game-card-"]');
    await expect(cards).toHaveCount(11);
  });
});
