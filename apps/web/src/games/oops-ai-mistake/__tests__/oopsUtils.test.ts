import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { buildFeedbackText } from "../oopsUtils";

const t = ((key: string) => {
  const map: Record<string, string> = {
    "shared.feedback.oopsCorrect": "Đúng rồi!",
    "shared.feedback.oopsWrong": "Mình kiểm tra lại nhé.",
  };
  return map[key] ?? key;
}) as TFunction<"gameContent">;

describe("oopsUtils", () => {
  it("buildFeedbackText prefixes correct and wrong answers", () => {
    expect(buildFeedbackText(t, true, "Giải thích.")).toContain("Đúng rồi!");
    expect(buildFeedbackText(t, false, "Giải thích.")).toContain(
      "Mình kiểm tra"
    );
  });
});
