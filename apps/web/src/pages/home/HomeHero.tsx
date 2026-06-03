import { ArrowRight, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { BuddyBot } from "../../components/BuddyBot";
import { quickStats } from "./homeData";

export function HomeHero({
  unlockedCount,
  onOpenStickerBook,
}: {
  unlockedCount: number;
  onOpenStickerBook: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur-md sm:p-7 lg:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab"
      />
      <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45 }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-purpleLab/25 bg-purpleLab/15 px-4 py-2 font-black text-purple-700 text-sm">
            <Sparkles className="h-4 w-4" /> Rainbow Robot Classroom
          </p>
          <div className="space-y-3">
            <h1 className="max-w-3xl font-black text-4xl text-ink leading-tight sm:text-5xl lg:text-6xl">
              Phòng Thí Nghiệm{" "}
              <span className="bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab bg-clip-text text-transparent">
                AI Vui Nhộn
              </span>
            </h1>
            <p className="max-w-2xl font-bold text-base text-muted leading-relaxed sm:text-lg">
              Cùng Buddy Bot khám phá AI qua trò chơi, hình ảnh, giọng nói và
              thử thách thông minh!
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div
                className={`rounded-3xl px-4 py-3 font-black shadow-sm ${stat.tone}`}
                key={stat.label}
              >
                <div className="text-2xl leading-none">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="big-button inline-flex items-center gap-2 bg-gradient-to-r from-ink to-ink/90 text-white"
              href="#games"
            >
              Chọn trò chơi <ArrowRight className="h-5 w-5" />
            </a>
            <button
              className="big-button inline-flex items-center gap-2 border border-yellowLab/50 bg-yellowLab/25 text-ink"
              onClick={onOpenStickerBook}
              type="button"
            >
              <Trophy className="h-5 w-5 text-orange-500" /> Sổ Sticker (
              {unlockedCount}/5)
            </button>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative min-h-[280px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-skyLab/20 via-white to-yellowLab/25 p-5"
          initial={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="absolute top-5 left-5 rounded-3xl bg-white/85 px-4 py-3 font-black text-ink text-sm shadow-sm">
            <ShieldCheck className="mr-1 inline h-4 w-4 text-green-600" />
            Học AI an toàn
          </div>
          <div className="mx-auto flex h-[250px] items-center justify-center sm:h-[320px]">
            <BuddyBot size={240} state="happy" />
          </div>
          <div className="absolute right-5 bottom-5 max-w-[230px] rounded-3xl bg-white/90 px-4 py-3 font-black text-ink text-sm leading-snug shadow-sm">
            AI có thể sai. Mình cùng kiểm tra với thầy cô nhé!
          </div>
        </motion.div>
      </div>
    </section>
  );
}
