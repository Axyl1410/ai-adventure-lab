import { describe, expect, it } from "vitest";
import { OpenAIService } from "../../services/openai.service";

describe("OpenAIService local fallbacks", () => {
  const service = new OpenAIService();

  it("chat trả local reply về AI", async () => {
    const answer = await service.chat(undefined, "AI là gì?", "6-8", "vi");
    expect(answer).toContain("AI");
  });

  it("chat en về prompt", async () => {
    const answer = await service.chat(
      undefined,
      "What is a prompt?",
      "6-8",
      "en"
    );
    expect(answer.toLowerCase()).toContain("prompt");
  });

  it("promptFeedback chấm prompt có nhiệm vụ", async () => {
    const result = await service.promptFeedback(
      "Hãy giải thích AI cho học sinh lớp 3 bằng 3 ý ngắn.",
      "6-8",
      "vi"
    );
    expect(result.score).toBeGreaterThan(30);
    expect(result.badges.length).toBeGreaterThan(0);
  });

  it("promptFeedback unsafe trả score 20", async () => {
    const result = await service.promptFeedback(
      "tôi muốn dao để giết",
      "6-8",
      "vi"
    );
    expect(result.score).toBe(20);
  });
});
