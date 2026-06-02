import { AnimatePresence, motion } from "framer-motion";
import { Bot, Cpu, HelpCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import robotLab from "../../assets/robot-lab.png";
import {
  ConfettiSuccess,
  HappyFeedback,
  TryAgainFeedback,
} from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { TTSButton } from "../../components/TTSButton";
import { useSession } from "../../hooks/useSession";
import { saveProgress, unlockSticker } from "../../lib/api";

interface Item {
  group: string;
  hint?: string;
  icon: string;
  label: string;
}

const easyItems: Item[] = [
  { icon: "🐱", label: "Mèo", group: "Động vật" },
  { icon: "🐶", label: "Chó", group: "Động vật" },
  { icon: "🍎", label: "Táo", group: "Trái cây" },
  { icon: "🍌", label: "Chuối", group: "Trái cây" },
  { icon: "🚗", label: "Xe đồ chơi", group: "Đồ chơi" },
  { icon: "⚽", label: "Bóng", group: "Đồ chơi" },
  { icon: "🦁", label: "Sư tử", group: "Động vật" },
  { icon: "🧸", label: "Gấu bông", group: "Đồ chơi" },
  { icon: "🐼", label: "Gấu trúc", group: "Động vật" },
  { icon: "🍓", label: "Dâu tây", group: "Trái cây" },
  { icon: "🚲", label: "Xe đạp đồ chơi", group: "Đồ chơi" },
  { icon: "🍉", label: "Dưa hấu", group: "Trái cây" },
];

const hardItems: Item[] = [
  {
    icon: "🦇",
    label: "Con dơi",
    group: "Động vật",
    hint: "Biết bay như chim nhưng là loài thú đẻ con đấy!",
  },
  {
    icon: "🐬",
    label: "Cá heo",
    group: "Động vật",
    hint: "Sống dưới nước như cá nhưng thực chất là thú!",
  },
  {
    icon: "🍅",
    label: "Cà chua",
    group: "Trái cây",
    hint: "Rất hay bị nhầm là rau củ dùng để nấu canh.",
  },
  {
    icon: "🥑",
    label: "Quả bơ",
    group: "Trái cây",
    hint: "Béo ngậy và ít ngọt nhưng vẫn là quả trái cây.",
  },
  {
    icon: "📱",
    label: "Điện thoại",
    group: "Đồ chơi",
    hint: "Là thiết bị liên lạc nhưng bé hay mượn để chơi game.",
  },
  {
    icon: "🦖",
    label: "Khủng long nhựa",
    group: "Đồ chơi",
    hint: "Hình dáng con vật nhưng làm từ nhựa để bé chơi!",
  },
  {
    icon: "🚁",
    label: "Máy bay điều khiển",
    group: "Đồ chơi",
    hint: "Có cánh quạt bay được nhưng chỉ là đồ chơi chạy pin.",
  },
  {
    icon: "🍍",
    label: "Quả dứa",
    group: "Trái cây",
    hint: "Nhiều gai góc xù xì trông rất giống con nhím.",
  },
  {
    icon: "🦉",
    label: "Chim cú mèo",
    group: "Động vật",
    hint: "Có tên gọi là 'cú mèo' nhưng thực ra là loài chim bay đêm.",
  },
  {
    icon: "🦦",
    label: "Rái cá",
    group: "Động vật",
    hint: "Trông giống mèo nước nhưng bơi lội cực giỏi!",
  },
  {
    icon: "🍉",
    label: "Dưa đỏ",
    group: "Trái cây",
    hint: "Vỏ xanh ruột đỏ nhưng lại thuộc họ bầu bí dây leo!",
  },
  {
    icon: "🧩",
    label: "Mảnh Lego",
    group: "Đồ chơi",
    hint: "Nhìn như khối nhựa gạch xây dựng nhưng ghép thành đồ chơi!",
  },
];

const groupColors: Record<string, string> = {
  "Động vật": "bg-greenLab border-greenLab/40",
  "Trái cây": "bg-yellowLab border-yellowLab/40",
  "Đồ chơi": "bg-skyLab border-skyLab/40",
};

const groupEmojis: Record<string, string> = {
  "Động vật": "🐾",
  "Trái cây": "🍇",
  "Đồ chơi": "🧸",
};

export function TeachRobotGame() {
  const { session } = useSession();
  const [level, setLevel] = useState<"easy" | "hard" | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [trained, setTrained] = useState(false);
  const [training, setTraining] = useState(false);
  // FIX: useState must stay at top level, not after early return
  const [index, setIndex] = useState(0);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset index when the level changes
  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setTrained(false);
    setTraining(false);
  }, []);

  const items = level === "easy" ? easyItems : hardItems;
  const correct = items.filter(
    (item) => answers[item.label] === item.group
  ).length;
  const weak = correct < 4;

  function train() {
    setTraining(true);
    // Simulate training delay for UX
    setTimeout(() => {
      if (!mountedRef.current) {
        return;
      }
      setTraining(false);
      setTrained(true);
      if (correct >= 5) {
        unlockSticker("robot");
      }
      if (session) {
        void saveProgress(
          session.id,
          `teach-robot-${level}`,
          correct,
          items.length,
          { answers }
        );
      }
    }, 2200);
  }

  function resetLevel() {
    setLevel(null);
    setAnswers({});
    setTrained(false);
    setTraining(false);
    setIndex(0);
  }

  if (!level) {
    return (
      <GameShell
        instruction="Chọn cấp độ chơi phù hợp với em nhé!"
        subtitle="Dạy robot học bằng ví dụ."
        title="🤖 Dạy Robot Học"
      >
        <div className="lab-card mx-auto max-w-2xl space-y-5 bg-white/80 p-6 text-center shadow-md md:p-8">
          <div className="mb-2 flex max-h-36 w-full items-center justify-center overflow-hidden rounded-2xl bg-greenLab/15 shadow-md sm:max-h-40">
            <img
              alt="Dạy Robot Học Banner"
              className="h-full max-h-48 w-full object-cover"
              src={robotLab}
            />
          </div>
          <h2 className="font-black text-3xl text-ink">Dạy Robot Học Máy</h2>
          <p className="font-bold text-lg text-muted">
            Robot cần em gán nhãn đúng để học tốt hơn. Em muốn dạy ở cấp độ nào?
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.button
              className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg"
              onClick={() => setLevel("easy")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mr-2 text-2xl">🌱</span> Gán nhãn cơ bản
              <span className="mt-1 block font-semibold text-ink/60 text-xs">
                Độ khó: Dễ (Nhiều nhãn rõ ràng)
              </span>
            </motion.button>
            <motion.button
              className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white"
              onClick={() => setLevel("hard")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mr-2 text-2xl">🔥</span> Dữ liệu nhiễu
              <span className="mt-1 block font-semibold text-white/70 text-xs">
                Độ khó: Khó (Nhiều nhãn dễ nhầm)
              </span>
            </motion.button>
          </div>
        </div>
      </GameShell>
    );
  }

  const current = items[index];

  return (
    <GameShell
      instruction="Hãy giúp robot gán nhãn cho từng vật thể bên dưới. Nhớ đọc kỹ gợi ý nhé!"
      maxScore={items.length}
      score={correct}
      subtitle="Dạy robot học bằng ví dụ."
      title={`🤖 Dạy Robot — ${level === "easy" ? "Cơ bản" : "Thử thách"}`}
    >
      <section className="grid flex-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* Left Side: Single Compact Card Wizard */}
        <div className="lab-card flex flex-col justify-between rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm sm:p-5">
          {/* Header & Status */}
          <div className="mb-4 flex items-center justify-between border-white/40 border-b pb-3 font-black text-muted text-sm">
            <span>
              📋 Vật thể {index + 1} / {items.length}
            </span>
            <span className="rounded-2xl border border-skyLab/30 bg-skyLab/15 px-3 py-1 font-black text-ink text-xs">
              🎯 Đã gán nhãn: {Object.keys(answers).length} / {items.length}
            </span>
          </div>

          {/* Current Object Card */}
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto py-2"
                exit={{ opacity: 0, x: -30 }}
                initial={{ opacity: 0, x: 30 }}
                key={index}
                transition={{ duration: 0.25 }}
              >
                <div className="mx-auto mb-4 grid h-24 w-24 select-none place-items-center rounded-full bg-white text-6xl shadow-md">
                  {current.icon}
                </div>

                <div className="mb-4 flex items-center justify-center gap-3">
                  <h2 className="font-black text-3xl text-ink">
                    {current.label}
                  </h2>
                  <TTSButton
                    autoPlay={true}
                    autoPlayRole="content"
                    compact={true}
                    text={
                      current.label +
                      (current.hint ? `. Gợi ý: ${current.hint}` : "")
                    }
                  />
                </div>

                {"hint" in current && (
                  <p className="mt-1 max-w-md rounded-2xl border border-amber-200/50 bg-amber-50/50 px-4 py-2.5 text-center font-bold text-amber-600 text-xs italic leading-relaxed">
                    💡 {current.hint}
                  </p>
                )}

                {/* Category choice buttons */}
                <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
                  {["Động vật", "Trái cây", "Đồ chơi"].map((group) => {
                    const isSelected = answers[current.label] === group;
                    return (
                      <button
                        className={`big-button flex min-h-16 flex-row items-center justify-center gap-2 border py-3.5 font-semibold text-sm transition-all duration-300 sm:flex-col sm:gap-1.5 ${
                          isSelected
                            ? `${groupColors[group]} scale-[1.03] font-black text-ink shadow-md`
                            : "border-white/40 bg-white text-ink hover:border-skyLab/20 hover:bg-white/90"
                        }`}
                        key={group}
                        onClick={() => {
                          setAnswers({ ...answers, [current.label]: group });
                          // Automatically slide to the next card after a short delay for smooth flow
                          if (index < items.length - 1) {
                            setTimeout(() => {
                              setIndex((v) => v + 1);
                            }, 500);
                          }
                        }}
                        type="button"
                      >
                        <span className="select-none text-3xl">
                          {groupEmojis[group]}
                        </span>
                        <span>{group}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation & Progress Dots */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-white/40 border-t pt-4">
            <button
              className="big-button border border-white/60 bg-white px-4 py-2 font-bold text-xs hover:bg-gray-50 disabled:opacity-40"
              disabled={index === 0}
              onClick={() => setIndex((v) => Math.max(v - 1, 0))}
              type="button"
            >
              ⬅️ Trước đó
            </button>
            <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
              {items.map((_, idx) => (
                <button
                  aria-label={`Go to item ${idx + 1}`}
                  className={`min-h-6 rounded-full transition-all ${
                    idx === index
                      ? "h-2 w-8 bg-skyLab"
                      : answers[items[idx].label]
                        ? "h-2 w-6 bg-greenLab/70"
                        : "h-2 w-6 border border-white/50 bg-white"
                  }`}
                  key={idx}
                  onClick={() => setIndex(idx)}
                  type="button"
                />
              ))}
            </div>
            <button
              className="big-button border border-white/60 bg-white px-4 py-2 font-bold text-xs hover:bg-gray-50 disabled:opacity-40"
              disabled={index === items.length - 1}
              onClick={() => setIndex((v) => Math.min(v + 1, items.length - 1))}
              type="button"
            >
              Kế tiếp ➡️
            </button>
          </div>
        </div>

        {/* Right Side: Robot Training Dashboard */}
        <aside className="lab-card flex h-full min-h-0 flex-col justify-between rounded-3xl border-white/70 bg-white/85 p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-skyLab to-blueLab text-white shadow-md">
                <Bot className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-black text-ink text-xl tracking-tight">
                  Máy học mini
                </h2>
                <p className="font-bold text-muted text-xs">3 bước đơn giản</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2 rounded-2xl border border-yellowLab/20 bg-cream/60 p-4 text-xs">
              <p className="flex items-center gap-2 font-bold text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-skyLab font-black text-[10px] text-white">
                  1
                </span>
                Gán nhãn cho từng vật thể ở bên trái
              </p>
              <p className="flex items-center gap-2 font-bold text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-purpleLab font-black text-[10px] text-white">
                  2
                </span>
                Nhấn "Huấn luyện Robot" để robot học
              </p>
              <p className="flex items-center gap-2 font-bold text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-greenLab font-black text-[10px] text-white">
                  3
                </span>
                Xem robot dự đoán ví dụ mới!
              </p>
            </div>

            <button
              className="big-button flex w-full items-center justify-center gap-2 bg-gradient-to-r from-ink to-ink/90 py-3 text-base text-white shadow-md disabled:opacity-60"
              disabled={training || trained}
              onClick={train}
              type="button"
            >
              <Cpu className="h-5 w-5" />
              {training
                ? "⏳ Đang huấn luyện..."
                : trained
                  ? "✅ Đã huấn luyện"
                  : "🚀 Huấn luyện Robot"}
            </button>

            {/* Training progress bar */}
            {training && (
              <div className="space-y-2">
                <p className="animate-pulse text-center font-black text-muted text-xs">
                  Robot đang học từ ví dụ của em...
                </p>
                <div className="h-2.5 overflow-hidden rounded-full border border-white/40 bg-white/60">
                  <motion.div
                    animate={{ width: "100%" }}
                    className="h-full rounded-full bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab"
                    initial={{ width: "0%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}
          </div>

          {trained && (
            <div className="relative mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto border-white/60 border-t pt-3 pr-1">
              <ConfettiSuccess />
              {weak ? (
                <TryAgainFeedback text="Ví dụ còn ít hoặc nhãn chưa đúng, robot có thể nhầm lẫn." />
              ) : (
                <HappyFeedback text="Tuyệt vời! Robot đã học rất tốt từ các ví dụ có nhãn của em!" />
              )}

              <div className="space-y-1 rounded-2xl border border-skyLab/20 bg-skyLab/15 p-3 shadow-xs">
                <p className="flex items-center gap-1 font-black text-[10px] text-sky-800 uppercase tracking-wider">
                  <HelpCircle className="h-3.5 w-3.5" /> Robot tự đoán thử:
                </p>
                <p className="font-bold text-ink text-xs leading-relaxed">
                  {level === "easy"
                    ? "🐰 Với các ví dụ đã học, robot đoán hình mới: thỏ có tỷ lệ là Động vật rất cao!"
                    : "🍉 Với dữ liệu phức tạp, robot dự đoán: dưa hấu có thể là Trái cây!"}
                </p>
              </div>

              <button
                className="big-button w-full border border-yellowLab/40 bg-cream py-2 font-bold text-ink text-xs"
                onClick={resetLevel}
                type="button"
              >
                🔄 Thay đổi cấp độ chơi
              </button>
            </div>
          )}
        </aside>
      </section>
    </GameShell>
  );
}
