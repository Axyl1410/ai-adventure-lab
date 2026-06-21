import { describe, expect, it } from "vitest";
import { createTestSession, getTestAgent } from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

describe("validate middleware", () => {
  useTestDatabase();
  const agent = getTestAgent();

  it("POST /api/sessions từ chối nickname quá dài", async () => {
    const res = await agent.post("/api/sessions").send({
      nickname: "A".repeat(25),
      ageGroup: "6-8",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Dữ liệu chưa đúng.");
  });

  it("POST /api/ai/chat từ chối message rỗng", async () => {
    const session = await createTestSession(agent);
    const res = await agent.post("/api/ai/chat").send({
      sessionId: session.id,
      message: "   ",
      ageGroup: "6-8",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Dữ liệu chưa đúng.");
  });

  it("POST /api/progress từ chối sessionId không hợp lệ", async () => {
    const res = await agent.post("/api/progress").send({
      sessionId: "not-a-cuid",
      gameKey: "ai-detective",
      score: 1,
      maxScore: 5,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Dữ liệu chưa đúng.");
  });

  it("POST /api/ai/chat từ chối sessionId sai định dạng", async () => {
    const res = await agent.post("/api/ai/chat").send({
      sessionId: "bad-id",
      message: "AI là gì?",
      ageGroup: "6-8",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Dữ liệu chưa đúng.");
  });
});
