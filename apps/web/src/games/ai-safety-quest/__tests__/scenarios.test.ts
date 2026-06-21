import { describe, expect, it } from "vitest";
import { DECK_SIZE } from "../constants";
import { ALL_SCENARIOS } from "../scenarios";

describe("ALL_SCENARIOS", () => {
  it("đủ số lượng cho một phiên chơi", () => {
    expect(ALL_SCENARIOS.length).toBeGreaterThanOrEqual(DECK_SIZE);
  });

  it("mỗi scenario có answer hợp lệ", () => {
    for (const scenario of ALL_SCENARIOS) {
      expect(["do_it", "dont", "ask_adult"]).toContain(scenario.answer);
    }
  });

  it("PII scenarios yêu cầu dont", () => {
    const piiIds = [
      "password_request",
      "address_for_better_story",
      "real_face_photo_upload",
    ];
    for (const id of piiIds) {
      const scenario = ALL_SCENARIOS.find((item) => item.id === id);
      expect(scenario?.answer).toBe("dont");
    }
  });

  it("learning scenarios cho phép do_it hoặc ask_adult", () => {
    const learning = ALL_SCENARIOS.find(
      (item) => item.id === "why_ai_can_be_wrong"
    );
    expect(["do_it", "ask_adult"]).toContain(learning?.answer);
  });
});
