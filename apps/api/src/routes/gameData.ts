import type { GameCard } from "@ai-adventure/shared";

export const games: GameCard[] = [
  {
    key: "ai-detective",
    title: "AI Detective",
    description: "Đoán xem hoạt động nào có AI.",
    difficulty: "Dễ",
    color: "from-sky-400 to-blue-400",
    path: "/games/ai-detective",
  },
  {
    key: "teach-the-robot",
    title: "Teach the Robot",
    description: "Dạy robot học bằng ví dụ.",
    difficulty: "Dễ",
    color: "from-green-400 to-mint-300",
    path: "/games/teach-the-robot",
  },
  {
    key: "teachable-machine",
    title: "Train Your Mini AI",
    description: "Thử model Teachable Machine.",
    difficulty: "Khám phá",
    color: "from-purple-400 to-pink-400",
    path: "/games/teachable-machine",
  },
  {
    key: "prompt-magic",
    title: "Prompt Magic",
    description: "Ghép prompt để hướng dẫn AI.",
    difficulty: "Vừa",
    color: "from-yellow-300 to-orange-400",
    path: "/games/prompt-magic",
  },
  {
    key: "oops-ai-mistake",
    title: "Oops, AI Mistake!",
    description: "Tìm lỗi sai của AI.",
    difficulty: "Dễ",
    color: "from-red-300 to-orange-300",
    path: "/games/oops-ai-mistake",
  },
  {
    key: "buddy-bot",
    title: "Buddy Bot",
    description: "Trò chuyện với robot học tập.",
    difficulty: "Khám phá",
    color: "from-blue-400 to-purple-400",
    path: "/games/buddy-bot",
  },
  {
    key: "image-studio",
    title: "AI Image Studio",
    description: "Tạo tranh bằng prompt an toàn.",
    difficulty: "Khám phá",
    color: "from-pink-400 to-yellow-300",
    path: "/games/image-studio",
  },
  {
    key: "data-sorter",
    title: "Data Sorter",
    description: "Phân loại dữ liệu tốt, nhiễu và riêng tư.",
    difficulty: "Vừa",
    color: "from-emerald-400 to-sky-400",
    path: "/games/data-sorter",
  },
  {
    key: "ai-safety-quest",
    title: "AI Safety Quest",
    description: "Chọn hành động an toàn khi dùng AI.",
    difficulty: "Dễ",
    color: "from-lime-300 to-green-400",
    path: "/games/ai-safety-quest",
  },
  {
    key: "robot-commands",
    title: "Robot Commands",
    description: "Xếp lệnh từng bước để robot nhặt táo.",
    difficulty: "Vừa",
    color: "from-sky-400 to-mint-300",
    path: "/games/robot-commands",
  },
];

