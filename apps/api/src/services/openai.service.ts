import OpenAI from "openai";
import {
	promptCoachResultSchema,
	type PromptCoachResult,
} from "@ai-adventure/shared";
import { buddyBotSystemPrompt } from "../prompts/buddyBot.system";
import { promptCoachSystemPrompt } from "../prompts/promptCoach.system";
import { safetyService } from "./safety.service";
import { prisma } from "../db/client";

function getClient() {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) return null;
	const baseURL = process.env.OPENAI_BASE_URL;
	return new OpenAI({
		apiKey,
		baseURL: baseURL || undefined,
		timeout: 20_000,
		maxRetries: 1,
	});
}

function textModel() {
	return process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
}

export class OpenAIService {
	async chat(sessionId: string | undefined, message: string, ageGroup: string) {
		const safety = safetyService.checkText(message);
		if (!safety.safe)
			return safety.message ?? "Mình chuyển sang chủ đề học tập an toàn nhé.";

		const client = getClient();
		if (!client) {
			return this.localBuddyReply(message);
		}

		try {
			// Fetch latest 10 messages to build multi-turn context
			const history = sessionId
				? await prisma.chatMessage.findMany({
						where: { sessionId, safetyLevel: "safe" },
						orderBy: { createdAt: "desc" },
						take: 10,
					})
				: [];
			history.reverse();

			const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
				{
					role: "system",
					content: `${buddyBotSystemPrompt}\nNhóm tuổi: ${ageGroup}.`,
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
				this.localBuddyReply(message)
			);
		} catch (error) {
			console.error("Lỗi chatbot OpenAI:", error);
			return this.localBuddyReply(message);
		}
	}

	async promptFeedback(
		prompt: string,
		ageGroup: string,
	): Promise<PromptCoachResult> {
		const safety = safetyService.checkText(prompt);
		if (!safety.safe) {
			return {
				score: 20,
				badges: ["Biết chọn chủ đề an toàn"],
				feedback: safety.message ?? "Mình đổi sang chủ đề an toàn nhé.",
				improvedPrompt:
					"Hãy giải thích AI là gì cho học sinh tiểu học bằng 3 ý ngắn và 1 ví dụ dễ hiểu.",
			};
		}

		const client = getClient();
		if (!client) return this.localPromptFeedback(prompt);

		try {
			const response = await client.chat.completions.create({
				model: textModel(),
				messages: [
					{
						role: "system",
						content: `${promptCoachSystemPrompt}\nNhóm tuổi: ${ageGroup}.`,
					},
					{ role: "user", content: prompt },
				],
				response_format: { type: "json_object" },
				temperature: 0.2,
				max_tokens: 350,
			});
			const content = response.choices[0]?.message.content ?? "{}";
			const parsed = promptCoachResultSchema.safeParse(JSON.parse(content));
			if (!parsed.success) return this.localPromptFeedback(prompt);
			const outputSafety = safetyService.checkText(
				`${parsed.data.feedback}\n${parsed.data.improvedPrompt}`,
			);
			if (!outputSafety.safe) return this.localPromptFeedback(prompt);
			return parsed.data;
		} catch {
			return this.localPromptFeedback(prompt);
		}
	}

	async explain(topic: string) {
		return this.chat(undefined, `Giải thích thật ngắn cho em: ${topic}`, "6-8");
	}

	private localBuddyReply(message: string) {
		const lower = message.toLowerCase();
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

	private localPromptFeedback(prompt: string): PromptCoachResult {
		const badges: string[] = [];
		let score = 30;
		if (/(hãy|giải thích|tạo|viết|so sánh)/i.test(prompt)) {
			score += 25;
			badges.push("Rõ nhiệm vụ");
		}
		if (/(lớp|học sinh|tuổi|em nhỏ)/i.test(prompt)) {
			score += 25;
			badges.push("Biết người nghe");
		}
		if (/(3 ý|ngắn|vui vẻ|bảng|ví dụ|gạch đầu dòng)/i.test(prompt)) {
			score += 20;
			badges.push("Có định dạng tốt");
		}
		badges.push("Prompt lịch sự");
		return {
			score: clampScore(score),
			badges: [...new Set(badges)].slice(0, 4),
			feedback:
				"Prompt của em đã có ý chính. Em có thể thêm người nghe và định dạng mong muốn để AI trả lời dễ hiểu hơn.",
			improvedPrompt: `${prompt.replace(/[.!?]*$/, "")}, dành cho học sinh tiểu học, dùng giọng vui vẻ, gồm 3 ý ngắn và 1 ví dụ dễ hiểu.`,
		};
	}
}

function clampScore(value: unknown) {
	const n = Number(value);
	if (!Number.isFinite(n)) return 60;
	return Math.max(0, Math.min(100, Math.round(n)));
}

export const openaiService = new OpenAIService();
