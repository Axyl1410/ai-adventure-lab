import fs from "node:fs/promises";
import path from "node:path";
import type { NextFunction, Request, Response, RequestHandler } from "express";
import { Router } from "express";
import { chatSchema, imageGenerateSchema, progressSchema, promptFeedbackSchema, sessionSchema, teacherActivitySchema, ttsSchema } from "@ai-adventure/shared";
import { prisma } from "../db/client";
import { imageRateLimit } from "../middleware/rateLimits";
import { requireTeacher } from "../middleware/teacherAuth";
import { validateBody, validateParams } from "../middleware/validate";
import { explainSchema, idParamSchema, progressParamSchema, imageParamSchema } from "../schemas/http";
import { imageService } from "../services/image.service";
import { openaiService } from "../services/openai.service";
import { ttsService } from "../services/tts.service";
import { safetyService } from "../services/safety.service";
import { aiDetectiveQuestions, games, oopsQuestions } from "./gameData";

export const routes = Router();

// Bọc async handler để Express 4 tự động catch lỗi và chuyển sang error middleware
function ah(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

routes.get("/health", (_req, res) => {
  res.json({ ok: true, app: "AI Adventure Lab", time: new Date().toISOString() });
});

routes.post("/sessions", validateBody(sessionSchema), ah(async (req, res) => {
  const session = await prisma.session.create({ data: req.body });
  res.status(201).json(session);
}));

routes.get("/sessions/:id", validateParams(idParamSchema), ah(async (req, res) => {
  const session = await prisma.session.findUnique({ where: { id: req.params.id } });
  if (!session) {
    res.status(404).json({ error: "Không tìm thấy phiên học." });
    return;
  }
  res.json(session);
}));

routes.get("/games", (_req, res) => {
  res.json({ games, data: { aiDetectiveQuestions, oopsQuestions } });
});

routes.post("/progress", validateBody(progressSchema), ah(async (req, res) => {
  const session = await prisma.session.findUnique({ where: { id: req.body.sessionId }, select: { id: true } });
  if (!session) {
    res.status(404).json({ error: "Không tìm thấy phiên học." });
    return;
  }
  const progress = await prisma.gameProgress.create({ data: { ...req.body, metadata: JSON.stringify(req.body.metadata) } });
  res.status(201).json(progress);
}));

routes.get("/progress/:sessionId", validateParams(progressParamSchema), ah(async (req, res) => {
  const progress = await prisma.gameProgress.findMany({
    where: { sessionId: req.params.sessionId },
    orderBy: { createdAt: "desc" }
  });
  res.json({ progress });
}));

routes.post("/ai/chat", validateBody(chatSchema), ah(async (req, res) => {
  const safety = safetyService.checkText(req.body.message);
  if (!safety.safe) {
    await prisma.chatMessage.createMany({
      data: [
        { sessionId: req.body.sessionId, role: "user", content: "[redacted unsafe input]", safetyLevel: safety.status },
        { sessionId: req.body.sessionId, role: "assistant", content: safety.message ?? "Mình chuyển sang chủ đề học tập an toàn nhé.", safetyLevel: safety.status }
      ]
    }).catch(() => undefined);
    res.json({ answer: safety.message ?? "Mình chuyển sang chủ đề học tập an toàn nhé." });
    return;
  }

  const answer = await openaiService.chat(req.body.sessionId, req.body.message, req.body.ageGroup);
  await prisma.chatMessage.createMany({
    data: [
      { sessionId: req.body.sessionId, role: "user", content: req.body.message, safetyLevel: "safe" },
      { sessionId: req.body.sessionId, role: "assistant", content: answer, safetyLevel: "safe" }
    ]
  });
  res.json({ answer });
}));

routes.post("/ai/prompt-feedback", validateBody(promptFeedbackSchema), ah(async (req, res) => {
  const safety = safetyService.checkText(req.body.prompt);
  if (!safety.safe) {
    const result = {
      score: 20,
      badges: ["Biết chọn chủ đề an toàn"],
      feedback: safety.message ?? "Mình đổi sang chủ đề an toàn nhé.",
      improvedPrompt: "Hãy giải thích AI là gì cho học sinh tiểu học bằng 3 ý ngắn và 1 ví dụ dễ hiểu."
    };
    res.json(result);
    return;
  }

  const result = await openaiService.promptFeedback(req.body.prompt, req.body.ageGroup);
  await prisma.promptAttempt.create({
    data: {
      sessionId: req.body.sessionId,
      rawPrompt: req.body.prompt,
      improvedPrompt: result.improvedPrompt,
      score: result.score,
      feedback: result.feedback
    }
  });
  res.json(result);
}));

routes.post("/ai/explain", validateBody(explainSchema), ah(async (req, res) => {
  const safety = safetyService.checkText(req.body.topic);
  if (!safety.safe) {
    res.json({ answer: safety.message ?? "Mình chuyển sang chủ đề học tập an toàn nhé." });
    return;
  }
  const answer = await openaiService.explain(req.body.topic);
  res.json({ answer });
}));

routes.post("/images/generate", imageRateLimit, validateBody(imageGenerateSchema), ah(async (req, res) => {
  const promptResult = await imageService.buildPrompt(req.body);
  if (!promptResult.safe) {
    res.status(400).json({ error: promptResult.studentMessage, reason: promptResult.reason });
    return;
  }

  const record = await prisma.generatedImage.create({
    data: {
      sessionId: req.body.sessionId,
      promptUsed: promptResult.prompt,
      theme: req.body.theme,
      style: req.body.style,
      safetyLevel: "safe",
      filePath: "pending",
      label: "Hình này được tạo bởi AI."
    }
  });
  const generated = await imageService.generateImageFile(promptResult.prompt, record.id, req.body.style);
  const updated = await prisma.generatedImage.update({
    where: { id: record.id },
    data: { filePath: generated.filePath }
  });

  res.status(201).json({
    imageId: updated.id,
    imageUrl: `/api/uploads/generated-images/${generated.filename}`,
    promptUsed: updated.promptUsed,
    safetyLevel: "safe",
    label: "Hình này được tạo bởi AI."
  });
}));

routes.get("/images/:imageId", validateParams(imageParamSchema), ah(async (req, res) => {
  const image = await prisma.generatedImage.findUnique({ where: { id: req.params.imageId } });
  if (!image) {
    res.status(404).json({ error: "Không tìm thấy tranh." });
    return;
  }
  res.json(image);
}));

routes.delete("/images/:imageId", requireTeacher, validateParams(imageParamSchema), ah(async (req, res) => {
  const image = await prisma.generatedImage.findUnique({ where: { id: req.params.imageId } });
  if (!image) {
    res.status(404).json({ error: "Không tìm thấy tranh." });
    return;
  }
  await prisma.generatedImage.delete({ where: { id: image.id } });
  if (image.filePath !== "pending") {
    await fs.unlink(image.filePath).catch(() => undefined);
  }
  res.json({ ok: true });
}));

routes.post("/tts", validateBody(ttsSchema), ah(async (req, res) => {
  const result = await ttsService.speak(req.body.text, req.body.voice);
  res.json(result);
}));

routes.get("/teacher/activities", requireTeacher, ah(async (_req, res) => {
  const activities = await prisma.teacherActivity.findMany({ orderBy: { updatedAt: "desc" } });
  res.json({ activities: activities.map((activity) => ({ ...activity, config: parseJson(activity.config) })) });
}));

routes.post("/teacher/activities", requireTeacher, validateBody(teacherActivitySchema), ah(async (req, res) => {
  const activity = await prisma.teacherActivity.create({ data: { ...req.body, config: JSON.stringify(req.body.config) } });
  res.status(201).json({ ...activity, config: parseJson(activity.config) });
}));

routes.put("/teacher/activities/:id", requireTeacher, validateParams(idParamSchema), validateBody(teacherActivitySchema), ah(async (req, res) => {
  const existing = await prisma.teacherActivity.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!existing) {
    res.status(404).json({ error: "Không tìm thấy hoạt động." });
    return;
  }
  const activity = await prisma.teacherActivity.update({ where: { id: req.params.id }, data: { ...req.body, config: JSON.stringify(req.body.config) } });
  res.json({ ...activity, config: parseJson(activity.config) });
}));

