import process from "node:process";
import {
  type PromptCoachResult,
  promptCoachResultSchema,
} from "@ai-adventure/shared";
import OpenAi from "openai";
import { prisma } from "../db/client";
import type { AppLocale } from "../prompts/locale";
import {
  getBuddyBotSystemPrompt,
  getPromptCoachSystemPrompt,
} from "../prompts/prompts";
import { getSafeTopicSwitchMessage } from "../prompts/safety.system";
import { safetyService } from "./safety.service";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const baseUrl = process.env.OPENAI_BASE_URL;
  return new OpenAi({
    apiKey,
    baseURL: baseUrl || undefined,
    timeout: 20_000,
    maxRetries: 1,
  });
}

function textModel() {
  return process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
}

export class OpenAIService {
  async chat(
    sessionId: string | undefined,
    message: string,
    ageGroup: string,
    locale: AppLocale = "vi"
  ) {
    const safety = safetyService.checkText(message, locale);
    if (!safety.safe) {
      return safety.message ?? getSafeTopicSwitchMessage(locale);
    }

    const client = getClient();
    if (!client) {
      return this.localBuddyReply(message, locale);
    }

    try {
      const history = sessionId
        ? await prisma.chatMessage.findMany({
            where: { sessionId, safetyLevel: "safe" },
            orderBy: { createdAt: "desc" },
            take: 10,
          })
        : [];
      history.reverse();

      const messages: OpenAi.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `${getBuddyBotSystemPrompt(locale)}\nAge group: ${ageGroup}.`,
        },
      ];

      for (const msg of history) {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      }

      messages.push({ role: "user", content: message });

