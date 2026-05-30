import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import type { ImageGenerateInput } from "@ai-adventure/shared";
import { imageStudioSystemPrompt } from "../prompts/imageStudio.system";
import { imageRedirectMessage } from "../prompts/safety.system";
import { safetyService, normalizeText } from "./safety.service";

export interface BuiltImagePrompt {
	safe: boolean;
	prompt: string;
	reason: string;
	studentMessage: string;
}

export class ImageService {
	async buildPrompt(input: ImageGenerateInput): Promise<BuiltImagePrompt> {
		const colors = input.details.colors.length
			? input.details.colors.join(", ")
			: "màu sắc tươi sáng";
		const textRule = input.details.includeText
			? "có chữ ngắn tối đa 3 từ"
			: "không có chữ trong ảnh";
		const prompt = normalizeText(
			`Tạo một ${input.style.toLowerCase()} thiếu nhi, an toàn, vui vẻ, về ${input.details.subject} trong bối cảnh ${input.details.setting}. Chủ đề ${input.theme}. Màu sắc: ${colors}. Cảm xúc: ${input.details.mood}. Mục đích học tập cho học sinh ${input.ageGroup} tuổi, ${textRule}. Chỉ dùng nhân vật tưởng tượng, phong cách minh họa lớp học, nội dung tích cực.`,
		);

		const safety = safetyService.checkImagePrompt(prompt);
		if (!safety.safe) {
			return {
				safe: false,
				prompt: "",
				reason: safety.reason ?? "unsafe",
				studentMessage: imageRedirectMessage,
			};
		}

		return {
			safe: true,
			prompt,
			reason: "safe_guided_blocks",
			studentMessage: "Prompt đã sẵn sàng để tạo tranh AI an toàn.",
		};
	}

	async generateImageFile(prompt: string, id: string, style?: string) {
		const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "./uploads");
		const imageDir = path.join(uploadRoot, "generated-images");
		await fs.mkdir(imageDir, { recursive: true });

		const apiKey = process.env.IMAGE_API_KEY || process.env.OPENAI_API_KEY;
		const baseURL = process.env.IMAGE_BASE_URL;

		if (!apiKey) return this.writeFallbackSvg(imageDir, id, prompt);

