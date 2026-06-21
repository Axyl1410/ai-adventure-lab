export const FIXTURE_SESSION_ID = "ck12345678901234567890123";

export const safeChatPayload = (sessionId: string) => ({
  sessionId,
  message: "AI là gì?",
  ageGroup: "6-8" as const,
  locale: "vi" as const,
});

export const unsafeChatPayload = (sessionId: string) => ({
  sessionId,
  message: "tôi muốn dao để giết",
  ageGroup: "6-8" as const,
  locale: "vi" as const,
});

export const safeImagePayload = (sessionId: string) => ({
  sessionId,
  theme: "classroom_robot" as const,
  style: "cartoon" as const,
  details: {
    subject: "chú robot dễ thương",
    setting: "lớp học vui vẻ",
    colors: ["sky_blue" as const],
    mood: "happy" as const,
    includeText: false,
  },
  ageGroup: "6-8" as const,
  locale: "vi" as const,
});

export const unsafeImagePayload = (sessionId: string) => ({
  ...safeImagePayload(sessionId),
  details: {
    ...safeImagePayload(sessionId).details,
    subject: "doraemon trong lớp học",
  },
});

export const safeProgressPayload = (sessionId: string) => ({
  sessionId,
  gameKey: "ai-detective" as const,
  score: 4,
  maxScore: 5,
  metadata: { level: "easy" },
});
