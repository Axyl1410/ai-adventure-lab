import type { Level, OopsQuestion } from "./types";

export const easyQuestions: OopsQuestion[] = [
  {
    text: "Con cá sống ở trên cây.",
    answer: "Sai",
    explain: "Cá chỉ sống dưới nước và thở bằng mang thôi em nhé.",
  },
  {
    text: "Mặt trời luôn mọc ở hướng Đông.",
    answer: "Đúng",
    explain: "Chính xác, mặt trời luôn mọc hướng Đông và lặn hướng Tây.",
  },
  {
    text: "Chó có cánh và biết bay.",
    answer: "Sai",
    explain: "Chó chỉ đi bằng 4 chân và không có cánh để bay.",
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
    text: "Bánh mì được trồng từ ruộng lúa giống như cây lúa mì.",
    answer: "Sai",
    explain:
      "Bánh mì phải do con người nhào bột từ lúa mì rồi nướng lên, không phải tự mọc từ ruộng lúa đâu!",
  },
  {
    text: "Nước sôi ở nhiệt độ 10 độ C.",
    answer: "Sai",
    explain: "Nước sôi ở 100 độ C. 10 độ C là nước rất lạnh đấy!",
  },
  {
    text: "Quả táo có thể có màu đỏ, xanh lá cây hoặc vàng.",
    answer: "Đúng",
    explain: "Đúng rồi! Táo tự nhiên có các màu này và ăn rất ngon.",
  },
  {
    text: "Con gà đẻ trứng ra những chú cá con dễ thương.",
    answer: "Sai",
    explain: "Gà đẻ ra trứng và nở ra gà con, không thể nở ra cá con được.",
  },
];

export const hardQuestions: OopsQuestion[] = [
  {
    text: "Tất cả loài chim đều biết bay.",
    answer: "Cần kiểm tra thêm",
    explain: "Không phải tất cả đâu. Chim cánh cụt, đà điểu không biết bay.",
  },
  {
    text: "AI luôn luôn trả lời đúng 100%.",
    answer: "Sai",
    explain:
      "AI có thể nhầm hoặc bị ảo tưởng (nói bừa). Em cần kiểm tra lại với sách hoặc thầy cô.",
  },
  {
    text: "Mọi bức ảnh chụp đều là ảnh thật.",
    answer: "Cần kiểm tra thêm",
    explain:
      "Hiện nay AI có thể vẽ ảnh trông cực kỳ giống thật nhưng lại là ảnh giả.",
  },
  {
    text: "Một robot có cảm xúc vui buồn như người.",
    answer: "Sai",
    explain:
      "Robot chỉ bắt chước biểu cảm lập trình, chúng không có trái tim và cảm xúc thật.",
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
  {
    text: "AI vẽ ra bức ảnh một bàn tay người có 6 ngón tay trông rất tự nhiên.",
    answer: "Đúng",
    explain:
      "Đúng. AI vẽ ảnh (Generative AI) đôi lúc bị lỗi vẽ thừa ngón tay do nó không hiểu cấu trúc sinh học thật sự của con người.",
  },
  {
    text: "Tin tức trên mạng nói rằng khủng long bạo chúa T-rex vẫn đang sống trong rừng Amazon.",
    answer: "Sai",
    explain:
      "Khủng long đã tuyệt chủng từ hàng triệu năm trước. Đây chắc chắn là tin giả (Fake news) hoặc tin do AI viết bừa!",
  },
  {
    text: "Một bức ảnh chụp phi hành gia đang cưỡi ngựa trên Sao Hỏa chụp năm ngoái.",
    answer: "Cần kiểm tra thêm",
    explain:
      "Bức ảnh trông rất thật nhưng hiện tại chưa có ai cưỡi ngựa trên Sao Hỏa cả. Đây có thể là tranh ghép hoặc ảnh do AI tạo ra!",
  },
  {
    text: "AI tự sáng tạo ra một bài thuốc chữa bách bệnh mà không cần bác sĩ kiểm tra.",
    answer: "Sai",
    explain:
      "Rất nguy hiểm! AI chỉ gợi ý từ dữ liệu cũ, không thể tự chế thuốc. Em luôn cần bác sĩ và kiểm tra thông tin y tế nhé!",
  },
];

export function getQuestionBank(level: Level): OopsQuestion[] {
  return level === "easy" ? easyQuestions : hardQuestions;
}
