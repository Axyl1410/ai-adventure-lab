/** Suggest follow-up chips from keywords in the user's message */
export function getFollowUpChips(userText: string): string[] {
  const lowerText = userText.toLowerCase();

  if (lowerText.includes("chuyện") || lowerText.includes("kể")) {
    return [
      "📖 Kể tiếp câu chuyện đi!",
      "💡 Bài học của truyện là gì?",
      "🤖 AI có tự viết truyện không?",
      "🏠 Về phòng lab chơi game",
    ];
  }

  if (
    lowerText.includes("toán") ||
    lowerText.includes("đố") ||
    lowerText.includes("câu đố")
  ) {
    return [
      "🔢 Cho em câu đố khác khó hơn!",
      "✨ Gợi ý cho em một chút đi",
      "🍎 Giải thích bằng hình ảnh trái cây",
      "🤖 Buddy Bot tự giải toán được không?",
    ];
  }

  if (
    lowerText.includes("ai") ||
    lowerText.includes("trí tuệ nhân tạo") ||
    lowerText.includes("máy học")
  ) {
    return [
      "🧠 Làm thế nào để dạy AI học?",
      "❓ Tại sao AI có lúc đoán sai?",
      "📱 Điện thoại em có AI không?",
      "🎨 AI vẽ tranh như thế nào?",
    ];
  }

  if (
    lowerText.includes("prompt") ||
    lowerText.includes("câu lệnh") ||
    lowerText.includes("tranh") ||
    lowerText.includes("vẽ")
  ) {
    return [
      "🪄 Cách viết prompt tạo tranh đẹp",
      "🛡️ An toàn hình ảnh là gì?",
      "💬 Nhờ Buddy Bot sửa prompt giúp em",
      "🎨 Đi vẽ tranh ở Xưởng Tranh AI",
    ];
  }

  return [
    "🤖 Cậu học thế nào vậy?",
    "🍎 Cho em một ví dụ dễ hiểu",
    "❓ AI có cảm xúc thật không?",
    "🔢 Đố toán vui lớp 3 đi",
  ];
}
