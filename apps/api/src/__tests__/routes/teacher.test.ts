import { describe, expect, it } from "vitest";
import { safeProgressPayload } from "../helpers/fixtures";
import {
  createTestSession,
  getTestAgent,
  TEACHER_HEADERS,
} from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

describe("Teacher routes", () => {
  useTestDatabase();
  const agent = getTestAgent();

  it("CRUD activities", async () => {
    const created = await agent
      .post("/api/teacher/activities")
      .set(TEACHER_HEADERS)
      .send({
        title: "Bài tập AI Detective",
        type: "game",
        config: { gameKey: "ai-detective" },
      });
    expect(created.status).toBe(201);
    const activityId = created.body.id;

    const list = await agent
      .get("/api/teacher/activities")
      .set(TEACHER_HEADERS);
    expect(list.body.activities).toHaveLength(1);
    expect(list.body.activities[0].config.gameKey).toBe("ai-detective");

    const updated = await agent
      .put(`/api/teacher/activities/${activityId}`)
      .set(TEACHER_HEADERS)
      .send({
        title: "Bài tập cập nhật",
        type: "game",
        config: { gameKey: "buddy-bot" },
      });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe("Bài tập cập nhật");

    const deleted = await agent
      .delete(`/api/teacher/activities/${activityId}`)
      .set(TEACHER_HEADERS);
    expect(deleted.status).toBe(200);

    const afterDelete = await agent
      .get("/api/teacher/activities")
      .set(TEACHER_HEADERS);
    expect(afterDelete.body.activities).toHaveLength(0);
  });

  it("PUT /teacher/activities/:id không tồn tại trả 404", async () => {
    const res = await agent
      .put("/api/teacher/activities/ck12345678901234567890123")
      .set(TEACHER_HEADERS)
      .send({ title: "X", type: "game", config: {} });
    expect(res.status).toBe(404);
  });

  it("GET /teacher/stats có shape đúng", async () => {
    const session = await createTestSession(agent);
    await agent.post("/api/progress").send(safeProgressPayload(session.id));

    const res = await agent.get("/api/teacher/stats").set(TEACHER_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.sessions).toBe(1);
    expect(Array.isArray(res.body.progress)).toBe(true);
  });

  it("GET /teacher/export.csv có header và escape formula", async () => {
    const session = await createTestSession(agent, { nickname: "=cmd" });
    await agent.post("/api/progress").send(safeProgressPayload(session.id));

    const res = await agent.get("/api/teacher/export.csv").set(TEACHER_HEADERS);
    expect(res.status).toBe(200);
    expect(res.text).toContain("sessionId,nickname,ageGroup,gameKey");
    expect(res.text).toContain("'=cmd");
  });

  it("GET /teacher/images trả danh sách", async () => {
    const res = await agent.get("/api/teacher/images").set(TEACHER_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.images)).toBe(true);
  });
});
