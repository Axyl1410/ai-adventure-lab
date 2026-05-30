import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Cpu, Check, HelpCircle } from "lucide-react";
import { GameShell } from "../../components/GameShell";
import { HappyFeedback, TryAgainFeedback, ConfettiSuccess } from "../../components/Feedback";
import { TTSButton } from "../../components/TTSButton";
import { saveProgress, unlockSticker } from "../../lib/api";
import { useSession } from "../../hooks/useSession";
import robotLab from "../../assets/robot-lab.png";

interface Item {
  icon: string;
  label: string;
  group: string;
  hint?: string;
}

const easyItems: Item[] = [
  { icon: "🐱", label: "Mèo", group: "Động vật" },
  { icon: "🐶", label: "Chó", group: "Động vật" },
  { icon: "🍎", label: "Táo", group: "Trái cây" },
  { icon: "🍌", label: "Chuối", group: "Trái cây" },
  { icon: "🚗", label: "Xe", group: "Đồ chơi" },
  { icon: "⚽", label: "Bóng", group: "Đồ chơi" },
  { icon: "🦁", label: "Sư tử", group: "Động vật" },
  { icon: "🧸", label: "Gấu bông", group: "Đồ chơi" },
  { icon: "🐼", label: "Gấu trúc", group: "Động vật" },
  { icon: "🍓", label: "Dâu tây", group: "Trái cây" },
  { icon: "🚲", label: "Xe đạp nhỏ", group: "Đồ chơi" },
  { icon: "🍉", label: "Dưa hấu", group: "Trái cây" }
];

const hardItems: Item[] = [
  { icon: "🦇", label: "Con dơi", group: "Động vật", hint: "Biết bay như chim nhưng là loài thú đẻ con đấy!" },
  { icon: "🐬", label: "Cá heo", group: "Động vật", hint: "Sống dưới nước như cá nhưng thực chất là thú!" },
  { icon: "🍅", label: "Cà chua", group: "Trái cây", hint: "Rất hay bị nhầm là rau củ dùng để nấu canh." },
  { icon: "🥑", label: "Quả bơ", group: "Trái cây", hint: "Béo ngậy và ít ngọt nhưng vẫn là quả trái cây." },
  { icon: "📱", label: "Điện thoại", group: "Đồ chơi", hint: "Là thiết bị liên lạc nhưng bé hay mượn để chơi game." },
  { icon: "🦖", label: "Khủng long nhựa", group: "Đồ chơi", hint: "Hình dáng con vật nhưng làm từ nhựa để bé chơi!" },
  { icon: "🚁", label: "Máy bay điều khiển", group: "Đồ chơi", hint: "Có cánh quạt bay được nhưng chỉ là đồ chơi chạy pin." },
  { icon: "🍍", label: "Quả dứa", group: "Trái cây", hint: "Nhiều gai góc xù xì trông rất giống con nhím." },
  { icon: "🦉", label: "Chim cú mèo", group: "Động vật", hint: "Có tên gọi là 'cú mèo' nhưng thực ra là loài chim bay đêm." },
  { icon: "🦦", label: "Rái cá", group: "Động vật", hint: "Trông giống mèo nước nhưng bơi lội cực giỏi!" },
  { icon: "🍉", label: "Dưa đỏ", group: "Trái cây", hint: "Vỏ xanh ruột đỏ nhưng lại thuộc họ bầu bí dây leo!" },
  { icon: "🧩", label: "Mảnh Lego", group: "Đồ chơi", hint: "Nhìn như khối nhựa gạch xây dựng nhưng ghép thành đồ chơi!" }
];

const groupColors: Record<string, string> = {
  "Động vật": "bg-greenLab border-greenLab/40",
  "Trái cây": "bg-yellowLab border-yellowLab/40",
  "Đồ chơi": "bg-skyLab border-skyLab/40"
};

const groupEmojis: Record<string, string> = {
  "Động vật": "🐾",
  "Trái cây": "🍇",
  "Đồ chơi": "🧸"
};

