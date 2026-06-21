import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { DECK_SIZE } from "../constants";
import { buildFeedbackText, shuffleDeck } from "../questUtils";

const t = ((key: string) => {
  const map: Record<string, string> = {
    "shared.feedback.aiSafetyCorrect": "An toàn!",
    "shared.feedback.aiSafetyWrong": "Cân nhắc!",
  };
  return map[key] ?? key;
}) as TFunction<"gameContent">;

describe("questUtils", () => {
  it("shuffleDeck giới hạn DECK_SIZE", () => {
    const deck = shuffleDeck(Array.from({ length: 12 }, (_, index) => index));
    expect(deck).toHaveLength(DECK_SIZE);
  });

  it("buildFeedbackText prefixes", () => {
    expect(buildFeedbackText(t, true, "Lý do")).toContain("An toàn!");
    expect(buildFeedbackText(t, false, "Lý do")).toContain("Cân nhắc!");
  });
});