      const response = await client.chat.completions.create({
        model: textModel(),
        messages,
        temperature: 0.4,
        max_tokens: 350,
      });
      return (
        response.choices[0]?.message.content?.trim() ||
        this.localBuddyReply(message, locale)
      );
    } catch (error) {
      console.error("OpenAI chat error:", error);
      return this.localBuddyReply(message, locale);
    }
  }

  async promptFeedback(
    prompt: string,
    ageGroup: string,
    locale: AppLocale = "vi"
  ): Promise<PromptCoachResult> {
    const safety = safetyService.checkText(prompt, locale);
    if (!safety.safe) {
      return locale === "en"
        ? {
            score: 20,
            badges: ["Safe topic choice"],
            feedback: safety.message ?? "Let's switch to a safe topic!",
            improvedPrompt:
              "Explain what AI is for elementary students in 3 short points and 1 easy example.",
          }
        : {
            score: 20,
            badges: ["Biết chọn chủ đề an toàn"],
            feedback: safety.message ?? "Mình đổi sang chủ đề an toàn nhé.",
            improvedPrompt:
              "Hãy giải thích AI là gì cho học sinh tiểu học bằng 3 ý ngắn và 1 ví dụ dễ hiểu.",
          };
    }

    const client = getClient();
    if (!client) {
      return this.localPromptFeedback(prompt, locale);
    }

    try {
      const response = await client.chat.completions.create({
        model: textModel(),
        messages: [
          {
            role: "system",
            content: `${getPromptCoachSystemPrompt(locale)}\nAge group: ${ageGroup}.`,
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 350,
      });
      const content = response.choices[0]?.message.content ?? "{}";
      const parsed = promptCoachResultSchema.safeParse(JSON.parse(content));
      if (!parsed.success) {
        return this.localPromptFeedback(prompt, locale);
      }
      const outputSafety = safetyService.checkText(
        `${parsed.data.feedback}\n${parsed.data.improvedPrompt}`,
        locale
      );
      if (!outputSafety.safe) {
        return this.localPromptFeedback(prompt, locale);
      }
      return parsed.data;
    } catch {
      return this.localPromptFeedback(prompt, locale);
    }
  }

  async explain(topic: string, locale: AppLocale = "vi") {
    const prefix =
      locale === "en"
        ? "Explain very briefly for a student: "
        : "Giải thích thật ngắn cho em: ";
    return this.chat(undefined, `${prefix}${topic}`, "6-8", locale);
  }

  private localBuddyReply(message: string, locale: AppLocale) {
    const lower = message.toLowerCase();
    if (locale === "en") {
      if (lower.includes("prompt")) {
        return "A prompt is instructions you give AI. A good prompt says what to do, who it's for, and how you want the answer. Example: “Explain a butterfly's life cycle for grade 3 in 3 short points.”";
      }
      if (lower.includes("machine learning") || lower.includes("ml")) {
        return "Machine learning means computers learn from many examples. If a robot sees lots of cat and dog pictures, it learns to guess which group a new picture belongs to. If examples are weak, the robot can be wrong.";
      }
      if (lower.includes("wrong") || lower.includes("mistake")) {
        return "AI can be wrong because it learns from data and guesses answers. Check important facts with books, a teacher, or trusted sources. AI helps you learn — it doesn't replace grown-ups.";
      }
      return "AI is a computer system that can answer, sort, suggest, or create content. It learns from data, like a robot studying many examples to guess something new. But AI can be wrong, so always double-check!";
    }

    if (lower.includes("prompt")) {
      return "Prompt là lời hướng dẫn mình đưa cho AI. Prompt tốt nên nói rõ việc cần làm, người nghe là ai và muốn trả lời theo kiểu nào. Ví dụ: “Giải thích vòng đời con bướm cho học sinh lớp 3 bằng 3 ý ngắn.”";
    }
    if (lower.includes("máy học") || lower.includes("machine learning")) {
      return "Máy học là cách để máy tính học từ nhiều ví dụ. Ví dụ, khi robot xem nhiều hình mèo và chó, robot học cách đoán hình mới thuộc nhóm nào. Nếu ví dụ chưa đủ tốt, robot có thể nhầm.";
    }
    if (lower.includes("sai")) {
      return "AI có thể sai vì AI học từ dữ liệu và đoán câu trả lời. Mình nên kiểm tra lại bằng sách, thầy cô hoặc nguồn đáng tin cậy. AI là bạn hỗ trợ học tập, không thay thế người lớn.";
    }
    return "AI là một hệ thống máy tính có thể giúp trả lời, phân loại, gợi ý hoặc tạo nội dung. AI học từ dữ liệu, giống như robot xem nhiều ví dụ để đoán điều mới. Nhưng AI có thể sai, nên mình luôn kiểm tra lại nhé.";
  }

  private localPromptFeedback(
    prompt: string,
    locale: AppLocale
  ): PromptCoachResult {
    if (locale === "en") {
      const badges: string[] = [];
      let score = 30;
      if (/(please|explain|create|write|compare)/iu.test(prompt)) {
        score += 25;
        badges.push("Clear task");
      }
      if (/(grade|student|age|young|kids)/iu.test(prompt)) {
        score += 25;
        badges.push("Knows audience");
      }
      if (/(3 points|short|cheerful|bullet|example)/iu.test(prompt)) {
        score += 20;
        badges.push("Good format");
      }
      badges.push("Polite prompt");
      return {
        score: clampScore(score),
        badges: [...new Set(badges)].slice(0, 4),
        feedback:
          "Your prompt has a main idea. You can add who it's for and the format you want so AI answers more clearly.",
        improvedPrompt: `${prompt.replace(/[.!?]*$/u, "")}, for elementary students, in a cheerful tone, with 3 short points and 1 easy example.`,
      };
    }

    const badges: string[] = [];
    let score = 30;
    if (/(hãy|giải thích|tạo|viết|so sánh)/iu.test(prompt)) {
      score += 25;
      badges.push("Rõ nhiệm vụ");
    }
    if (/(lớp|học sinh|tuổi|em nhỏ)/iu.test(prompt)) {
      score += 25;
      badges.push("Biết người nghe");
    }
    if (/(3 ý|ngắn|vui vẻ|bảng|ví dụ|gạch đầu dòng)/iu.test(prompt)) {
      score += 20;
      badges.push("Có định dạng tốt");
    }
    badges.push("Prompt lịch sự");
    return {
      score: clampScore(score),
      badges: [...new Set(badges)].slice(0, 4),
      feedback:
        "Prompt của em đã có ý chính. Em có thể thêm người nghe và định dạng mong muốn để AI trả lời dễ hiểu hơn.",
      improvedPrompt: `${prompt.replace(/[.!?]*$/u, "")}, dành cho học sinh tiểu học, dùng giọng vui vẻ, gồm 3 ý ngắn và 1 ví dụ dễ hiểu.`,
    };
  }
}

function clampScore(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return 60;
  }
  return Math.max(0, Math.min(100, Math.round(n)));
}

export const openaiService = new OpenAIService();