routes.delete("/teacher/activities/:id", requireTeacher, validateParams(idParamSchema), ah(async (req, res) => {
  const existing = await prisma.teacherActivity.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!existing) {
    res.status(404).json({ error: "Không tìm thấy hoạt động." });
    return;
  }
  await prisma.teacherActivity.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
}));

routes.get("/teacher/stats", requireTeacher, ah(async (_req, res) => {
  const [sessions, progress, images, prompts] = await Promise.all([
    prisma.session.count(),
    prisma.gameProgress.groupBy({ by: ["gameKey"], _count: true, _avg: { score: true } }),
    prisma.generatedImage.count(),
    prisma.promptAttempt.count()
  ]);
  res.json({ sessions, progress, images, prompts });
}));

routes.get("/teacher/export.csv", requireTeacher, ah(async (_req, res) => {
  const rows = await prisma.gameProgress.findMany({ include: { session: true }, orderBy: { createdAt: "desc" } });
  const csv = [
    "sessionId,nickname,ageGroup,gameKey,score,maxScore,createdAt",
    ...rows.map((row) => [
      row.sessionId,
      row.session.nickname,
      row.session.ageGroup,
      row.gameKey,
      row.score,
      row.maxScore,
      row.createdAt.toISOString()
    ].map((value) => safeCsv(String(value))).join(","))
  ].join("\n");
  res.setHeader("content-type", "text/csv; charset=utf-8");
  res.send(csv);
}));

routes.get("/teacher/images", requireTeacher, ah(async (_req, res) => {
  const images = await prisma.generatedImage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  res.json({ images: images.map((image) => ({ ...image, imageUrl: imageUrlFromPath(image.filePath) })) });
}));

function safeCsv(value: string) {
  const sanitized = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${sanitized.replace(/"/g, '""')}"`;
}

function imageUrlFromPath(filePath: string) {
  const filename = path.basename(filePath);
  return `/api/uploads/generated-images/${filename}`;
}

function parseJson(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}
