import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Award } from "lucide-react";
import { GameShell } from "../../components/GameShell";
import { HappyFeedback, TryAgainFeedback, ConfettiSuccess } from "../../components/Feedback";
import { TTSButton } from "../../components/TTSButton";
import { saveProgress, unlockSticker } from "../../lib/api";
import { useSession } from "../../hooks/useSession";

type Category = "Dữ liệu tốt" | "Dữ liệu nhiễu" | "Thông tin riêng tư";

interface CardItem {
  emoji: string;
  text: string;
  category: Category;
  explain: string;
}

const items: CardItem[] = [
  { emoji: "🐱", text: "10 ảnh mèo rõ nét, đủ sáng.", category: "Dữ liệu tốt", explain: "Ảnh rõ và đúng nhãn giúp AI học tốt hơn." },
  { emoji: "🌫️", text: "Ảnh chó bị mờ, thiếu sáng.", category: "Dữ liệu nhiễu", explain: "Ảnh mờ làm AI khó nhận ra đặc điểm chính." },
  { emoji: "📞", text: "Số điện thoại của bạn trong lớp.", category: "Thông tin riêng tư", explain: "Số điện thoại là dữ liệu cá nhân, không đưa vào bài học AI." },
  { emoji: "🍎", text: "Nhiều ảnh táo đỏ, táo xanh và táo vàng.", category: "Dữ liệu tốt", explain: "Dữ liệu đa dạng giúp AI nhận biết tốt hơn." },
  { emoji: "🏷️", text: "Ảnh quả chuối nhưng bị gắn nhãn là quả cam.", category: "Dữ liệu nhiễu", explain: "Nhãn sai làm AI học sai." },
  { emoji: "🏠", text: "Địa chỉ nhà của học sinh.", category: "Thông tin riêng tư", explain: "Địa chỉ nhà cần được bảo vệ và không chia sẻ." },
  { emoji: "🤖", text: "Ảnh robot đồ chơi được chụp nhiều góc khác nhau.", category: "Dữ liệu tốt", explain: "Nhiều góc nhìn giúp AI học đặc điểm đầy đủ hơn." },
  { emoji: "❓", text: "Một ảnh không biết là mèo hay chó nhưng vẫn ép chọn nhãn.", category: "Dữ liệu nhiễu", explain: "Ví dụ không rõ ràng cần kiểm tra lại trước khi dùng." }
];

const categories: Category[] = ["Dữ liệu tốt", "Dữ liệu nhiễu", "Thông tin riêng tư"];

const categoryStyle: Record<Category, { emoji: string; className: string }> = {
  "Dữ liệu tốt": { emoji: "✅", className: "from-greenLab to-mintLab text-ink" },
  "Dữ liệu nhiễu": { emoji: "🧹", className: "from-yellowLab to-orangeLab text-ink" },
  "Thông tin riêng tư": { emoji: "🔒", className: "from-redSoft to-pinkLab text-ink" }
};

export function DataSorterGame() {
  const { session } = useSession();
  const [deck, setDeck] = useState<CardItem[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDeck([...items].sort(() => Math.random() - 0.5).slice(0, 6));
  }, []);

  const current = deck[index];

  function answer(category: Category) {
    if (!current || feedback) return;
    const correct = category === current.category;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(`${correct ? "Phân loại đúng!" : "Mình thử kiểm tra lại nhé."} ${current.explain}`);

    if (index === deck.length - 1) {
      setDone(true);
      if (nextScore >= 5) unlockSticker("robot");
      if (session) void saveProgress(session.id, "data-sorter", nextScore, deck.length);
    }
  }

  function next() {
    setFeedback("");
    setIndex((value) => Math.min(value + 1, deck.length - 1));
  }

  function restart() {
    setDeck([...items].sort(() => Math.random() - 0.5).slice(0, 6));
    setIndex(0);
    setScore(0);
    setFeedback("");
    setDone(false);
  }

  return (
    <GameShell
      title="🗂️ Data Sorter"
      subtitle="Phân loại dữ liệu để AI học an toàn."
      instruction="Đọc từng thẻ dữ liệu rồi chọn: dữ liệu tốt, dữ liệu nhiễu hoặc thông tin riêng tư."
      score={score}
      maxScore={deck.length || 6}
    >
      <section className="lab-card mx-auto max-w-4xl p-6 text-center bg-white/85 relative overflow-hidden">
        {done && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div key={index} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <p className="text-sm font-black text-muted mb-3">📋 Thẻ {index + 1} / {deck.length}</p>
              <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-skyLab/15 text-6xl shadow-sm">
                {current.emoji}
              </div>
              <div className="mb-7 flex items-center justify-center gap-3 rounded-3xl bg-cream/70 border border-yellowLab/20 p-5">
                <Database className="h-8 w-8 text-purpleLab" />
                <p className="text-2xl font-black text-ink leading-relaxed">{current.text}</p>
                <TTSButton text={current.text} compact autoPlay />
              </div>

              {!feedback ? (
                <div className="grid gap-3 md:grid-cols-3">
                  {categories.map((category) => {
                    const style = categoryStyle[category];
                    return (
                      <motion.button
                        key={category}
                        className={`big-button bg-gradient-to-r ${style.className} py-4 text-lg shadow-sm border border-white/40`}
                        onClick={() => answer(category)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="mr-2 text-2xl">{style.emoji}</span>{category}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-5">
                  {feedback.startsWith("Phân") ? <HappyFeedback text={feedback} /> : <TryAgainFeedback text={feedback} />}
                  {!done ? (
                    <button className="big-button bg-ink text-white text-lg" onClick={next}>Thẻ tiếp theo ➡️</button>
                  ) : (
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-3 rounded-2xl bg-yellowLab/35 px-6 py-4 text-xl font-black text-ink">
                        <Award className="h-7 w-7 text-orange-500" /> Hoàn thành: {score}/{deck.length} điểm!
                      </div>
                      <button className="big-button bg-ink text-white text-lg" onClick={restart}>🔄 Chơi lại</button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
