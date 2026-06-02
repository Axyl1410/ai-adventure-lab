import type { BlockKey } from "./types";

export const PROMPT_BLOCKS: Record<BlockKey, string[]> = {
  role: [
    "Hãy đóng vai bạn học tập vui vẻ",
    "Hãy đóng vai giáo viên tiểu học",
    "Hãy đóng vai Buddy Bot",
    "Hãy đóng vai nhà du hành vũ trụ nhí",
    "Hãy đóng vai chú gấu bông thông thái",
  ],
  task: [
    "giải thích vòng đời con bướm",
    "giải thích AI là gì",
    "tạo một câu đố toán lớp 3",
    "kể câu chuyện về bảo vệ môi trường",
    "giải thích vì sao trời lại mưa",
  ],
  audience: [
    "cho học sinh lớp 3",
    "cho bạn nhỏ 7 tuổi",
    "cho người mới bắt đầu",
    "cho các em mẫu giáo tò mò",
    "cho chú mèo con đáng yêu",
  ],
  style: [
    "dùng giọng vui vẻ",
    "dùng ví dụ trái cây",
    "dùng từ thật dễ hiểu",
    "dùng giọng điệu siêu anh hùng",
    "dùng một bài thơ vui nhộn",
  ],
  format: [
    "gồm 3 ý ngắn và 1 ví dụ",
    "trả lời bằng gạch đầu dòng",
    "kết thúc bằng 1 câu hỏi nhỏ",
    "gồm 2 câu đố vui bất ngờ",
    "tóm tắt thành 3 từ khóa chính",
  ],
};
