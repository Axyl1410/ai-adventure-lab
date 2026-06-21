import { expect, test } from "@playwright/test";

test.describe("AI Detective flow", () => {
  test("chọn level và trả lời một câu hỏi", async ({ page }) => {
    await page.goto("/");
    await page
      .getByTestId("game-card-games-ai-detective")
      .getByRole("link")
      .click();
    await expect(page).toHaveURL(/\/games\/ai-detective/);

    await page.getByTestId("level-easy").click();
    await expect(page.getByTestId("answer-has-ai")).toBeVisible();
    await expect(page.getByTestId("answer-no-ai")).toBeVisible();

    await page.getByTestId("answer-has-ai").click();
    await expect(page.getByTestId("feedback-next")).toBeVisible();
    await page.getByTestId("feedback-next").click();

    await expect(page.getByTestId("answer-has-ai")).toBeVisible();
  });
});
