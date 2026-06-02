import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles, Star, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BadgeReward, LoadingBuddy } from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { TTSButton } from "../../components/TTSButton";
import { useSession } from "../../hooks/useSession";
import { promptFeedback, unlockSticker } from "../../lib/api";

const blocks = {
  role: [
    "Hãy đóng vai bạn học tập vui vẻ",
    "Hãy đóng vai giáo viên tiểu học",
    "Hãy đóng vai Buddy Bot",
    "Hãy đóng vai nhà du hành vũ trụ nhí",
    "Hãy đóng vai chú gấu bông thông thái",
  ],
  task: [
    "giải thích vòng đời con bướm",
    "giải thích AI là gì",
    "tạo một câu đố toán lớp 3",
    "kể câu chuyện về bảo vệ môi trường",
    "giải thích vì sao trời lại mưa",
  ],
  audience: [
    "cho học sinh lớp 3",
    "cho bạn nhỏ 7 tuổi",
    "cho người mới bắt đầu",
    "cho các em mẫu giáo tò mò",
    "cho chú mèo con đáng yêu",
  ],
  style: [
    "dùng giọng vui vẻ",
    "dùng ví dụ trái cây",
    "dùng từ thật dễ hiểu",
    "dùng giọng điệu siêu anh hùng",
    "dùng một bài thơ vui nhộn",
  ],
  format: [
    "gồm 3 ý ngắn và 1 ví dụ",
    "trả lời bằng gạch đầu dòng",
    "kết thúc bằng 1 câu hỏi nhỏ",
    "gồm 2 câu đố vui bất ngờ",
    "tóm tắt thành 3 từ khóa chính",
  ],
};

