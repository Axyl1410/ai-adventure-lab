import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BrainCircuit,
  Camera,
  Database,
  ImageIcon,
  MessageCircle,
  Search,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import detectiveBanner from "../../assets/detective-banner.png";
import buddyReading from "../../assets/mascot/buddy-bot-reading.png";
import oopsBanner from "../../assets/oops-banner.png";
import robotLab from "../../assets/robot-lab.png";
import stickerArtist from "../../assets/stickers/sticker-artist.png";
import stickerDetective from "../../assets/stickers/sticker-detective.png";
import stickerOops from "../../assets/stickers/sticker-oops.png";
import stickerPrompt from "../../assets/stickers/sticker-prompt.png";
import stickerRobot from "../../assets/stickers/sticker-robot.png";

export type StickerConfig = {
  id: string;
  name: string;
  image: string;
  hint: string;
};

export type GameCardConfig = {
  title: string;
  desc: string;
  badge: string;
  time: string;
  to: string;
  image: string;
  alt: string;
  icon: LucideIcon;
  color: string;
  imageTone: string;
};

/** Keep ids in sync with unlockSticker() calls in games. */
export const STICKERS: StickerConfig[] = [
  {
    id: "detective",
    name: "Thám tử nhí",
    image: stickerDetective,
    hint: "Đạt >= 4 điểm trong game Thám tử AI",
  },
  {
    id: "robot",
    name: "Kỹ sư máy học",
    image: stickerRobot,
    hint: "Đạt >= 5 điểm trong Dạy Robot Học hoặc hoàn thành Huấn Luyện AI Mini",
  },
  {
    id: "oops",
    name: "Thám tử phản biện",
    image: stickerOops,
    hint: "Đạt >= 3 điểm trong game AI Có Thể Sai",
  },
  {
    id: "prompt",
    name: "Pháp sư Prompt",
    image: stickerPrompt,
    hint: "Đạt >= 80 điểm trong game Phép thuật câu lệnh",
  },
  {
    id: "artist",
    name: "Họa sĩ AI",
    image: stickerArtist,
    hint: "Tạo thành công tranh trong Xưởng Tranh AI",
  },
];

export const gameCards: GameCardConfig[] = [
  {
    title: "Thám Tử AI",
    desc: "Đoán xem hoạt động nào có sử dụng trí tuệ nhân tạo.",
    badge: "Dễ",
    time: "3 phút",
    to: "/games/ai-detective",
    image: detectiveBanner,
    alt: "Buddy Bot trong vai thám tử AI",
    icon: Search,
    color: "from-skyLab to-blueLab",
    imageTone: "bg-skyLab/15",
  },
  {
    title: "Dạy Robot Học",
    desc: "Gán nhãn ví dụ để robot học cách phân biệt đồ vật.",
    badge: "Dễ",
    time: "5 phút",
    to: "/games/teach-the-robot",
    image: stickerRobot,
    alt: "Robot học từ các ví dụ",
    icon: BrainCircuit,
    color: "from-greenLab to-mintLab",
    imageTone: "bg-greenLab/15",
  },
  {
    title: "Huấn Luyện AI Mini",
    desc: "Thử model Teachable Machine với camera trong trình duyệt.",
    badge: "Khám phá",
    time: "6 phút",
    to: "/games/teachable-machine",
    image: robotLab,
    alt: "Phòng lab robot cho Teachable Machine",
    icon: Camera,
    color: "from-purpleLab to-pinkLab",
    imageTone: "bg-purpleLab/15",
  },
  {
    title: "Phép Thuật Câu Lệnh",
    desc: "Ghép các khối hướng dẫn để tạo prompt rõ ràng.",
    badge: "Vừa",
    time: "4 phút",
    to: "/games/prompt-magic",
    image: stickerPrompt,
    alt: "Buddy Bot cầm cây đũa prompt",
    icon: Wand2,
    color: "from-yellowLab to-orangeLab",
    imageTone: "bg-yellowLab/20",
  },
  {
    title: "AI Có Thể Sai",
    desc: "Tìm lỗi sai và học cách kiểm tra lại thông tin.",
    badge: "Dễ",
    time: "3 phút",
    to: "/games/oops-ai-mistake",
    image: oopsBanner,
    alt: "Một tình huống AI trả lời sai cần kiểm tra",
    icon: BadgeCheck,
    color: "from-redSoft to-orangeLab",
    imageTone: "bg-redSoft/15",
  },
  {
    title: "Buddy Bot Trò Chuyện",
    desc: "Hỏi đáp cùng robot học tập bằng tiếng Việt an toàn.",
    badge: "Khám phá",
    time: "Tự chọn",
    to: "/games/buddy-bot",
    image: buddyReading,
    alt: "Buddy Bot đang đọc sách",
    icon: MessageCircle,
    color: "from-blueLab to-purpleLab",
    imageTone: "bg-blueLab/15",
  },
  {
    title: "Xưởng Tranh AI",
    desc: "Chọn chủ đề, phong cách và tạo tranh AI an toàn.",
    badge: "Khám phá",
    time: "5 phút",
    to: "/games/image-studio",
    image: stickerArtist,
    alt: "Buddy Bot họa sĩ tạo tranh AI",
    icon: ImageIcon,
    color: "from-pinkLab to-yellowLab",
    imageTone: "bg-pinkLab/15",
  },
  {
    title: "Xếp Loại Dữ Liệu",
    desc: "Phân loại dữ liệu tốt, dữ liệu nhiễu và thông tin riêng tư.",
    badge: "Vừa",
    time: "4 phút",
    to: "/games/data-sorter",
    image: stickerRobot,
    alt: "Robot phân loại dữ liệu để học AI",
    icon: Database,
    color: "from-greenLab to-skyLab",
    imageTone: "bg-greenLab/15",
  },
  {
    title: "Nhiệm Vụ An Toàn AI",
    desc: "Chọn hành động an toàn khi trò chuyện và tạo nội dung với AI.",
    badge: "Dễ",
    time: "4 phút",
    to: "/games/ai-safety-quest",
    image: oopsBanner,
    alt: "Nhiệm vụ an toàn khi dùng AI",
    icon: ShieldCheck,
    color: "from-mintLab to-greenLab",
    imageTone: "bg-greenLab/15",
  },
];

export const quickStats = [
  { label: "Trò chơi", value: "9", tone: "bg-skyLab/15 text-sky-700" },
  { label: "Sticker", value: "5", tone: "bg-yellowLab/25 text-orange-700" },
  {
    label: "Không cần tài khoản",
    value: "✓",
    tone: "bg-greenLab/20 text-green-700",
  },
] as const;
