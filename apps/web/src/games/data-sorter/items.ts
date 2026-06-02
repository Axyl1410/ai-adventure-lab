import type { SorterCard } from "./types";

export const ALL_ITEMS: SorterCard[] = [
  {
    emoji: "🐱",
    text: "10 ảnh mèo rõ nét, đủ sáng.",
    category: "Dữ liệu tốt",
    explain: "Ảnh rõ và đúng nhãn giúp AI học tốt hơn.",
  },
  {
    emoji: "🌫️",
    text: "Ảnh chó bị mờ, thiếu sáng.",
    category: "Dữ liệu nhiễu",
    explain: "Ảnh mờ làm AI khó nhận ra đặc điểm chính.",
  },
  {
    emoji: "📞",
    text: "Số điện thoại của bạn trong lớp.",
    category: "Thông tin riêng tư",
    explain: "Số điện thoại là dữ liệu cá nhân, không đưa vào bài học AI.",
  },
  {
    emoji: "🍎",
    text: "Nhiều ảnh táo đỏ, táo xanh và táo vàng.",
    category: "Dữ liệu tốt",
    explain: "Dữ liệu đa dạng giúp AI nhận biết tốt hơn.",
  },
  {
    emoji: "🏷️",
    text: "Ảnh quả chuối nhưng bị gắn nhãn là quả cam.",
    category: "Dữ liệu nhiễu",
    explain: "Nhãn sai làm AI học sai.",
  },
  {
    emoji: "🏠",
    text: "Địa chỉ nhà của học sinh.",
    category: "Thông tin riêng tư",
    explain: "Địa chỉ nhà cần được bảo vệ và không chia sẻ.",
  },
  {
    emoji: "🤖",
    text: "Ảnh robot đồ chơi được chụp nhiều góc khác nhau.",
    category: "Dữ liệu tốt",
    explain: "Nhiều góc nhìn giúp AI học đặc điểm đầy đủ hơn.",
  },
  {
    emoji: "❓",
    text: "Một ảnh không biết là mèo hay chó nhưng vẫn ép chọn nhãn.",
    category: "Dữ liệu nhiễu",
    explain: "Ví dụ không rõ ràng cần kiểm tra lại trước khi dùng.",
  },
];
