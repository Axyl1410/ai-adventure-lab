import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { DECK_SIZE } from "../constants";
import {
  buildFeedbackText,
  isCorrectOption,
  shuffleDeck,
} from "../recommendationUtils";
import { ALL_ROUNDS } from "../rounds";

const t = ((key: string) => {
  const map: Record<string, string> = {
    "shared.feedback.aiRecommendationsCorrect": "Gợi ý hay!",
    "shared.feedback.aiRecommendationsWrong": "Mình thử chọn lại nhé.",
  };
  return map[key] ?? key;
}) as TFunction<"gameContent">;

describe("recommendationUtils", () => {
  it("shuffleDeck returns at most DECK_SIZE rounds", () => {
    const deck = shuffleDeck(ALL_ROUNDS);
    expect(deck.length).toBeLessThanOrEqual(DECK_SIZE);
    expect(deck.length).toBeGreaterThan(0);
  });

  it("buildFeedbackText prefixes correct and wrong answers", () => {
    expect(buildFeedbackText(t, true, "Giải thích.")).toContain("Gợi ý hay!");
    expect(buildFeedbackText(t, false, "Giải thích.")).toContain("Mình thử");
  });

  it("isCorrectOption matches round answer", () => {
    const round = {
      ...ALL_ROUNDS[0],
      friendLabel: "Bạn Gấu",
      question: "Q",
      explain: "E",
      recentLikes: ALL_ROUNDS[0].recentLikes.map((like) => ({
        ...like,
        label: like.labelKey,
      })),
      options: ALL_ROUNDS[0].options.map((opt) => ({
        ...opt,
        label: opt.labelKey,
      })),
    };
    expect(isCorrectOption(round, round.correctOptionId)).toBe(true);
    expect(isCorrectOption(round, "wrong-id")).toBe(false);
  });
});
