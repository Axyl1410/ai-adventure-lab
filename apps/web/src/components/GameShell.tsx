import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { BuddyBot } from "./BuddyBot";
import { TTSButton } from "./TTSButton";

export function GameShell({
  title,
  subtitle,
  instruction,
  score,
  maxScore,
  children
}: {
  title: string;
  subtitle: string;
  instruction: string;
  score?: number;
  maxScore?: number;
  children: React.ReactNode;
}) {
  const [autoplay, setAutoplay] = useState(() => {
    return localStorage.getItem("ai-lab-tts-autoplay") === "true";
  });

  useEffect(() => {
    localStorage.setItem("ai-lab-tts-autoplay", autoplay ? "true" : "false");
  }, [autoplay]);

  const progress = maxScore ? Math.round(((score ?? 0) / maxScore) * 100) : 0;

  // Gradient color based on progress
  const progressGradient =
    progress < 40
      ? "from-skyLab to-blueLab"
      : progress < 75
        ? "from-blueLab to-purpleLab"
        : "from-greenLab to-mintLab";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 py-3 sm:px-4 sm:py-3.5">
      {/* Top Navbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="grid w-full grid-cols-2 items-center gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <Link className="big-button min-h-11 bg-white/90 text-ink border border-white/60 shadow-sm hover:shadow-md py-2 px-3 text-xs sm:px-4 sm:text-sm" to="/">
            <ArrowLeft className="mr-1 inline h-4 w-4" /> <span className="truncate">Về phòng lab</span>
          </Link>
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`big-button min-h-11 border shadow-sm py-2 px-3 font-bold text-xs transition-all sm:px-4 sm:text-sm ${
              autoplay 
                ? "bg-greenLab/20 text-ink border-greenLab/40 hover:bg-greenLab/30" 
                : "bg-white/90 text-muted border-white/60 hover:bg-gray-50"
            }`}
          >
            {autoplay ? "🔊 Đọc: Bật" : "🔇 Đọc: Tắt"}
          </button>
        </div>

        {typeof score === "number" && (
          <div className="rounded-2xl bg-yellowLab/30 border border-yellowLab/50 px-4 py-2 font-black text-ink flex items-center gap-1.5 shadow-sm text-sm">
            <Star className="h-4 w-4 text-orange-500 fill-orange-300" />
            <span>{score}/{maxScore} điểm</span>
          </div>
        )}
      </div>

      {/* Slim & Compact Header Shell */}
      <section className="lab-card mb-4 flex flex-col gap-3 rounded-3xl border border-white/60 p-3 shadow-sm sm:p-4 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 flex-shrink-0 sm:h-12 sm:w-12">
            <BuddyBot state="reading" size={48} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-lg font-black tracking-tight text-ink sm:text-xl">{title}</h1>
              {maxScore ? (
                <div className="w-20 hidden sm:block">
                  <div className="h-2 rounded-full bg-white/80 border border-white/60 shadow-inner overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${progressGradient} transition-all duration-700 ease-out`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs font-bold text-muted sm:line-clamp-none">{subtitle}</p>
          </div>
        </div>
        
        <div className="w-full rounded-2xl border border-yellowLab/10 bg-cream/80 p-3 text-sm font-semibold leading-relaxed text-ink md:w-auto md:flex-1">
          💡 {instruction}
        </div>

        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          {maxScore && (
            <span className="text-xs font-black text-muted bg-white/60 border border-white/80 px-2.5 py-1 rounded-xl">
              📊 {score ?? 0}/{maxScore} câu
            </span>
          )}
          <TTSButton text={instruction} compact autoPlay />
        </div>
      </section>

      {/* Emphasized Game Workspace */}
      <div className="flex w-full flex-1 flex-col">
        {children}
      </div>
    </main>
  );
}
