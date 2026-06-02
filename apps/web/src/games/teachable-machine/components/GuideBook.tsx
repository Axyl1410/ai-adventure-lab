import { BookOpen } from "lucide-react";
import { TTSButton } from "../../../components/TTSButton";
import { GUIDE_TTS_TEXT } from "../constants";
import { GuideStep } from "./GuideStep";

export function GuideBook() {
  return (
    <div className="min-h-0 space-y-2.5 overflow-y-auto pr-1">
      <div className="flex flex-shrink-0 items-center justify-between border-gray-100 border-b pb-1.5">
        <h3 className="flex items-center gap-1 font-black text-muted text-xs uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5 text-skyLab" /> Cẩm nang 4 bước siêu
          dễ
        </h3>
        <TTSButton compact={true} text={GUIDE_TTS_TEXT} />
      </div>

      <div className="space-y-2">
        <GuideStep
          color="bg-skyLab"
          desc="Em bấm trực tiếp vào ô chữ của mỗi nhóm để tự đặt tên nhé! Ví dụ: 'Mặt cười 😊', 'Bút chì ✏️', 'Điện thoại 📱'."
          emoji="🏷️"
          step={1}
          title="Đặt tên cho 3 nhóm"
        />
        <GuideStep
          color="bg-purpleLab"
          desc="Bấm 'Bật Camera'. Ưu tiên dùng bút, sách, đồ chơi hoặc thẻ màu; tránh chụp mặt thật của em nhé!"
          emoji="📸"
          step={2}
          title="Bật camera & Chụp ảnh"
        />
        <GuideStep
          color="bg-greenLab"
          desc="Khi đã chụp ảnh cho ít nhất 2 nhóm khác nhau, hãy bấm nút đen 'Huấn luyện AI của em' ở dưới để robot bắt đầu học."
          emoji="🧠"
          step={3}
          title="Huấn luyện AI của em"
        />
        <GuideStep
          color="bg-pinkLab"
          desc="Học xong, em chỉ cần di chuyển trước camera, thanh độ tin cậy tương ứng sẽ tự động tăng giảm để hiển thị kết quả đoán!"
          emoji="🔮"
          step={4}
          title="Trải nghiệm robot dự đoán"
        />
      </div>
    </div>
  );
}
