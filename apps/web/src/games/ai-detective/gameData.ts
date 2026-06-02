import type { DetectiveQuestion, Level } from "./types";

export const easyQuestions: DetectiveQuestion[] = [
  {
    emoji: "📺",
    text: "YouTube gợi ý video cho em.",
    answer: true,
    explain: "Có AI vì hệ thống học từ video em thường xem để gợi ý.",
  },
  {
    emoji: "🌀",
    text: "Cái quạt quay khi bấm nút.",
    answer: false,
    explain: "Không AI. Nó chỉ làm theo nút bấm vật lý thông thường.",
  },
  {
    emoji: "⏰",
    text: "Đồng hồ báo thức kêu lúc 6 giờ.",
    answer: false,
    explain: "Không AI. Nó chỉ kêu theo giờ em đã cài đặt trước.",
  },
  {
    emoji: "🔦",
    text: "Đèn pin sáng lên khi gạt công tắc.",
    answer: false,
    explain: "Không AI. Điện chạy qua làm sáng đèn pin ngay lập tức.",
  },
  {
    emoji: "🤖",
    text: "Máy hút bụi tự động né tránh bàn ghế trong nhà.",
    answer: true,
    explain:
      "Có AI vì máy sử dụng cảm biến và học cách nhận biết chướng ngại vật để di chuyển.",
  },
  {
    emoji: "💡",
    text: "Đèn đường tự động sáng khi trời tối nhờ cảm biến ánh sáng.",
    answer: false,
    explain:
      "Không AI. Đây chỉ là cảm biến quang học bật tắt công tắc dòng điện vật lý thông thường.",
  },
  {
    emoji: "🧮",
    text: "Máy tính bỏ túi tính ra kết quả 123 + 456 = 579.",
    answer: false,
    explain:
      "Không AI. Nó chỉ chạy theo công thức toán học cố định được cài sẵn.",
  },
  {
    emoji: "✍️",
    text: "Điện thoại tự sửa từ viết sai chính tả khi em gõ tin nhắn.",
    answer: true,
    explain:
      "Có AI vì bàn phím thông minh học từ thói quen gõ chữ của con người để đoán từ đúng.",
  },
  {
    emoji: "🧼",
    text: "Vòi nước tự xả khi em đưa tay vào dưới vòi nhờ cảm biến tiệm cận.",
    answer: false,
    explain:
      "Không AI. Cảm biến khoảng cách chỉ bật van nước cơ học bình thường khi bị che khuất.",
  },
  {
    emoji: "📱",
    text: "Ứng dụng máy ảnh tự động làm mịn da và làm to mắt em.",
    answer: true,
    explain:
      "Có AI vì ứng dụng tự phát hiện cấu trúc khuôn mặt và áp dụng hiệu ứng làm đẹp thông minh.",
  },
  {
    emoji: "📺",
    text: "Tivi tự động chuyển kênh khi em bấm nút số trên điều khiển.",
    answer: false,
    explain:
      "Không AI. Tivi chỉ nhận tín hiệu hồng ngoại cố định tương ứng với nút bấm để đổi kênh.",
  },
  {
    emoji: "🧊",
    text: "Tủ lạnh tự làm đá viên khi ngăn chứa đầy nước.",
    answer: false,
    explain:
      "Không AI. Đây là hệ thống cơ điện tự động đổ khay đá khi đủ độ lạnh, không cần tự học.",
  },
];

export const hardQuestions: DetectiveQuestion[] = [
  {
    emoji: "🌐",
    text: "Google Translate dịch câu tiếng Anh.",
    answer: true,
    explain: "Có AI vì máy học hàng triệu mẫu câu để dịch ngôn ngữ.",
  },
  {
    emoji: "📸",
    text: "Máy ảnh tự nhận diện khuôn mặt em.",
    answer: true,
    explain: "Có AI vì máy tính đã học cách nhận dạng các khuôn mặt khác nhau.",
  },
  {
    emoji: "📧",
    text: "Hộp thư email tự lọc thư rác quảng cáo.",
    answer: true,
    explain: "Có AI vì hệ thống tự phân tích từ ngữ để chặn thư rác.",
  },
  {
    emoji: "🚗",
    text: "Xe tự lái dừng lại trước biển báo đỏ.",
    answer: true,
    explain: "Có AI vì camera nhận diện và xử lý biển báo để dừng xe.",
  },
  {
    emoji: "❄️",
    text: "Điều hòa tự điều chỉnh hướng gió khi có người.",
    answer: true,
    explain:
      "Có AI vì cảm biến hồng ngoại nhận diện vị trí con người để hướng gió.",
  },
  {
    emoji: "🗺️",
    text: "Bản đồ Google Maps chỉ đường tránh kẹt xe.",
    answer: true,
    explain:
      "Có AI vì hệ thống phân tích dữ liệu di chuyển của hàng triệu người để dự báo điểm tắc đường.",
  },
  {
    emoji: "🏭",
    text: "Cánh tay robot lặp lại động tác lắp ráp trong nhà máy.",
    answer: false,
    explain:
      "Không AI. Nó chỉ hoạt động chính xác theo lập trình cứng có sẵn, không tự học hỏi điều mới.",
  },
  {
    emoji: "🔑",
    text: "Khóa cửa thông minh tự mở khi nhận diện đúng Face ID khuôn mặt của bố mẹ.",
    answer: true,
    explain:
      "Có AI vì hệ thống sử dụng thuật toán nhận dạng để ghi nhớ và phân tích đặc điểm khuôn mặt.",
  },
  {
    emoji: "🎨",
    text: "Ứng dụng tự vẽ ra một bức tranh khi em gõ mô tả bằng lời nói.",
    answer: true,
    explain:
      "Có AI tạo sinh hình ảnh (Generative AI) được huấn luyện trên hàng triệu bức tranh để vẽ ra hình mới.",
  },
  {
    emoji: "💬",
    text: "Buddy Bot gợi ý các câu hỏi thông minh khi em đang chat.",
    answer: true,
    explain: "Có AI phân tích các từ em gõ để tìm ra chủ đề phù hợp tiếp theo.",
  },
  {
    emoji: "🩺",
    text: "Hệ thống máy tính phân tích ảnh X-quang để giúp bác sĩ phát hiện bệnh phổi.",
    answer: true,
    explain:
      "Có AI vì máy tính được huấn luyện trên hàng triệu bức ảnh y tế để học cách nhận diện dấu hiệu tổn thương.",
  },
  {
    emoji: "🎼",
    text: "Ứng dụng tự nhận diện tên bài hát khi em cho nó nghe một đoạn nhạc ngắn.",
    answer: true,
    explain:
      "Có AI phân tích tần số âm thanh và đối chiếu nhanh với cơ sở dữ liệu hàng triệu bài hát.",
  },
];

export function getQuestionBank(level: Level): DetectiveQuestion[] {
  return level === "easy" ? easyQuestions : hardQuestions;
}