export function TeachRobotGame() {
  const { session } = useSession();
  const [level, setLevel] = useState<"easy" | "hard" | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [trained, setTrained] = useState(false);
  const [training, setTraining] = useState(false);
  // FIX: useState phải ở top-level, không được đặt sau early return
  const [index, setIndex] = useState(0);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset index khi đổi level
  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setTrained(false);
    setTraining(false);
  }, [level]);

  const items = level === "easy" ? easyItems : hardItems;
  const correct = items.filter((item) => answers[item.label] === item.group).length;
  const weak = correct < 4;

  function train() {
    setTraining(true);
    // Simulate training delay for UX
    setTimeout(() => {
      if (!mountedRef.current) return;
      setTraining(false);
      setTrained(true);
      if (correct >= 5) {
        unlockSticker("robot");
      }
      if (session) void saveProgress(session.id, `teach-robot-${level}`, correct, items.length, { answers });
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
      <GameShell title="🤖 Dạy Robot Học" subtitle="Dạy robot học bằng ví dụ." instruction="Chọn cấp độ chơi phù hợp với em nhé!">
        <div className="lab-card mx-auto max-w-2xl p-6 md:p-8 text-center space-y-5 bg-white/80 shadow-md">
          <div className="w-full rounded-2xl overflow-hidden shadow-md max-h-36 sm:max-h-40 mb-2 flex items-center justify-center bg-greenLab/15">
            <img src={robotLab} alt="Dạy Robot Học Banner" className="w-full h-full object-cover max-h-48" />
          </div>
          <h2 className="text-3xl font-black text-ink">Dạy Robot Học Máy</h2>
          <p className="font-bold text-muted text-lg">Robot cần em gán nhãn đúng để học tốt hơn. Em muốn dạy ở cấp độ nào?</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.button
              className="big-button bg-gradient-to-br from-greenLab to-mintLab text-ink text-lg py-4"
              onClick={() => setLevel("easy")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-2xl mr-2">🌱</span> Gán nhãn cơ bản
              <span className="block text-xs font-semibold text-ink/60 mt-1">Độ khó: Dễ (Nhiều nhãn rõ ràng)</span>
            </motion.button>
            <motion.button
              className="big-button bg-gradient-to-br from-purpleLab to-pinkLab text-white text-lg py-4"
              onClick={() => setLevel("hard")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-2xl mr-2">🔥</span> Dữ liệu nhiễu
              <span className="block text-xs font-semibold text-white/70 mt-1">Độ khó: Khó (Nhiều nhãn dễ nhầm)</span>
            </motion.button>
          </div>
        </div>
      </GameShell>
    );
  }

  const current = items[index];

  return (
    <GameShell
      title={`🤖 Dạy Robot — ${level === "easy" ? "Cơ bản" : "Thử thách"}`}
      subtitle="Dạy robot học bằng ví dụ."
      instruction="Hãy giúp robot gán nhãn cho từng vật thể bên dưới. Nhớ đọc kỹ gợi ý nhé!"
      score={correct}
      maxScore={items.length}
    >
      <section className="grid flex-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* Left Side: Single Compact Card Wizard */}
        <div className="lab-card flex flex-col justify-between rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm sm:p-5">
          {/* Header & Status */}
          <div className="flex items-center justify-between text-sm font-black text-muted mb-4 border-b border-white/40 pb-3">
            <span>📋 Vật thể {index + 1} / {items.length}</span>
            <span className="text-ink bg-skyLab/15 border border-skyLab/30 px-3 py-1 rounded-2xl text-xs font-black">
              🎯 Đã gán nhãn: {Object.keys(answers).length} / {items.length}
            </span>
          </div>

          {/* Current Object Card */}
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col items-center justify-center py-2 min-h-0 overflow-y-auto"
              >
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white shadow-md text-6xl mb-4 select-none">
                  {current.icon}
                </div>
                
                <div className="mb-4 flex items-center justify-center gap-3">
                  <h2 className="text-3xl font-black text-ink">{current.label}</h2>
                  <TTSButton text={current.label + (current.hint ? ". Gợi ý: " + current.hint : "")} compact autoPlay />
                </div>

                {"hint" in current && (
                  <p className="text-xs font-bold text-amber-600 mt-1 italic bg-amber-50/50 border border-amber-200/50 px-4 py-2.5 rounded-2xl max-w-md text-center leading-relaxed">
                    💡 {current.hint}
                  </p>
                )}

                {/* Category choice buttons */}
                <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
                  {["Động vật", "Trái cây", "Đồ chơi"].map((group) => {
                    const isSelected = answers[current.label] === group;
                    return (
                      <button
                        key={group}
                        className={`big-button flex min-h-16 flex-row items-center justify-center gap-2 border py-3.5 text-sm font-semibold transition-all duration-300 sm:flex-col sm:gap-1.5 ${
                          isSelected
                            ? `${groupColors[group]} text-ink font-black shadow-md scale-[1.03]`
                            : "bg-white border-white/40 text-ink hover:bg-white/90 hover:border-skyLab/20"
                        }`}
                        onClick={() => {
                          setAnswers({ ...answers, [current.label]: group });
                          // Automatically slide to the next card after a short delay for smooth flow
                          if (index < items.length - 1) {
                            setTimeout(() => {
                              setIndex((v) => v + 1);
                            }, 500);
                          }
                        }}
                      >
                        <span className="text-3xl select-none">{groupEmojis[group]}</span>
                        <span>{group}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation & Progress Dots */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/40 pt-4">
            <button
              className="big-button text-xs bg-white border border-white/60 hover:bg-gray-50 py-2 px-4 disabled:opacity-40 font-bold"
              onClick={() => setIndex((v) => Math.max(v - 1, 0))}
              disabled={index === 0}
            >
              ⬅️ Trước đó
            </button>
            <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setIndex(idx)}
                  className={`min-h-6 rounded-full transition-all ${
                    idx === index 
                      ? "bg-skyLab w-8 h-2" 
                      : !!answers[items[idx].label] 
                        ? "bg-greenLab/70 w-6 h-2" 
                        : "bg-white border border-white/50 w-6 h-2"
                  }`}
                  aria-label={`Go to item ${idx + 1}`}
                />
              ))}
            </div>
            <button
              className="big-button text-xs bg-white border border-white/60 hover:bg-gray-50 py-2 px-4 disabled:opacity-40 font-bold"
              onClick={() => setIndex((v) => Math.min(v + 1, items.length - 1))}
              disabled={index === items.length - 1}
            >
              Kế tiếp ➡️
            </button>
          </div>
        </div>

        {/* Right Side: Robot Training Dashboard */}
        <aside className="lab-card p-5 flex flex-col justify-between h-full min-h-0 bg-white/85 border-white/70 shadow-sm rounded-3xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-skyLab to-blueLab text-white shadow-md">
                <Bot className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-black text-ink tracking-tight">Máy học mini</h2>
                <p className="text-xs font-bold text-muted">3 bước đơn giản</p>
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-2xl bg-cream/60 border border-yellowLab/20 p-4 space-y-2 text-xs">
              <p className="font-bold text-ink flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-skyLab text-white font-black text-[10px]">1</span>
                Gán nhãn cho từng vật thể ở bên trái
              </p>
              <p className="font-bold text-ink flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-purpleLab text-white font-black text-[10px]">2</span>
                Nhấn "Huấn luyện Robot" để robot học
              </p>
              <p className="font-bold text-ink flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-greenLab text-white font-black text-[10px]">3</span>
                Xem robot dự đoán ví dụ mới!
              </p>
            </div>

            <button
              className="big-button w-full bg-gradient-to-r from-ink to-ink/90 text-white flex items-center justify-center gap-2 shadow-md text-base py-3 disabled:opacity-60"
              onClick={train}
              disabled={training || trained}
            >
              <Cpu className="h-5 w-5" />
              {training ? "⏳ Đang huấn luyện..." : trained ? "✅ Đã huấn luyện" : "🚀 Huấn luyện Robot"}
            </button>

            {/* Training progress bar */}
            {training && (
              <div className="space-y-2">
                <p className="text-xs font-black text-muted text-center animate-pulse">Robot đang học từ ví dụ của em...</p>
                <div className="h-2.5 rounded-full bg-white/60 border border-white/40 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}
          </div>

          {trained && (
            <div className="mt-4 space-y-3 border-t border-white/60 pt-3 relative flex-1 min-h-0 overflow-y-auto pr-1">
              <ConfettiSuccess />
              {weak ? (
                <TryAgainFeedback text="Ví dụ còn ít hoặc nhãn chưa đúng, robot có thể nhầm lẫn." />
              ) : (
                <HappyFeedback text="Tuyệt vời! Robot đã học rất tốt từ các ví dụ có nhãn của em!" />
              )}

              <div className="space-y-1 bg-skyLab/15 border border-skyLab/20 rounded-2xl p-3 shadow-xs">
                <p className="text-[10px] font-black text-sky-800 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" /> Robot tự đoán thử:
                </p>
                <p className="font-bold text-ink text-xs leading-relaxed">
                  {level === "easy"
                    ? "🐰 Với các ví dụ đã học, robot đoán hình mới: thỏ có tỷ lệ là Động vật rất cao!"
                    : "🍉 Với dữ liệu phức tạp, robot dự đoán: dưa hấu có thể là Trái cây!"}
                </p>
              </div>

              <button className="big-button w-full bg-cream border border-yellowLab/40 text-ink py-2 text-xs font-bold" onClick={resetLevel}>
                🔄 Thay đổi cấp độ chơi
              </button>
            </div>
          )}
        </aside>
      </section>
    </GameShell>
  );
}
