import { CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BuddyBot } from "./BuddyBot";
import { TTSButton } from "./TTSButton";

export function HappyFeedback({ text }: { text: string }) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-greenLab/25 bg-greenLab/15 p-5 text-center font-bold text-ink sm:flex-row sm:text-left">
      <div className="flex-shrink-0">
        <BuddyBot size={85} state="celebrating" />
      </div>
      <div className="flex-1">
        <div className="mb-1.5 flex items-center justify-center gap-1.5 font-black text-green-700 text-xl sm:justify-start">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <span>{t("feedback.correct")}</span>
        </div>
        <p className="font-semibold text-base text-ink leading-relaxed">
          {text}
        </p>
      </div>
      <div className="flex-shrink-0">
        <TTSButton
          autoPlay={true}
          autoPlayRole="immediate"
          compact={true}
          text={text}
        />
      </div>
    </div>
  );
}

export function TryAgainFeedback({ text }: { text: string }) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-yellowLab/30 bg-yellowLab/20 p-5 text-center font-bold text-ink sm:flex-row sm:text-left">
      <div className="flex-shrink-0">
        <BuddyBot size={85} state="warning" />
      </div>
      <div className="flex-1">
        <div className="mb-1.5 flex items-center justify-center gap-1.5 font-black text-orange-600 text-xl sm:justify-start">
          <Sparkles className="h-6 w-6 animate-pulse text-orange-500" />
          <span>{t("feedback.tryAgain")}</span>
        </div>
        <p className="font-semibold text-base text-ink leading-relaxed">
          {text}
        </p>
      </div>
      <div className="flex-shrink-0">
        <TTSButton
          autoPlay={true}
          autoPlayRole="immediate"
          compact={true}
          text={text}
        />
      </div>
    </div>
  );
}

export function SafetyRedirect({ text }: { text: string }) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-redSoft/30 bg-redSoft/15 p-5 text-center font-bold text-ink sm:flex-row sm:text-left">
      <div className="flex-shrink-0">
        <BuddyBot size={85} state="warning" />
      </div>
      <div className="flex-1">
        <div className="mb-1.5 flex items-center justify-center gap-1.5 font-black text-red-600 text-xl sm:justify-start">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          <span>{t("feedback.safety")}</span>
        </div>
        <p className="font-semibold text-base text-ink leading-relaxed">
          {text}
        </p>
      </div>
      <div className="flex-shrink-0">
        <TTSButton
          autoPlay={true}
          autoPlayRole="immediate"
          compact={true}
          text={text}
        />
      </div>
    </div>
  );
}

export function BadgeReward({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-purpleLab/20 px-3 py-2 font-black text-ink text-sm">
      {text}
    </span>
  );
}

export function ConfettiSuccess() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[length:28px_28px] bg-[radial-gradient(circle,#FACC15_2px,transparent_3px)] opacity-20" />
  );
}

export function LoadingBuddy() {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/40 bg-white/60 p-6 text-center font-bold text-muted backdrop-blur-xs">
      <BuddyBot size={95} state="thinking" />
      <p className="animate-pulse font-black text-ink text-lg">
        {t("feedback.loading")}
      </p>
    </div>
  );
}
