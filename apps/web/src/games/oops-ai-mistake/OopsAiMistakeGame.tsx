import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Award, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import oopsBanner from "../../assets/oops-banner.png";
import {
  ConfettiSuccess,
  HappyFeedback,
  TryAgainFeedback,
} from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { TTSButton } from "../../components/TTSButton";
import { useSession } from "../../hooks/useSession";
import { type OopsQuestion, saveProgress, unlockSticker } from "../../lib/api";

const easyQuestions: OopsQuestion[] = [
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

const hardQuestions: OopsQuestion[] = [
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

const choiceStyles = {
  Đúng: {
    emoji: "✅",
    color: "bg-gradient-to-r from-greenLab to-mintLab text-ink",
  },
  Sai: {
    emoji: "❌",
    color: "bg-gradient-to-r from-redSoft to-pinkLab text-ink",
  },
  "Cần kiểm tra thêm": {
    emoji: "🔍",
    color: "bg-gradient-to-r from-yellowLab to-orangeLab text-ink",
  },
} as const;

const choices = Object.keys(choiceStyles) as (keyof typeof choiceStyles)[];

export function OopsAiMistakeGame() {
  const { session } = useSession();
  const [level, setLevel] = useState<"easy" | "hard" | null>(null);
  const [questions, setQuestions] = useState<OopsQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (level) {
      const selectedSet = level === "easy" ? easyQuestions : hardQuestions;
      const shuffled = [...selectedSet].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 5));
      setIndex(0);
      setScore(0);
      setFeedback("");
      setShowConfetti(false);
    }
  }, [level]);

  const current = questions[index];
  const isLastQuestion = index === questions.length - 1;

  function answer(choice: string) {
    if (!current) {
      return;
    }
    const correct = choice === current.answer;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(
      `${correct ? "Đúng rồi!" : "Mình kiểm tra lại nhé."} ${current.explain}`
    );
    if (isLastQuestion) {
      setShowConfetti(true);
      if (nextScore >= 3) {
        unlockSticker("oops");
      }
      if (session) {
        void saveProgress(
          session.id,
          `oops-mistake-${level}`,
          nextScore,
          questions.length
        );
      }
    }
  }

  function resetLevel() {
    setLevel(null);
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setFeedback("");
    setShowConfetti(false);
  }

  if (!level) {
    return (
      <GameShell
        instruction="Chọn cấp độ chơi phù hợp với em nhé!"
        subtitle="AI không phải lúc nào cũng đúng."
        title="🤔 AI Có Thể Sai"
      >
        <div className="lab-card mx-auto max-w-2xl space-y-6 bg-white/80 p-8 text-center">
          <div className="mb-2 flex max-h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-redSoft/15 shadow-md">
            <img
              alt="AI Có Thể Sai Banner"
              className="h-full max-h-48 w-full object-cover"
              src={oopsBanner}
            />
          </div>
          <h2 className="font-black text-3xl text-ink">
            Thám tử Rà soát Lỗi AI
          </h2>
          <p className="font-bold text-lg text-muted">
            AI không phải lúc nào cũng thông minh và đúng đắn. Hãy tập kiểm tra
            thông tin nhé!
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.button
              className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg"
              onClick={() => setLevel("easy")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mr-2 text-2xl">🌱</span> Logic Thực tế
              <span className="mt-1 block font-semibold text-ink/60 text-xs">
                Ngẫu nhiên 5 câu rà soát
              </span>
            </motion.button>
            <motion.button
              className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white"
              onClick={() => setLevel("hard")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mr-2 text-2xl">🔥</span> Tin giả & Ảo tưởng AI
              <span className="mt-1 block font-semibold text-white/70 text-xs">
                Ngẫu nhiên 5 câu nâng cao
              </span>
            </motion.button>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction="Hãy đọc câu trả lời của AI và xem có lỗi nào không nhé."
      maxScore={questions.length}
      score={score}
      subtitle="AI không phải lúc nào cũng đúng."
      title={`🤔 AI Có Thể Sai — ${level === "easy" ? "Logic Thực tế" : "Tin giả & Ảo tưởng"}`}
    >
      <section className="lab-card relative mx-auto max-w-3xl overflow-hidden bg-white/85 p-6 text-center md:p-8">
        {showConfetti && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              initial={{ opacity: 0, x: 40 }}
              key={index}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-3 font-black text-muted text-sm">
                📋 Câu {index + 1} / {questions.length}
              </p>
              <div className="mb-4 flex justify-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <AlertTriangle className="h-12 w-12 text-orange-400" />
                </motion.div>
              </div>
              <div className="mb-6 rounded-2xl border border-yellowLab/30 bg-cream/80 p-5">
                <p className="mb-2 font-black text-muted text-sm">
                  🤖 AI nói rằng:
                </p>
                <div className="flex items-center justify-center gap-3">
                  <p className="font-black text-2xl text-ink leading-relaxed md:text-3xl">
                    "{current.text}"
                  </p>
                  <TTSButton
                    autoPlay={true}
                    compact={true}
                    text={current.text}
                  />
                </div>
              </div>
              {feedback ? (
                <div className="space-y-5">
                  {feedback.startsWith("Đúng") ? (
                    <HappyFeedback text={feedback} />
                  ) : (
                    <TryAgainFeedback text={feedback} />
                  )}
                  {isLastQuestion ? (
                    <div className="space-y-4 pt-3">
                      <motion.div
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-3 rounded-2xl border border-yellowLab/55 bg-yellowLab/35 px-6 py-4 font-black text-ink text-lg shadow-sm"
                        initial={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Award className="h-7 w-7 fill-orange-200 text-orange-500" />
                        <span>
                          🎉 Hoàn thành: {score}/{questions.length} điểm!
                        </span>
                      </motion.div>
                      <div className="rounded-2xl border border-skyLab/20 bg-skyLab/10 p-4 text-left">
                        <p className="mb-2 flex items-center gap-2 font-black text-sky-800">
                          <BookOpen className="h-5 w-5" /> Bài học quan trọng:
                        </p>
                        <p className="font-bold text-ink text-sm leading-relaxed">
                          Khi AI trả lời, mình nên kiểm tra lại với thầy cô,
                          sách hoặc nguồn đáng tin cậy nhé! 📚
                        </p>
                      </div>
                      <button
                        className="big-button mt-2 bg-ink text-lg text-white"
                        onClick={resetLevel}
                      >
                        🔄 Chơi lại hoặc chọn cấp độ khác
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      className="big-button bg-ink text-lg text-white"
                      onClick={() => {
                        setFeedback("");
                        setIndex(index + 1);
                      }}
                      whileHover={{ scale: 1.03 }}
                    >
                      Câu tiếp theo ➡️
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {choices.map((choice) => {
                    const style = choiceStyles[choice];
                    return (
                      <motion.button
                        className={`big-button ${style.color} flex items-center justify-center gap-3 border border-white/40 py-4 text-lg shadow-sm`}
                        key={choice}
                        onClick={() => answer(choice)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="text-2xl">{style.emoji}</span> {choice}
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
