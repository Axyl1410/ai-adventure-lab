import { describe, expect, it } from "vitest";
import { DECK_SIZE } from "../constants";
import {
  buildFeedbackText,
  isCorrectFeedback,
  isCorrectOption,
  shuffleDeck,
} from "../recommendationUtils";
import { ALL_ROUNDS } from "../rounds";

describe("recommendationUtils", () => {
  it("shuffleDeck returns at most DECK_SIZE rounds", () => {
    const deck = shuffleDeck(ALL_ROUNDS);
    expect(deck.length).toBeLessThanOrEqual(DECK_SIZE);
    expect(deck.length).toBeGreaterThan(0);
  });

  it("buildFeedbackText prefixes correct and wrong answers", () => {
    expect(buildFeedbackText(true, "Giải thích.")).toContain("Gợi ý hay!");
    expect(buildFeedbackText(false, "Giải thích.")).toContain("Mình thử");
  });

  it("isCorrectFeedback detects success prefix", () => {
    expect(isCorrectFeedback(buildFeedbackText(true, "OK"))).toBe(true);
    expect(isCorrectFeedback(buildFeedbackText(false, "OK"))).toBe(false);
  });

  it("isCorrectOption matches round answer", () => {
    const round = ALL_ROUNDS[0];
    expect(isCorrectOption(round, round.correctOptionId)).toBe(true);
    expect(isCorrectOption(round, "wrong-id")).toBe(false);
  });
});
