import { describe, expect, it } from "vitest";
import { getTestAgent } from "../helpers/testApp";

describe("GET /api/games", () => {
  const agent = getTestAgent();

  it("trả danh sách 11 game", async () => {
    const res = await agent.get("/api/games");
    expect(res.status).toBe(200);
    expect(res.body.games).toHaveLength(11);
  });

  it("mỗi game có path và title", async () => {
    const res = await agent.get("/api/games");
    for (const game of res.body.games) {
      expect(game.path).toMatch(/^\/games\//u);
      expect(game.title).toBeTruthy();
    }
  });

  it("có dữ liệu câu hỏi detective và oops", async () => {
    const res = await agent.get("/api/games");
    expect(res.body.data.aiDetectiveQuestions).toBeTruthy();
    expect(res.body.data.oopsQuestions).toBeTruthy();
  });
});