		try {
			const isCustomProxy =
				baseURL?.includes("image-for-kids") || apiKey === "free-for-kids";

			const client = new OpenAI({
				apiKey,
				baseURL: baseURL || undefined,
				timeout: 60_000,
				maxRetries: 1,
				defaultHeaders: isCustomProxy
					? {
							"User-Agent":
								"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
						}
					: undefined,
			});

			let model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

			if (style && isCustomProxy) {
				const s = style.toLowerCase();
				if (s.includes("hoạt hình") || s.includes("anime")) {
					model = "anime";
				} else if (
					s.includes("3d") ||
					s.includes("3 chiều") ||
					s.includes("đất sét")
				) {
					model = "3d";
				} else if (
					s.includes("màu nước") ||
					s.includes("watercolor") ||
					s.includes("sách tranh") ||
					s.includes("thiếu nhi")
				) {
					model = "flux";
				} else if (
					s.includes("sticker") ||
					s.includes("pixel") ||
					s.includes("poster") ||
					s.includes("đơn giản")
				) {
					model = "turbo";
				} else {
					model = "turbo";
				}
			}

			// Build parameters, avoiding sending quality and n if using the custom proxy (which might crash it)
			const baseParams: OpenAI.Images.ImageGenerateParams = {
				model,
				prompt,
				size: (process.env.OPENAI_IMAGE_SIZE ||
					"1024x1024") as OpenAI.Images.ImageGenerateParams["size"],
			};

			if (isCustomProxy) {
				baseParams.response_format = "url";
			} else {
				if (process.env.OPENAI_IMAGE_QUALITY) {
					baseParams.quality = process.env
						.OPENAI_IMAGE_QUALITY as OpenAI.Images.ImageGenerateParams["quality"];
				}
				baseParams.n = 1;
			}

			const result = await client.images.generate(baseParams);

			const image = result.data?.[0];
			if (image?.b64_json) {
				const filename = `${id}.png`;
				const filePath = path.join(imageDir, filename);
				await fs.writeFile(filePath, Buffer.from(image.b64_json, "base64"));
				return { filename, filePath };
			}
			if (image?.url) {
				let downloadUrl = image.url;
				if (
					isCustomProxy &&
					downloadUrl.includes("ai-proxy.phongdang.io.vn/generate")
				) {
					downloadUrl = downloadUrl.replace(
						"ai-proxy.phongdang.io.vn/generate",
						"ai-proxy.phongdang.io.vn/image-for-kids/generate",
					);
					if (downloadUrl.startsWith("http://")) {
						downloadUrl = downloadUrl.replace("http://", "https://");
					}
				}

				const safeDownloadUrl = validateImageDownloadUrl(downloadUrl);
				if (!safeDownloadUrl) throw new Error("download_url_not_allowed");

				// Also send browser User-Agent when fetching the image to avoid Cloudflare 403 on download
				const response = await fetch(safeDownloadUrl, {
					headers: isCustomProxy
						? {
								"User-Agent":
									"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
							}
						: undefined,
				});
				if (!response.ok)
					throw new Error(`download_failed: ${response.status}`);
				const filename = `${id}.png`;
				const filePath = path.join(imageDir, filename);
				await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
				return { filename, filePath };
			}
			return this.writeFallbackSvg(imageDir, id, prompt);
		} catch (error) {
			console.error("Lỗi tạo ảnh từ Kids Proxy:", error);
			return this.writeFallbackSvg(imageDir, id, prompt);
		}
	}

	getSystemPrompt() {
		return imageStudioSystemPrompt;
	}

	private async writeFallbackSvg(imageDir: string, id: string, prompt: string) {
		const filename = `${id}.svg`;
		const filePath = path.join(imageDir, filename);
		const safePrompt = escapeXml(prompt).slice(0, 88);
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<rect width="1024" height="1024" fill="#FFF7ED"/>
<circle cx="210" cy="190" r="96" fill="#5EEAD4"/>
<circle cx="820" cy="230" r="120" fill="#FACC15"/>
<circle cx="760" cy="810" r="150" fill="#A78BFA"/>
<rect x="240" y="300" width="540" height="420" rx="80" fill="#FFFFFF" stroke="#60A5FA" stroke-width="18"/>
<circle cx="420" cy="470" r="42" fill="#1F2937"/>
<circle cx="604" cy="470" r="42" fill="#1F2937"/>
<path d="M410 600 Q512 680 614 600" fill="none" stroke="#FB923C" stroke-width="26" stroke-linecap="round"/>
<line x1="512" y1="300" x2="512" y2="210" stroke="#1F2937" stroke-width="18" stroke-linecap="round"/>
<polygon points="512,130 535,180 590,187 550,226 560,280 512,254 464,280 474,226 434,187 489,180" fill="#F472B6"/>
<text x="512" y="830" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#1F2937">Hình minh họa AI an toàn</text>
<text x="512" y="880" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6B7280">${safePrompt}</text>
</svg>`;
		await fs.writeFile(filePath, svg, "utf8");
		return { filename, filePath };
	}
}

function escapeXml(value: string) {
	return value
		.replace(/[\u0000-\u001F\u007F]/g, " ")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function validateImageDownloadUrl(value: string) {
	try {
		const url = new URL(value);
		if (url.protocol !== "https:") return null;
		const host = url.hostname.toLowerCase();
		if (host === "localhost" || host.endsWith(".local")) return null;
		if (/^(127|10|0|169\.254|192\.168)\./.test(host)) return null;
		if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return null;
		return url.toString();
	} catch {
		return null;
	}
}

export const imageService = new ImageService();
