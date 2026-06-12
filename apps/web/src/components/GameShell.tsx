import { ArrowLeft, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GameTtsProvider } from "@/context/GameTtsContext";
import { BuddyBot } from "./BuddyBot";
import { TTSButton } from "./TTSButton";

export function GameShell({
  title,
  subtitle,
  instruction,
  score,
  maxScore,
  children,
}: {
  title: string;
  subtitle: string;
  instruction: string;
  score?: number;
  maxScore?: number;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("common");
  const [autoplay, setAutoplay] = useState(
    () => localStorage.getItem("ai-lab-tts-autoplay") === "true"
  );

  useEffect(() => {
    localStorage.setItem("ai-lab-tts-autoplay", autoplay ? "true" : "false");
  }, [autoplay]);

  const progress = maxScore ? Math.round(((score ?? 0) / maxScore) * 100) : 0;

  let progressGradient = "from-greenLab to-mintLab";
  if (progress < 40) {
    progressGradient = "from-skyLab to-blueLab";
  } else if (progress < 75) {
    progressGradient = "from-blueLab to-purpleLab";
  }

  return (
    <GameTtsProvider>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="grid w-full grid-cols-2 items-center gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <Link
              className="big-button min-h-11 border border-white/60 bg-white/90 px-3 py-2 text-ink text-xs shadow-sm hover:shadow-md sm:px-4 sm:text-sm"
              to="/"
            >
              <ArrowLeft className="mr-1 inline h-4 w-4" />{" "}
              <span className="truncate">{t("gameShell.backToLab")}</span>
            </Link>
            <button
              className={`big-button min-h-11 border px-3 py-2 font-bold text-xs shadow-sm transition-all sm:px-4 sm:text-sm ${
                autoplay
                  ? "border-greenLab/40 bg-greenLab/20 text-ink hover:bg-greenLab/30"
                  : "border-white/60 bg-white/90 text-muted hover:bg-gray-50"
              }`}
              onClick={() => setAutoplay(!autoplay)}
              type="button"
            >
              {autoplay
                ? t("gameShell.autoplayOn")
                : t("gameShell.autoplayOff")}
            </button>
          </div>

          {typeof score === "number" && maxScore !== undefined && (
            <div className="flex items-center gap-1.5 rounded-2xl border border-yellowLab/50 bg-yellowLab/30 px-4 py-2 font-black text-ink text-sm shadow-sm">
              <Star className="h-4 w-4 fill-orange-300 text-orange-500" />
              <span>
                {t("gameShell.scorePoints", { score, max: maxScore })}
              </span>
            </div>
          )}
        </div>

        <section className="lab-card mb-4 flex flex-col gap-3 rounded-3xl border border-white/60 p-3 shadow-sm sm:p-4 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 flex-shrink-0 sm:h-12 sm:w-12">
              <BuddyBot size={48} state="reading" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="truncate font-black text-ink text-lg tracking-tight sm:text-xl">
                  {title}
                </h1>
                {maxScore ? (
                  <div className="hidden w-20 sm:block">
                    <div className="h-2 overflow-hidden rounded-full border border-white/60 bg-white/80 shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${progressGradient} transition-all duration-700 ease-out`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <p className="mt-0.5 line-clamp-2 font-bold text-muted text-xs sm:line-clamp-none">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-yellowLab/10 bg-cream/80 p-3 font-semibold text-ink text-sm leading-relaxed md:w-auto md:flex-1">
            💡 {instruction}
          </div>

          <div className="flex w-full items-center justify-end gap-2 md:w-auto">
            {maxScore !== undefined && (
              <span className="rounded-xl border border-white/80 bg-white/60 px-2.5 py-1 font-black text-muted text-xs">
                {t("gameShell.scoreQuestions", {
                  score: score ?? 0,
                  max: maxScore,
                })}
              </span>
            )}
            <TTSButton
              autoPlay={true}
              autoPlayRole="instruction"
              compact={true}
              text={instruction}
            />
          </div>
        </section>

        <div className="flex w-full flex-1 flex-col">{children}</div>
      </main>
    </GameTtsProvider>
  );
}