export const aiDetectiveQuestions = [
  {
    text: "YouTube gợi ý video cho em.",
    answer: true,
    explain: "Có AI vì hệ thống học từ video em thường xem để gợi ý video mới.",
  },
  {
    text: "Cái quạt quay khi bấm nút.",
    answer: false,
    explain: "Không AI. Cái quạt chỉ làm theo nút bấm, không học từ dữ liệu.",
  },
  {
    text: "Google Translate dịch câu tiếng Anh.",
    answer: true,
    explain: "Có AI vì máy học từ rất nhiều câu để dịch ngôn ngữ.",
  },
  {
    text: "Đồng hồ báo thức kêu lúc 6 giờ.",
    answer: false,
    explain: "Không AI. Đồng hồ chỉ làm theo giờ em đặt trước.",
  },
  {
    text: "Máy ảnh nhận diện khuôn mặt.",
    answer: true,
    explain: "Có AI vì máy đoán khuôn mặt dựa trên hình ảnh.",
  },
  {
    text: "Máy hút bụi tự động né tránh bàn ghế trong nhà.",
    answer: true,
    explain:
      "Có AI vì máy sử dụng cảm biến và học cách nhận biết chướng ngại vật để di chuyển.",
  },
  {
    text: "Đèn đường tự động sáng khi trời tối nhờ cảm biến ánh sáng.",
    answer: false,
    explain:
      "Không AI. Đây chỉ là cảm biến quang học bật tắt công tắc dòng điện vật lý thông thường.",
  },
  {
    text: "Máy tính bỏ túi tính ra kết quả 123 + 456 = 579.",
    answer: false,
    explain:
      "Không AI. Nó chỉ chạy theo công thức toán học cố định được cài sẵn.",
  },
  {
    text: "Điện thoại tự sửa từ viết sai chính tả khi em gõ tin nhắn.",
    answer: true,
    explain:
      "Có AI vì bàn phím thông minh học từ thói quen gõ chữ của con người để đoán từ đúng.",
  },
  {
    text: "Bản đồ Google Maps chỉ đường tránh kẹt xe.",
    answer: true,
    explain:
      "Có AI vì hệ thống phân tích dữ liệu di chuyển của hàng triệu người để dự báo điểm tắc đường.",
  },
  {
    text: "Cánh tay robot lặp lại động tác lắp ráp trong nhà máy.",
    answer: false,
    explain:
      "Không AI. Nó chỉ hoạt động chính xác theo lập trình cứng có sẵn, không tự học hỏi điều mới.",
  },
  {
    text: "Khóa cửa thông minh tự mở khi nhận diện đúng Face ID khuôn mặt của bố mẹ.",
    answer: true,
    explain:
      "Có AI vì hệ thống sử dụng thuật toán nhận dạng để ghi nhớ và phân tích đặc điểm khuôn mặt.",
  },
  {
    text: "Ứng dụng tự vẽ ra một bức tranh khi em gõ mô tả bằng lời nói.",
    answer: true,
    explain:
      "Có AI tạo sinh hình ảnh (Generative AI) được huấn luyện trên hàng triệu bức tranh để vẽ ra hình mới.",
  },
];

export const oopsQuestions = [
  {
    text: "Con cá sống trên cây.",
    answer: "Sai",
    explain: "Cá thường sống dưới nước, nên câu này sai.",
  },
  {
    text: "Mặt trời mọc ở hướng Đông.",
    answer: "Đúng",
    explain:
      "Đúng. Đây là kiến thức phổ biến, nhưng mình vẫn nên học từ sách và thầy cô.",
  },
  {
    text: "Tất cả loài chim đều biết bay.",
    answer: "Cần kiểm tra thêm",
    explain:
      "Không phải tất cả. Chim cánh cụt và đà điểu không bay, nên cần kiểm tra thêm.",
  },
  {
    text: "AI luôn luôn đúng.",
    answer: "Sai",
    explain: "AI có thể sai. Mình nên kiểm tra lại với nguồn đáng tin cậy.",
  },
  {
    text: "Quả chuối chín tự nhiên thường có màu xanh dương.",
    answer: "Sai",
    explain:
      "Chuối chín tự nhiên có màu vàng, màu xanh dương là do AI vẽ nhầm hoặc bịa ra đấy.",
  },
  {
    text: "Mèo là loài động vật có 8 chiếc chân để chạy thật nhanh.",
    answer: "Sai",
    explain: "Mèo chỉ có 4 chân thôi em nhé. AI đôi khi vẽ mèo thừa chân đấy!",
  },
  {
    text: "Cầu vồng thường xuất hiện sau cơn mưa và có 7 sắc màu.",
    answer: "Đúng",
    explain:
      "Chính xác! Đây là hiện tượng tự nhiên do ánh sáng mặt trời chiếu qua giọt nước.",
  },
  {
    text: "Con người đã xây dựng thành phố và sinh sống trên Sao Hỏa từ năm 1969.",
    answer: "Sai",
    explain:
      "Năm 1969 con người mới đặt chân lên Mặt Trăng. Hiện tại chúng ta chưa thể sống trên Sao Hỏa.",
  },
  {
    text: "Tất cả các loại nước dạng lỏng trên Trái Đất đều ngọt và uống trực tiếp được.",
    answer: "Sai",
    explain:
      "Nước biển rất mặn, nước sông hồ tự nhiên có thể chứa vi khuẩn bẩn, cần được lọc sạch mới uống được.",
  },
  {
    text: "Nước biển có màu xanh dương vì có ai đó đổ mực xanh vào.",
    answer: "Sai",
    explain:
      "Màu xanh là do ánh sáng mặt trời phản chiếu và bị hấp thụ đặc biệt qua các tầng nước biển.",
  },
];
