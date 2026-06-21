import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { DECK_SIZE } from "../constants";
import { buildFeedbackText, shuffleDeck } from "../sorterUtils";

const t = ((key: string) => {
  const map: Record<string, string> = {
    "shared.feedback.dataSorterCorrect": "Phân loại đúng!",
    "shared.feedback.dataSorterWrong": "Thử lại!",
  };
  return map[key] ?? key;
}) as TFunction<"gameContent">;

describe("sorterUtils", () => {
  it("shuffleDeck giới hạn DECK_SIZE", () => {
    const deck = shuffleDeck(Array.from({ length: 12 }, (_, index) => index));
    expect(deck).toHaveLength(DECK_SIZE);
  });

  it("buildFeedbackText prefixes", () => {
    expect(buildFeedbackText(t, true, "Lý do")).toContain("Phân loại đúng!");
    expect(buildFeedbackText(t, false, "Lý do")).toContain("Thử lại!");
  });
});
