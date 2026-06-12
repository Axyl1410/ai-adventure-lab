import { describe, expect, it } from "vitest";
import { ALL_ROUNDS } from "../rounds";

const PII_KEYWORDS = ["địa chỉ", "số điện thoại", "tên trường", "tên thật"];

describe("ALL_ROUNDS", () => {
  it("has at least 8 rounds in the pool", () => {
    expect(ALL_ROUNDS.length).toBeGreaterThanOrEqual(8);
  });

  for (const round of ALL_ROUNDS) {
    it(`${round.id} has valid correctOptionId in options`, () => {
      const optionIds = round.options.map((option) => option.id);
      expect(optionIds).toContain(round.correctOptionId);
      expect(round.options.length).toBeGreaterThanOrEqual(3);
    });
  }

  it("matchPattern and repeatOk rounds avoid PII as correct answer", () => {
    const safeKinds = ALL_ROUNDS.filter(
      (round) => round.kind === "matchPattern" || round.kind === "repeatOk"
    );
    for (const round of safeKinds) {
      const correct = round.options.find(
        (option) => option.id === round.correctOptionId
      );
      expect(correct).toBeDefined();
      const labelLower = correct?.label.toLowerCase() ?? "";
      for (const keyword of PII_KEYWORDS) {
        expect(labelLower.includes(keyword)).toBe(false);
      }
    }
  });

  it("rejectPrivacy round identifies unsafe practice as correct", () => {
    const privacyRound = ALL_ROUNDS.find(
      (round) => round.kind === "rejectPrivacy"
    );
    expect(privacyRound).toBeDefined();
    const correct = privacyRound?.options.find(
      (option) => option.id === privacyRound.correctOptionId
    );
    expect(correct?.label.toLowerCase()).toContain("địa chỉ");
  });

  it("includes all three round kinds", () => {
    const kinds = new Set(ALL_ROUNDS.map((round) => round.kind));
    expect(kinds.has("matchPattern")).toBe(true);
    expect(kinds.has("repeatOk")).toBe(true);
    expect(kinds.has("rejectPrivacy")).toBe(true);
  });
});
