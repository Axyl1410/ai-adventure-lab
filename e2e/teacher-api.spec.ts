import { expect, test } from "@playwright/test";

const TEACHER_PASSCODE = "e2e-teacher-99";

test.describe("Teacher API", () => {
  test("stats cần passcode", async ({ request }) => {
    const unauthorized = await request.get("/api/teacher/stats");
    expect(unauthorized.status()).toBe(401);
  });

  test("stats với passcode hợp lệ", async ({ request }) => {
    const authorized = await request.get("/api/teacher/stats", {
      headers: { "x-teacher-passcode": TEACHER_PASSCODE },
    });
    expect(authorized.status()).toBe(200);
    expect(authorized.headers()["content-type"]).toContain("application/json");
    const body = await authorized.json();
    expect(body).toHaveProperty("sessions");
  });

  test("tạo và liệt kê activity", async ({ request }) => {
    const created = await request.post("/api/teacher/activities", {
      headers: { "x-teacher-passcode": TEACHER_PASSCODE },
      data: {
        title: "E2E Activity",
        type: "game",
        config: { gameKey: "ai-detective" },
      },
    });
    expect(created.status()).toBe(201);
    const activityId = (await created.json()).id;

    const list = await request.get("/api/teacher/activities", {
      headers: { "x-teacher-passcode": TEACHER_PASSCODE },
    });
    expect(list.status()).toBe(200);
    const activities = (await list.json()).activities;
    expect(
      activities.some((item: { id: string }) => item.id === activityId)
    ).toBe(true);
  });
});
