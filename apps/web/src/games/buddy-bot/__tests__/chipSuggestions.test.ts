import { describe, expect, it } from "vitest";
import {
  chipTranslationKey,
  getDefaultChipIds,
  getFollowUpChipIds,
  resolveChipGroup,
} from "../chipSuggestions";

describe("chipSuggestions", () => {
  it("getDefaultChipIds trả danh sách chip mặc định", () => {
    const ids = getDefaultChipIds();
    expect(ids.length).toBeGreaterThan(3);
    expect(ids).toContain("what_is_ai");
  });

  it("getFollowUpChipIds VI keyword chuyện → story", () => {
    const ids = getFollowUpChipIds("Kể cho em một câu chuyện");
    expect(ids).toContain("continue_story");
  });

  it("getFollowUpChipIds EN keyword math", () => {
    const ids = getFollowUpChipIds("Give me a math puzzle");
    expect(ids).toContain("harder_quiz");
  });

  it("getFollowUpChipIds unknown → fallback", () => {
    const ids = getFollowUpChipIds("xyz random text");
    expect(ids).toContain("how_do_you_learn");
  });

  it("resolveChipGroup cho chip đã biết", () => {
    expect(resolveChipGroup("what_is_ai")).toBe("default");
    expect(resolveChipGroup("continue_story")).toBe("story");
  });

  it("resolveChipGroup unknown → default", () => {
    expect(resolveChipGroup("unknown-chip")).toBe("default");
  });

  it("chipTranslationKey format đúng", () => {
    expect(chipTranslationKey("default", "what_is_ai")).toBe(
      "buddyBot.chips.default.what_is_ai"
    );
  });
});
