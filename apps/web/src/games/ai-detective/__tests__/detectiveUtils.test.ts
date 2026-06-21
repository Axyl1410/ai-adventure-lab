import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { ROUND_SIZE } from "../constants";
import { buildFeedbackText, shuffleRound } from "../detectiveUtils";

const t = ((key: string) => {
  const map: Record<string, string> = {
    "shared.feedback.aiDetectiveCorrect": "Đúng!",
    "shared.feedback.aiDetectiveWrong": "Sai!",
  };
  return map[key] ?? key;
}) as TFunction<"gameContent">;

describe("detectiveUtils", () => {
  it("shuffleRound giới hạn ROUND_SIZE", () => {
    const bank = Array.from({ length: 20 }, (_, index) => index);
    const round = shuffleRound(bank);
    expect(round).toHaveLength(ROUND_SIZE);
  });

  it("shuffleRound không mutate bank", () => {
    const bank = [1, 2, 3, 4, 5];
    const copy = [...bank];
    shuffleRound(bank);
    expect(bank).toEqual(copy);
  });

  it("buildFeedbackText prefixes", () => {
    expect(buildFeedbackText(t, true, "Giải thích")).toContain("Đúng!");
    expect(buildFeedbackText(t, false, "Giải thích")).toContain("Sai!");
  });
});
