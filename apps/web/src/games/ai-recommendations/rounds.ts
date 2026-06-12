import { DEFAULT_QUESTION } from "./constants";
import type { RecommendationRound } from "./types";

export const ALL_ROUNDS: RecommendationRound[] = [
  {
    id: "round-1",
    friendLabel: "Bạn Gấu",
    friendEmoji: "🐻",
    recentLikes: [
      { emoji: "🔍", label: "Thám Tử AI" },
      { emoji: "🤔", label: "AI Có Thể Sai" },
    ],
    question: DEFAULT_QUESTION,
    options: [
      { id: "detective", emoji: "🔍", label: "Thám Tử AI" },
      { id: "image-studio", emoji: "🎨", label: "Xưởng Tranh AI" },
      { id: "ask-school", emoji: "🏫", label: "Hỏi tên trường để gợi ý" },
      { id: "teach-robot", emoji: "🤖", label: "Dạy Robot Học" },
    ],
    correctOptionId: "detective",
    explain:
      "Bạn hay chơi trò thám tử — AI gợi ý theo mẫu đã thấy, không đọc suy nghĩ.",
    kind: "matchPattern",
  },
  {
    id: "round-2",
    friendLabel: "Bạn Sao",
    friendEmoji: "⭐",
    recentLikes: [
      { emoji: "🎨", label: "Xưởng Tranh AI" },
      { emoji: "✨", label: "Phép Thuật Câu Lệnh" },
    ],
    question: DEFAULT_QUESTION,
    options: [
      { id: "image-studio", emoji: "🎨", label: "Xưởng Tranh AI" },
      { id: "detective", emoji: "🔍", label: "Thám Tử AI" },
      { id: "data-sorter", emoji: "🗂️", label: "Xếp Loại Dữ Liệu" },
      { id: "teachable", emoji: "📷", label: "Huấn Luyện AI Mini" },
    ],
    correctOptionId: "image-studio",
    explain:
      "Bạn thích sáng tạo tranh và prompt — gợi ý khớp sở thích gần đây.",
    kind: "matchPattern",
  },
  {
    id: "round-3",
    friendLabel: "Bạn Robot",
    friendEmoji: "🤖",
    recentLikes: [
      { emoji: "🧠", label: "Dạy Robot Học" },
      { emoji: "📷", label: "Huấn Luyện AI Mini" },
    ],
    question: DEFAULT_QUESTION,
    options: [
      { id: "teach-robot", emoji: "🧠", label: "Dạy Robot Học" },
      { id: "buddy-bot", emoji: "💬", label: "Buddy Bot Trò Chuyện" },
      { id: "oops", emoji: "🤔", label: "AI Có Thể Sai" },
      { id: "safety", emoji: "🛡️", label: "Nhiệm Vụ An Toàn AI" },
    ],
    correctOptionId: "teach-robot",
    explain: "AI học từ ví dụ — gợi ý trò robot phù hợp với mẫu bạn đã chơi.",
    kind: "matchPattern",
  },
  {
    id: "round-4",
    friendLabel: "Bạn Gấu",
    friendEmoji: "🐻",
    recentLikes: [{ emoji: "🧭", label: "Xếp Lệnh Cho Robot" }],
    question: "Buddy Bot nên gợi ý gì khi bạn vừa chơi trò này?",
    options: [
      {
        id: "repeat-commands",
        emoji: "🧭",
        label: "Gợi ý lại Xếp Lệnh Cho Robot",
      },
      { id: "image-studio", emoji: "🎨", label: "Xưởng Tranh AI" },
      { id: "detective", emoji: "🔍", label: "Thám Tử AI" },
      {
        id: "ask-address",
        emoji: "🏠",
        label: "Hỏi địa chỉ để gợi ý chính xác",
      },
    ],
    correctOptionId: "repeat-commands",
    explain:
      "Gợi ý lặp trò vừa chơi là bình thường — giống YouTube gợi ý video em hay xem.",
    kind: "repeatOk",
  },
  {
    id: "round-5",
    friendLabel: "Bạn Sao",
    friendEmoji: "⭐",
    recentLikes: [
      { emoji: "🗂️", label: "Xếp Loại Dữ Liệu" },
      { emoji: "🛡️", label: "Nhiệm Vụ An Toàn AI" },
    ],
    question: DEFAULT_QUESTION,
    options: [
      { id: "safety", emoji: "🛡️", label: "Nhiệm Vụ An Toàn AI" },
      { id: "image-studio", emoji: "🎨", label: "Xưởng Tranh AI" },
      { id: "prompt", emoji: "✨", label: "Phép Thuật Câu Lệnh" },
      { id: "teachable", emoji: "📷", label: "Huấn Luyện AI Mini" },
    ],
    correctOptionId: "safety",
    explain:
      "Bạn hay chơi trò an toàn và dữ liệu — AI gợi ý theo thói quen đó.",
    kind: "matchPattern",
  },
  {
    id: "round-6",
    friendLabel: "Bạn Robot",
    friendEmoji: "🤖",
    recentLikes: [{ emoji: "💬", label: "Buddy Bot Trò Chuyện" }],
    question: DEFAULT_QUESTION,
    options: [
      { id: "buddy-bot", emoji: "💬", label: "Buddy Bot Trò Chuyện" },
      {
        id: "ask-phone",
        emoji: "📱",
        label: "Nhập số điện thoại để gợi ý hay hơn",
      },
      { id: "detective", emoji: "🔍", label: "Thám Tử AI" },
      { id: "commands", emoji: "🧭", label: "Xếp Lệnh Cho Robot" },
    ],
    correctOptionId: "buddy-bot",
    explain:
      "Gợi ý trò chat phù hợp mẫu đã chơi. Không cần số điện thoại để gợi ý!",
    kind: "matchPattern",
  },
  {
    id: "round-7",
    friendLabel: "Bạn Gấu",
    friendEmoji: "🐻",
    recentLikes: [{ emoji: "✨", label: "Phép Thuật Câu Lệnh" }],
    question: DEFAULT_QUESTION,
    options: [
      { id: "prompt", emoji: "✨", label: "Phép Thuật Câu Lệnh" },
      { id: "teachable", emoji: "📷", label: "Huấn Luyện AI Mini" },
      { id: "data-sorter", emoji: "🗂️", label: "Xếp Loại Dữ Liệu" },
      { id: "oops", emoji: "🤔", label: "AI Có Thể Sai" },
    ],
    correctOptionId: "prompt",
    explain:
      "Bạn thích ghép prompt — AI gợi ý trò tương tự, không phải ma thuật.",
    kind: "matchPattern",
  },
  {
    id: "round-8",
    friendLabel: "Bạn Sao",
    friendEmoji: "⭐",
    recentLikes: [
      { emoji: "🎨", label: "Xưởng Tranh AI" },
      { emoji: "✨", label: "Phép Thuật Câu Lệnh" },
    ],
    question: "Cách nào KHÔNG nên dùng để AI gợi ý trò hay hơn?",
    options: [
      { id: "watch-history", emoji: "👀", label: "Xem trò bạn hay chơi" },
      { id: "ask-address", emoji: "🏠", label: "Cho AI biết địa chỉ nhà" },
      { id: "repeat-fav", emoji: "🔁", label: "Gợi ý lại trò yêu thích" },
      { id: "similar", emoji: "🎯", label: "Gợi ý trò giống sở thích" },
    ],
    correctOptionId: "ask-address",
    explain:
      "Địa chỉ nhà là riêng tư. AI chỉ nên gợi ý theo trò em đã chơi, không hỏi thông tin cá nhân.",
    kind: "rejectPrivacy",
  },
];
