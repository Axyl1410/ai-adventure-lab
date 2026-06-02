import type { ImageDetails } from "./types";

export function buildStudentPrompt(
  theme: string,
  style: string,
  details: ImageDetails
): string {
  return `Tạo ${style.toLowerCase()} về ${details.subject} trong ${details.setting}, chủ đề ${theme}, màu ${details.colors.join(", ")}, cảm xúc ${details.mood}, ${details.includeText ? "có chữ ngắn" : "không có chữ trong ảnh"}.`;
}
