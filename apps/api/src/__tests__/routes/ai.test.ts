import { describe, expect, it } from "vitest";
import { prisma } from "../../db/client";
import { safeChatPayload } from "../helpers/fixtures";
import { createTestSession, getTestAgent } from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

describe("AI routes happy path", () => {
  useTestDatabase();
  const agent = getTestAgent();

  it("POST /ai/chat lưu tin nhắn an toàn vào DB", async () => {
    const session = await createTestSession(agent);
    await agent.post("/api/ai/chat").send(safeChatPayload(session.id));

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
    });
    expect(messages).toHaveLength(2);
    expect(messages[0]?.content).toBe("AI là gì?");
    expect(messages[0]?.safetyLevel).toBe("safe");
  });

  it("POST /ai/prompt-feedback lưu attempt", async () => {
    const session = await createTestSession(agent);
    await agent.post("/api/ai/prompt-feedback").send({
      sessionId: session.id,
      prompt:
        "Hãy giải thích AI cho học sinh lớp 3 bằng 3 ý ngắn và 1 ví dụ dễ hiểu.",
      ageGroup: "6-8",
    });

    const attempts = await prisma.promptAttempt.findMany({
      where: { sessionId: session.id },
    });
    expect(attempts).toHaveLength(1);
    expect(attempts[0]?.score).toBeGreaterThan(0);
  });

  it("POST /ai/chat locale en trả answer tiếng Anh", async () => {
    const session = await createTestSession(agent);
    const res = await agent.post("/api/ai/chat").send({
      sessionId: session.id,
      message: "What is a prompt?",
      ageGroup: "6-8",
      locale: "en",
    });
    expect(res.status).toBe(200);
    expect(res.body.answer.toLowerCase()).toContain("prompt");
  });
});
