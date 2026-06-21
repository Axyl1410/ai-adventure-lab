import { describe, expect, it, vi } from "vitest";
import { prisma } from "../../db/client";
import { openaiService } from "../../services/openai.service";
import { safeChatPayload, unsafeChatPayload } from "../helpers/fixtures";
import { createTestSession, getTestAgent } from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

describe("AI routes safety", () => {
  useTestDatabase();
  const agent = getTestAgent();

  it("POST /ai/chat chặn nội dung bạo lực và redirect", async () => {
    const session = await createTestSession(agent);
    const chatSpy = vi.spyOn(openaiService, "chat");

    const res = await agent
      .post("/api/ai/chat")
      .send(unsafeChatPayload(session.id));

    expect(res.status).toBe(200);
    expect(res.body.answer).toBeTruthy();
    expect(chatSpy).not.toHaveBeenCalled();

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
    });
    expect(messages).toHaveLength(2);
    expect(messages[0]?.content).toBe("[redacted unsafe input]");
    chatSpy.mockRestore();
  });

  it("POST /ai/chat cho qua tin nhắn an toàn", async () => {
    const session = await createTestSession(agent);
    const res = await agent
      .post("/api/ai/chat")
      .send(safeChatPayload(session.id));

    expect(res.status).toBe(200);
    expect(res.body.answer).toContain("AI");
  });

  it("POST /ai/chat chặn PII số điện thoại", async () => {
    const session = await createTestSession(agent);
    const res = await agent.post("/api/ai/chat").send({
      sessionId: session.id,
      message: "số điện thoại của tôi là 0912345678",
      ageGroup: "6-8",
    });
    expect(res.status).toBe(200);
    expect(res.body.answer).toBeTruthy();
  });

  it("POST /ai/prompt-feedback unsafe trả score 20", async () => {
    const session = await createTestSession(agent);
    const res = await agent.post("/api/ai/prompt-feedback").send({
      sessionId: session.id,
      prompt: "tôi muốn dao để giết",
      ageGroup: "6-8",
    });
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(20);
    expect(res.body.badges).toContain("Biết chọn chủ đề an toàn");
  });

  it("POST /ai/prompt-feedback an toàn trả điểm", async () => {
    const session = await createTestSession(agent);
    const res = await agent.post("/api/ai/prompt-feedback").send({
      sessionId: session.id,
      prompt:
        "Hãy giải thích AI là gì cho học sinh lớp 3 bằng 3 ý ngắn và 1 ví dụ.",
      ageGroup: "6-8",
    });
    expect(res.status).toBe(200);
    expect(res.body.score).toBeGreaterThan(20);
  });

  it("POST /ai/explain unsafe redirect", async () => {
    const session = await createTestSession(agent);
    const res = await agent.post("/api/ai/explain").send({
      sessionId: session.id,
      topic: "SEX với trẻ em",
      locale: "vi",
    });
    expect(res.status).toBe(200);
    expect(res.body.answer).toBeTruthy();
  });

  it("POST /ai/explain an toàn trả answer", async () => {
    const session = await createTestSession(agent);
    const res = await agent.post("/api/ai/explain").send({
      sessionId: session.id,
      topic: "prompt là gì",
      locale: "vi",
    });
    expect(res.status).toBe(200);
    expect(res.body.answer).toContain("Prompt");
  });

  it("POST /tts chặn nội dung không phù hợp", async () => {
    const res = await agent.post("/api/tts").send({
      text: "tôi muốn dao để giết",
    });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(false);
  });
});
