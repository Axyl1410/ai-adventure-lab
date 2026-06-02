import type { GameCard, PromptCoachResult } from "@ai-adventure/shared";

export interface Session {
  ageGroup: "6-8" | "9-11";
  id: string;
  mode: string;
  nickname: string;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Có lỗi kết nối.");
  }
  return response.json() as Promise<T>;
}
let activeSessionPromise: Promise<Session> | null = null;

export async function getOrCreateSession() {
  if (activeSessionPromise) {
    return activeSessionPromise;
  }

  activeSessionPromise = (async () => {
    const existing = localStorage.getItem("ai-lab-session");
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as Session;
        // Verify the session ID exists in SQLite
        const verified = await api<Session>(`/api/sessions/${parsed.id}`);
        return verified;
      } catch {
        localStorage.removeItem("ai-lab-session");
      }
    }
    const session = await api<Session>("/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        nickname: "Bạn nhỏ",
        mode: "student",
        ageGroup: "6-8",
      }),
    });
    localStorage.setItem("ai-lab-session", JSON.stringify(session));
    return session;
  })();

  try {
    return await activeSessionPromise;
  } catch (error) {
    activeSessionPromise = null; // Reset so a failed attempt can retry
    throw error;
  }
}

export async function saveProgress(
  sessionId: string,
  gameKey: string,
  score: number,
  maxScore: number,
  metadata = {}
) {
  return await api("/api/progress", {
    method: "POST",
    body: JSON.stringify({ sessionId, gameKey, score, maxScore, metadata }),
  });
}

export async function loadGames() {
  return await api<{
    games: GameCard[];
    data: { aiDetectiveQuestions: AiQuestion[]; oopsQuestions: OopsQuestion[] };
  }>("/api/games");
}

export interface AiQuestion {
  answer: boolean;
  explain: string;
  text: string;
}

export interface OopsQuestion {
  answer: "Đúng" | "Sai" | "Cần kiểm tra thêm";
  explain: string;
  text: string;
}

export async function askBuddy(sessionId: string, message: string) {
  return await api<{ answer: string }>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ sessionId, message, ageGroup: "6-8" }),
  });
}

export async function promptFeedback(sessionId: string, prompt: string) {
  return await api<PromptCoachResult>("/api/ai/prompt-feedback", {
    method: "POST",
    body: JSON.stringify({ sessionId, prompt, ageGroup: "6-8" }),
  });
}

export async function speak(text: string, voice?: string) {
  return await api<{ ok: boolean; audioUrl?: string; message?: string }>(
    "/api/tts",
    {
      method: "POST",
      body: JSON.stringify({ text, voice }),
    }
  );
}

export function unlockSticker(stickerId: string) {
  const saved = localStorage.getItem("ai-lab-unlocked-stickers");
  let unlocked: string[] = [];
  if (saved) {
    try {
      unlocked = JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  if (!unlocked.includes(stickerId)) {
    unlocked.push(stickerId);
    localStorage.setItem("ai-lab-unlocked-stickers", JSON.stringify(unlocked));
    window.dispatchEvent(new Event("sticker-unlocked"));
  }
}