export function PromptMagicGame() {
  const { session } = useSession();
  const [level, setLevel] = useState<"easy" | "hard" | null>(null);
  const [selected, setSelected] = useState({
    role: blocks.role[0],
    task: blocks.task[0],
    audience: blocks.audience[0],
    style: blocks.style[0],
    format: blocks.format[0],
  });
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof promptFeedback>
  > | null>(null);
  const [loading, setLoading] = useState(false);

  const [sparkle, setSparkle] = useState(false);

  const prompt = useMemo(() => {
    if (level === "easy") {
      return `Hãy ${selected.task} ${selected.audience}, ${selected.style}.`;
    }
    return `${selected.role}, ${selected.task} ${selected.audience}, ${selected.style}, ${selected.format}.`;
  }, [selected, level]);

  useEffect(() => {
    setResult(null);
  }, []);

  const selectBlock = (key: string, option: string) => {
    setSelected({ ...selected, [key]: option });
    setSparkle(true);
    // Reset sparkle after the animation ends
    // FIX: caller ignores cleanup return; useRef avoids timer leaks
    setTimeout(() => setSparkle(false), 600);
  };

  async function submit() {
    if (!session) {
      return;
    }
    setLoading(true);
    try {
      const res = await promptFeedback(session.id, prompt);
      setResult(res);
      if (res.score >= 80) {
        unlockSticker("prompt");
      }
    } catch {}
    setLoading(false);
  }

  function resetLevel() {
    setLevel(null);
    setSelected({
      role: blocks.role[0],
      task: blocks.task[0],
      audience: blocks.audience[0],
      style: blocks.style[0],
      format: blocks.format[0],
    });
    setResult(null);
  }

  if (!level) {
    return (
      <GameShell
        instruction="Chọn cấp độ rèn luyện phép thuật viết câu lệnh nhé!"
        subtitle="Ghép prompt để hướng dẫn AI."
        title="Prompt Magic"
      >
        <div className="lab-card mx-auto max-w-2xl space-y-6 bg-white/80 p-8 text-center">
          <div className="mb-2 text-6xl">🪄</div>
          <h2 className="font-black text-3xl text-ink">
            Pháp sư viết câu lệnh (Prompt)
          </h2>
          <p className="font-bold text-lg text-muted">
            Prompt là câu lệnh để hướng dẫn AI làm việc cho em. Chọn cấp độ viết
            nhé:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg hover:scale-103"
              onClick={() => setLevel("easy")}
              type="button"
            >
              🟢 Chế độ Tập sự (Ghép 3 khối)
            </button>
            <button
              className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white hover:scale-103"
              onClick={() => setLevel("hard")}
              type="button"
            >
              🔥 Chế độ Pháp sư (Ghép 5 khối)
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  // Filter categories based on level
  const activeCategories =
    level === "easy"
      ? Object.entries(blocks).filter(([key]) =>
          ["task", "audience", "style"].includes(key)
        )
      : Object.entries(blocks);

  return (
    <GameShell
      instruction="Chọn từng mảnh ghép bên dưới để tạo nên một câu lệnh hoàn hảo và gửi cho Prompt Coach chấm điểm nhé!"
      subtitle="Ghép prompt để hướng dẫn AI."
      title={`Prompt Magic - Chế độ ${level === "easy" ? "Tập sự" : "Pháp sư"}`}
    >
      <section className="grid flex-1 gap-5 lg:grid-cols-[1fr_390px]">
        <div className="lab-card grid gap-5 bg-white/70 p-4 sm:gap-6 sm:p-6">
          {activeCategories.map(([key, options]) => (
            <div className="space-y-3" key={key}>
              <h2 className="flex items-center gap-1.5 border-white/50 border-b pb-1.5 font-black text-ink text-lg">
                {label(key)}
              </h2>
              <div className="flex flex-wrap gap-3">
                {options.map((option) => {
                  const isSelected =
                    selected[key as keyof typeof selected] === option;
                  return (
                    <button
                      className={`big-button flex w-full items-center justify-center gap-2 border-2 px-4 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md sm:w-auto sm:px-5 sm:text-base ${
                        isSelected
                          ? "scale-[1.03] border-yellowLab bg-yellowLab font-black text-ink shadow-md ring-2 ring-yellowLab/40"
                          : "border-skyLab/35 bg-cream/90 text-ink shadow-sm hover:border-skyLab/55 hover:bg-white"
                      }`}
                      key={option}
                      onClick={() => selectBlock(key, option)}
                      type="button"
                    >
                      {isSelected && (
                        <Check className="h-5 w-5 stroke-[3px] text-ink" />
                      )}
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="lab-card flex flex-col justify-between border-white/70 bg-white/85 p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-purpleLab to-pinkLab text-white shadow-soft">
                <Wand2 className="h-6 w-6" />
              </span>
              <h2 className="font-black text-2xl text-ink tracking-tight">
                Prompt của em
              </h2>
            </div>
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="relative flex-grow break-words rounded-3xl border border-yellowLab/30 bg-cream/70 p-4 font-black text-base text-ink italic leading-relaxed sm:p-5 sm:text-lg">
                "{prompt}"
                {sparkle && (
                  <span className="pointer-events-none absolute -top-3 -right-3 animate-sparkle text-3xl">
                    ✨
                  </span>
                )}
              </p>
              <TTSButton compact={true} text={prompt} />
            </div>
            <button
              className="big-button flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-lg text-white shadow-md hover:bg-ink/90"
              disabled={loading}
              onClick={() => void submit()}
              type="button"
            >
              <Sparkles className="h-5 w-5 fill-yellowLab text-yellowLab" /> Gửi
              Prompt Coach
            </button>
          </div>

          {loading && (
            <div className="mt-5">
              <LoadingBuddy />
            </div>
          )}

          {result && (
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="mt-5 space-y-4 border-white/60 border-t pt-4"
              initial={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-ink text-lg">
                  Kết quả đánh giá:
                </span>
                <motion.span
                  animate={{ scale: [1, 1.12, 1] }}
                  className="relative flex items-center gap-1.5 overflow-hidden rounded-2xl bg-purpleLab px-4 py-2 font-black text-md text-white shadow-md"
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <Star className="h-4.5 w-4.5 fill-white text-yellowLab" />{" "}
                  {result.score}/100
                  <span className="absolute -top-1 -right-1 animate-sparkle text-xs text-yellow-200">
                    ✨
                  </span>
                </motion.span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {result.badges.map((badge) => (
                  <BadgeReward key={badge} text={badge} />
                ))}
              </div>

              <p className="border-purpleLab border-l-4 py-1 pl-3 font-semibold text-muted text-sm leading-relaxed">
                {result.feedback}
              </p>

              <div className="space-y-1.5 rounded-2xl border border-skyLab/20 bg-skyLab/10 p-3">
                <p className="flex items-center gap-1 font-black text-sky-800 text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" /> Prompt gợi ý hay hơn:
                </p>
                <p className="font-bold text-ink text-sm leading-relaxed">
                  "{result.improvedPrompt}"
                </p>
              </div>

              <button
                className="big-button mt-2 w-full border border-yellowLab/50 bg-cream text-ink"
                onClick={resetLevel}
                type="button"
              >
                Thay đổi chế độ ghép khối
              </button>
            </motion.div>
          )}
        </aside>
      </section>
    </GameShell>
  );
}

function label(key: string) {
  return (
    {
      role: "👤 Vai trò (Ai đang nói?)",
      task: "🎯 Nhiệm vụ (Làm việc gì?)",
      audience: "🧒 Người nghe (Cho ai xem?)",
      style: "✨ Phong cách (Giọng điệu ra sao?)",
      format: "📋 Định dạng (Trình bày thế nào?)",
    } as Record<string, string>
  )[key];
}
