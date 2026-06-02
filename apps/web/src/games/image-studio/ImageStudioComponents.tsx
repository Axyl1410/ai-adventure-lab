import { BookOpen, Check, Download, HelpCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TTSButton } from "../../components/TTSButton";

export const suggestedSubjects = [
  { label: "chú mèo đeo ba lô 🐱", value: "một chú mèo con đeo ba lô" },
  { label: "robot Buddy Bot 🤖", value: "chú robot Buddy Bot vui vẻ" },
  { label: "cá heo mỉm cười 🐬", value: "chú cá heo đang cười lớn" },
  { label: "phi thuyền vũ trụ 🚀", value: "chiếc phi thuyền vũ trụ bay lượn" },
  {
    label: "khủng long tinh nghịch 🦖",
    value: "chú khủng long con tinh nghịch",
  },
  { label: "gấu bông dễ thương 🧸", value: "chú gấu bông dễ thương" },
];

export const suggestedSettings = [
  { label: "lớp học cầu vồng 🏫", value: "trong lớp học cầu vồng" },
  { label: "vũ trụ đầy sao 🌌", value: "ngoài vũ trụ bao la đầy sao" },
  {
    label: "khu rừng phép thuật 🌲",
    value: "trong khu rừng phép thuật lấp lánh",
  },
  { label: "bãi biển ấm áp 🏖️", value: "trên bãi biển ngập nắng ấm áp" },
  {
    label: "đại dương sâu thẳm 🌊",
    value: "dưới đại dương sâu thẳm nhiều san hô",
  },
  {
    label: "công viên giải trí 🎡",
    value: "trong công viên giải trí nhộn nhịp",
  },
];

export const themes = [
  "Động vật dễ thương",
  "Robot trong lớp học",
  "Hành tinh và vũ trụ",
  "Khu rừng cầu vồng",
  "Đồ vật học tập",
  "Nhân vật truyện cổ tích không có bản quyền",
  "Biển và sinh vật biển",
  "Thành phố tương lai thân thiện",
];
export const styles = [
  "Tranh hoạt hình",
  "Tranh màu nước",
  "Sticker vui nhộn",
  "Poster lớp học",
  "Sách tranh thiếu nhi",
  "Pixel art đơn giản",
];

export function ImageThemePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Picker
      activeColor="bg-pinkLab text-white border-pinkLab/40 hover:bg-pinkLab/90"
      items={themes}
      onChange={onChange}
      title="🎨 Chọn chủ đề tranh"
      value={value}
    />
  );
}

export function ImageStylePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Picker
      activeColor="bg-purpleLab text-white border-purpleLab/40 hover:bg-purpleLab/90"
      items={styles}
      onChange={onChange}
      title="✨ Chọn phong cách vẽ"
      value={value}
    />
  );
}

