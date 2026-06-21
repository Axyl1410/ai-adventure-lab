import { describe, expect, it } from "vitest";
import { getTestAgent } from "../helpers/testApp";

describe("POST /api/tts", () => {
  const agent = getTestAgent();

  it("text an toàn khi TTS tắt trả ok false", async () => {
    const res = await agent.post("/api/tts").send({ text: "Xin chào các em!" });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toContain("TTS");
  });

  it("từ chối text rỗng", async () => {
    const res = await agent.post("/api/tts").send({ text: "   " });
    expect(res.status).toBe(400);
  });
});
