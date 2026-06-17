import { z } from "zod";

export const ageGroupSchema = z.enum(["6-8", "9-11"]);
export const safetyLevelSchema = z.enum(["safe", "redirected", "blocked"]);
export const cuidSchema = z
  .string()
  .trim()
  .regex(/^c[a-z0-9]{24}$/iu, "ID không hợp lệ.");
export const gameKeySchema = z.enum([
  "ai-detective",
  "teach-the-robot",
  "teachable-machine",
  "prompt-magic",
  "oops-ai-mistake",
  "buddy-bot",
  "image-studio",
  "data-sorter",
  "ai-safety-quest",
  "robot-commands",
  "ai-recommendations",
]);
export const ttsVoiceSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9_-]{1,32}$/u, "Giọng đọc không hợp lệ.");

export const imageThemes = [
  "cute_animals",
  "classroom_robot",
  "planets_space",
  "rainbow_forest",
  "school_supplies",
  "fairy_tale_characters",
  "ocean_creatures",
  "friendly_future_city",
] as const;
export const imageStyles = [
  "cartoon",
  "watercolor",
  "sticker",
  "classroom_poster",
  "picture_book",
  "pixel_art",
] as const;
export const imageColors = [
  "sky_blue",
  "yellow",
  "pink",
  "green",
  "purple",
  "orange",
] as const;
export const imageMoods = ["happy", "curious", "warm", "excited"] as const;

export const localeSchema = z.enum(["vi", "en"]).default("vi");

export const sessionSchema = z.object({
  nickname: z.string().trim().min(1).max(24).default("Bạn nhỏ"),
  mode: z.enum(["student", "teacher"]).default("student"),
  ageGroup: ageGroupSchema.default("6-8"),
});

export const progressSchema = z.object({
  sessionId: cuidSchema,
  gameKey: gameKeySchema,
  score: z.number().int().min(0),
  maxScore: z.number().int().min(1),
  metadata: z.record(z.unknown()).default({}),
});

export const chatSchema = z.object({
  sessionId: cuidSchema,
  message: z.string().trim().min(1).max(800),
  ageGroup: ageGroupSchema.default("6-8"),
  locale: localeSchema,
});

export const promptFeedbackSchema = z.object({
  sessionId: cuidSchema,
  prompt: z.string().trim().min(1).max(1200),
  ageGroup: ageGroupSchema.default("6-8"),
  locale: localeSchema,
});

export const imageGenerateSchema = z.object({
  sessionId: cuidSchema,
  theme: z.enum(imageThemes),
  style: z.enum(imageStyles),
  details: z.object({
    subject: z.string().trim().min(1).max(120),
    setting: z.string().trim().min(1).max(120),
    colors: z.array(z.enum(imageColors)).min(1).max(4).default(["sky_blue"]),
    mood: z.enum(imageMoods),
    includeText: z.boolean().default(false),
  }),
  ageGroup: ageGroupSchema.default("6-8"),
  locale: localeSchema,
});

export const ttsSchema = z.object({
  text: z.string().trim().min(1).max(800),
  voice: ttsVoiceSchema.optional(),
});

export const promptCoachResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  badges: z.array(z.string().trim().min(1).max(32)).max(4).default([]),
  feedback: z.string().trim().min(1).max(500),
  improvedPrompt: z.string().trim().min(1).max(1200),
});

export const teacherActivitySchema = z.object({
  title: z.string().trim().min(1).max(120),
  type: z.enum(["game", "prompt", "image", "teachable-machine", "module"]),
  config: z.record(z.unknown()).default({}),
});

export type SessionInput = z.infer<typeof sessionSchema>;
export type ProgressInput = z.infer<typeof progressSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
export type PromptFeedbackInput = z.infer<typeof promptFeedbackSchema>;
export type ImageGenerateInput = z.infer<typeof imageGenerateSchema>;
export type TtsInput = z.infer<typeof ttsSchema>;
export type TeacherActivityInput = z.infer<typeof teacherActivitySchema>;