function Picker({
  title,
  items,
  value,
  onChange,
  activeColor,
}: {
  title: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
  activeColor: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-1.5 font-black text-ink text-xl">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {items.map((item) => {
          const isSelected = value === item;
          return (
            <button
              className={`big-button flex items-center gap-1.5 border px-4 py-2.5 font-bold text-sm shadow-sm transition-all duration-300 hover:scale-102 ${
                isSelected
                  ? `${activeColor} shadow-md`
                  : "border-white/50 bg-white/80 text-ink hover:border-skyLab/40 hover:bg-white"
              }`}
              key={item}
              onClick={() => onChange(item)}
              type="button"
            >
              {isSelected && <Check className="h-4 w-4" />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ImageDetailBuilder({
  details,
  setDetails,
}: {
  details: ImageDetails;
  setDetails: (value: ImageDetails) => void;
}) {
  const colors = ["xanh da trời", "vàng", "hồng", "xanh lá", "tím", "cam"];
  const [customSubject, setCustomSubject] = useState(false);
  const [customSetting, setCustomSetting] = useState(false);

  return (
    <div className="grid gap-5 rounded-3xl border border-white/50 bg-white/40 p-4 shadow-inner">
      {/* Vẽ ai hoặc cái gì? */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="ml-1 font-black text-muted text-sm">
            Vẽ ai hoặc cái gì?
          </label>
          <button
            className="rounded-xl border border-purpleLab/20 bg-purpleLab/10 px-2.5 py-1 font-black text-purple-600 text-xs transition-all hover:bg-purpleLab/20 focus:outline-none"
            onClick={() => setCustomSubject(!customSubject)}
            type="button"
          >
            {customSubject ? "📋 Chọn nhanh" : "✏️ Em tự viết"}
          </button>
        </div>

        {customSubject ? (
          <input
            className="w-full rounded-2xl border-2 border-skyLab/20 bg-white px-4 py-3 font-semibold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) =>
              setDetails({ ...details, subject: e.target.value })
            }
            placeholder="Ví dụ: một chú mèo con đeo ba lô"
            value={details.subject}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestedSubjects.map((sub) => {
              const isSelected = details.subject === sub.value;
              return (
                <button
                  className={`rounded-2xl border px-3.5 py-2 font-bold text-xs transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "scale-102 border-purpleLab/55 bg-purpleLab font-black text-white shadow-sm"
                      : "border-white/50 bg-white/80 text-ink hover:border-purpleLab/35 hover:bg-white"
                  }`}
                  key={sub.value}
                  onClick={() => setDetails({ ...details, subject: sub.value })}
                  type="button"
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Ở đâu? (Bối cảnh) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="ml-1 font-black text-muted text-sm">
            Ở đâu? (Bối cảnh)
          </label>
          <button
            className="rounded-xl border border-purpleLab/20 bg-purpleLab/10 px-2.5 py-1 font-black text-purple-600 text-xs transition-all hover:bg-purpleLab/20 focus:outline-none"
            onClick={() => setCustomSetting(!customSetting)}
            type="button"
          >
            {customSetting ? "📋 Chọn nhanh" : "✏️ Em tự viết"}
          </button>
        </div>

        {customSetting ? (
          <input
            className="w-full rounded-2xl border-2 border-skyLab/20 bg-white px-4 py-3 font-semibold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) =>
              setDetails({ ...details, setting: e.target.value })
            }
            placeholder="Ví dụ: trong khu vườn hoa lấp lánh"
            value={details.setting}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestedSettings.map((set) => {
              const isSelected = details.setting === set.value;
              return (
                <button
                  className={`rounded-2xl border px-3.5 py-2 font-bold text-xs transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "scale-102 border-pinkLab/55 bg-pinkLab font-black text-white shadow-sm"
                      : "border-white/50 bg-white/80 text-ink hover:border-pinkLab/35 hover:bg-white"
                  }`}
                  key={set.value}
                  onClick={() => setDetails({ ...details, setting: set.value })}
                  type="button"
                >
                  {set.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="ml-1 font-black text-muted text-sm">
            Cảm xúc tranh
          </label>
          <select
            className="w-full rounded-2xl border-2 border-skyLab/20 px-4 py-3 font-bold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) => setDetails({ ...details, mood: e.target.value })}
            value={details.mood}
          >
            <option>vui vẻ</option>
            <option>tò mò</option>
            <option>ấm áp</option>
            <option>hào hứng</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="ml-1 font-black text-muted text-sm">
            Có chữ ngắn
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/60 bg-white p-3 font-bold text-ink transition-colors hover:bg-cream/40">
            <input
              checked={details.includeText}
              className="h-5 w-5 rounded-md border-skyLab text-purpleLab focus:ring-purpleLab"
              onChange={(e) =>
                setDetails({ ...details, includeText: e.target.checked })
              }
              type="checkbox"
            />
            <span>Thêm chữ ngắn</span>
          </label>
        </div>
      </div>

      <div className="mt-1 space-y-2">
        <label className="ml-1 font-black text-muted text-sm">
          🎨 Chọn các màu sắc chính:
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isSelected = details.colors.includes(color);
            return (
              <button
                className={`rounded-full border px-4 py-2 font-bold text-sm shadow-xs transition-all duration-300 ${
                  isSelected
                    ? "scale-105 border-yellowLab/50 bg-yellowLab text-ink"
                    : "border-white/40 bg-white text-muted hover:border-skyLab/30"
                }`}
                key={color}
                onClick={() =>
                  setDetails({
                    ...details,
                    colors: toggle(details.colors, color),
                  })
                }
                type="button"
              >
                {isSelected ? `✓ ${color}` : color}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ImagePromptPreview({ prompt }: { prompt: string }) {
  return (
    <div className="rounded-3xl border border-yellowLab/30 bg-cream/70 p-4 shadow-sm sm:p-5">
      <h2 className="mb-2 flex items-center gap-1.5 font-black text-base text-ink">
        <HelpCircle className="h-5 w-5 shrink-0 animate-bounce text-orangeLab" />{" "}
        Câu thần chú prompt gửi tới AI:
      </h2>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <p className="flex-1 break-words rounded-2xl border border-white/50 bg-white/70 p-3 font-semibold text-muted text-sm italic leading-relaxed">
          {prompt}
        </p>
        <TTSButton compact={true} text={prompt} />
      </div>
    </div>
  );
}

export function AiGeneratedLabel() {
  return (
    <span className="flex items-center gap-1 rounded-full border border-yellowLab/55 bg-yellowLab/35 px-3 py-1.5 font-black text-ink text-xs">
      ✨ Hình được tạo bởi AI
    </span>
  );
}

export function GeneratedImageCard({
  image,
  teacher,
  onDelete,
  compact,
}: {
  image: GeneratedImage;
  teacher?: boolean;
  onDelete?: () => void;
  compact?: boolean;
}) {
  const navigate = useNavigate();

  const handleStory = () => {
    navigate("/games/buddy-bot", {
      state: {
        storyPrompt: `Hãy kể một câu chuyện ngắn khoảng 4-6 câu thật vui vẻ, dễ thương và có bài học ý nghĩa về bức tranh này: ${image.promptUsed}`,
      },
    });
  };

  return (
    <article className="lab-card space-y-3 p-4 sm:p-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/30 shadow-md">
        <img
          alt="Tranh AI được tạo từ prompt"
          className={`w-full object-cover transition-transform duration-500 hover:scale-103 ${compact ? "max-h-52" : "aspect-square"}`}
          src={image.imageUrl}
        />
        <div className="absolute bottom-3 left-3">
          <AiGeneratedLabel />
        </div>
      </div>

      {!compact && (
        <div className="space-y-1.5">
          <p className="ml-1 font-black text-muted text-xs uppercase tracking-wider">
            Lệnh prompt đã dùng:
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <p className="flex-grow break-words rounded-2xl border border-yellowLab/20 bg-cream/60 p-3 font-bold text-ink text-sm leading-relaxed">
              {image.promptUsed}
            </p>
            <TTSButton compact={true} text={image.promptUsed} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <a
          className="big-button flex flex-1 items-center justify-center gap-1.5 bg-skyLab text-white hover:bg-skyLab/90"
          download={true}
          href={image.imageUrl}
        >
          <Download className="h-5 w-5" /> Tải xuống
        </a>
        <button
          className="big-button flex flex-1 items-center justify-center gap-1.5 bg-purpleLab text-white hover:bg-purpleLab/90"
          onClick={handleStory}
        >
          <BookOpen className="h-5 w-5" /> Kể chuyện
        </button>
        {teacher && (
          <button
            className="big-button flex items-center justify-center gap-1.5 border border-redSoft/30 bg-redSoft text-ink hover:bg-redSoft/80"
            onClick={onDelete}
          >
            <Trash2 className="h-5 w-5 text-red-600" /> Xóa
          </button>
        )}
      </div>
    </article>
  );
}

export function ImageGallery({ images }: { images: GeneratedImage[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {images.map((image) => (
        <GeneratedImageCard image={image} key={image.imageId} />
      ))}
    </div>
  );
}

export function TeacherImageReviewPanel() {
  return (
    <div className="rounded-3xl border border-yellowLab/25 bg-yellowLab/15 p-5 font-bold text-ink leading-relaxed shadow-sm">
      💡 Chế độ Giáo viên: Bạn có thể xem lại thư viện các bức tranh học sinh đã
      tạo, xóa các hình ảnh không phù hợp và thiết lập quy trình kiểm duyệt
      tranh trước khi hiển thị cho cả lớp.
    </div>
  );
}

export interface ImageDetails {
  colors: string[];
  includeText: boolean;
  mood: string;
  setting: string;
  subject: string;
}

export interface GeneratedImage {
  imageId: string;
  imageUrl: string;
  label: string;
  promptUsed: string;
}

function toggle(items: string[], value: string) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}
