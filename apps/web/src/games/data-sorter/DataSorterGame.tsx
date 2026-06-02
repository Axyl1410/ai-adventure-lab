import { AnimatePresence, motion } from "framer-motion";
import { Award, Database } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ConfettiSuccess,
  HappyFeedback,
  TryAgainFeedback,
} from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { TTSButton } from "../../components/TTSButton";
import { useSession } from "../../hooks/useSession";
import { saveProgress, unlockSticker } from "../../lib/api";

type Category = "Dữ liệu tốt" | "Dữ liệu nhiễu" | "Thông tin riêng tư";

interface CardItem {
  category: Category;
  emoji: string;
  explain: string;
  text: string;
}

const items: CardItem[] = [
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

const categories: Category[] = [
  "Dữ liệu tốt",
  "Dữ liệu nhiễu",
  "Thông tin riêng tư",
];

const categoryStyle: Record<Category, { emoji: string; className: string }> = {
  "Dữ liệu tốt": {
    emoji: "✅",
    className: "from-greenLab to-mintLab text-ink",
  },
  "Dữ liệu nhiễu": {
    emoji: "🧹",
    className: "from-yellowLab to-orangeLab text-ink",
  },
  "Thông tin riêng tư": {
    emoji: "🔒",
    className: "from-redSoft to-pinkLab text-ink",
  },
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
    if (!current || feedback) {
      return;
    }
    const correct = category === current.category;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(
      `${correct ? "Phân loại đúng!" : "Mình thử kiểm tra lại nhé."} ${current.explain}`
    );

    if (index === deck.length - 1) {
      setDone(true);
      if (nextScore >= 5) {
        unlockSticker("robot");
      }
      if (session) {
        void saveProgress(session.id, "data-sorter", nextScore, deck.length);
      }
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
      instruction="Đọc từng thẻ dữ liệu rồi chọn: dữ liệu tốt, dữ liệu nhiễu hoặc thông tin riêng tư."
      maxScore={deck.length || 6}
      score={score}
      subtitle="Phân loại dữ liệu để AI học an toàn."
      title="🗂️ Data Sorter"
    >
      <section className="lab-card relative mx-auto max-w-4xl overflow-hidden bg-white/85 p-6 text-center">
        {done && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              initial={{ opacity: 0, y: 24 }}
              key={index}
            >
              <p className="mb-3 font-black text-muted text-sm">
                📋 Thẻ {index + 1} / {deck.length}
              </p>
              <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-skyLab/15 text-6xl shadow-sm">
                {current.emoji}
              </div>
              <div className="mb-7 flex items-center justify-center gap-3 rounded-3xl border border-yellowLab/20 bg-cream/70 p-5">
                <Database className="h-8 w-8 text-purpleLab" />
                <p className="font-black text-2xl text-ink leading-relaxed">
                  {current.text}
                </p>
                <TTSButton
                  autoPlay={true}
                  autoPlayRole="content"
                  compact={true}
                  text={current.text}
                />
              </div>

              {feedback ? (
                <div className="space-y-5">
                  {feedback.startsWith("Phân") ? (
                    <HappyFeedback text={feedback} />
                  ) : (
                    <TryAgainFeedback text={feedback} />
                  )}
                  {done ? (
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-3 rounded-2xl bg-yellowLab/35 px-6 py-4 font-black text-ink text-xl">
                        <Award className="h-7 w-7 text-orange-500" /> Hoàn
                        thành: {score}/{deck.length} điểm!
                      </div>
                      <button
                        className="big-button bg-ink text-lg text-white"
                        onClick={restart}
                        type="button"
                      >
                        🔄 Chơi lại
                      </button>
                    </div>
                  ) : (
                    <button
                      className="big-button bg-ink text-lg text-white"
                      onClick={next}
                      type="button"
                    >
                      Thẻ tiếp theo ➡️
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-3">
                  {categories.map((category) => {
                    const style = categoryStyle[category];
                    return (
                      <motion.button
                        className={`big-button bg-gradient-to-r ${style.className} border border-white/40 py-4 text-lg shadow-sm`}
                        key={category}
                        onClick={() => answer(category)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="mr-2 text-2xl">{style.emoji}</span>
                        {category}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
