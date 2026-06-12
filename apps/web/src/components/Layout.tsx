import { Bot, Globe, Music, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import type { AppLocale } from "@/lib/i18n";
import { stopAllTts } from "@/lib/stopAllTts";

export function Layout() {
  const { i18n, t } = useTranslation("layout");
  const location = useLocation();
  const isGamePage = location.pathname.startsWith("/games");
  const isCompactLayout = isGamePage;
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const locale = i18n.language === "en" ? "en" : "vi";

  useEffect(() => {
    stopAllTts();
  }, [location.pathname]);

  useEffect(() => {
    const savedVoice = localStorage.getItem("ai-lab-tts-gender");
    if (savedVoice === "male") {
      setVoiceGender("male");
    }

    const bgm = new Audio("/music/bgm.ogg");
    bgm.loop = true;
    bgm.volume = 0.12;
    setAudio(bgm);

    const savedBgm = localStorage.getItem("ai-lab-bgm-enabled");
    let playBgm: (() => void) | null = null;
    if (savedBgm === "true") {
      setBgmEnabled(true);
      playBgm = () => {
        bgm.play().catch(() => {});
        window.removeEventListener("click", playBgm!);
        playBgm = null;
      };
      window.addEventListener("click", playBgm);
    }

    return () => {
      bgm.pause();
      if (playBgm) {
        window.removeEventListener("click", playBgm);
      }
    };
  }, []);

  const toggleVoiceGender = () => {
    const next = voiceGender === "female" ? "male" : "female";
    setVoiceGender(next);
    localStorage.setItem("ai-lab-tts-gender", next);
    window.dispatchEvent(new Event("tts-gender-changed"));
  };

  const toggleBgm = () => {
    if (!audio) {
      return;
    }
    if (bgmEnabled) {
      audio.pause();
      setBgmEnabled(false);
      localStorage.setItem("ai-lab-bgm-enabled", "false");
    } else {
      audio.play().catch(() => {});
      setBgmEnabled(true);
      localStorage.setItem("ai-lab-bgm-enabled", "true");
    }
  };

  const setLocale = (next: AppLocale) => {
    void i18n.changeLanguage(next);
  };

  return (
    <div
      className={`relative overflow-x-hidden ${isCompactLayout ? "flex min-h-dvh flex-col" : "flex min-h-screen flex-col justify-between"}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="floating-star"
          style={{ top: "8%", left: "5%", animationDelay: "0s" }}
        />
        <div
          className="floating-star"
          style={{ top: "15%", right: "8%", animationDelay: "1.5s" }}
        />
        <div
          className="floating-star"
          style={{ top: "55%", left: "3%", animationDelay: "3s" }}
        />
        <div
          className="floating-star"
          style={{ top: "70%", right: "6%", animationDelay: "0.8s" }}
        />
        <div
          className="floating-cloud"
          style={{ top: "12%", left: "15%", animationDelay: "0s" }}
        />
        <div
          className="floating-cloud"
          style={{ top: "45%", right: "12%", animationDelay: "4s" }}
        />
        <div
          className="floating-cloud"
          style={{ top: "80%", left: "60%", animationDelay: "2s" }}
        />
        <div
          className="floating-bubble"
          style={{ bottom: "20%", left: "10%", animationDelay: "1s" }}
        />
        <div
          className="floating-bubble"
          style={{ bottom: "35%", right: "15%", animationDelay: "3.5s" }}
        />
        <div
          className="floating-bubble"
          style={{ top: "30%", left: "70%", animationDelay: "2.5s" }}
        />
      </div>

      <header className="sticky top-0 z-20 flex-shrink-0 border-white/40 border-b bg-white/70 shadow-sm backdrop-blur-lg">
        <div className="mx-auto grid max-w-7xl gap-2 px-3 py-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3">
          <Link
            className="group flex min-w-0 items-center gap-2 transition-transform hover:scale-[1.01] sm:gap-3"
            to="/"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-skyLab via-purpleLab to-pinkLab text-white shadow-lg transition-shadow group-hover:shadow-xl sm:h-13 sm:w-13">
              <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <span className="block truncate font-black text-ink text-lg tracking-tight sm:text-2xl">
                {t("siteTitle")}
              </span>
              <span className="-mt-0.5 hidden font-bold text-muted text-xs sm:block">
                {t("siteSubtitle")}
              </span>
            </div>
          </Link>
          <nav className="grid grid-cols-2 items-center gap-2 font-bold text-xs sm:flex sm:flex-wrap sm:gap-2.5 sm:text-sm">
            <div
              aria-label={t("localeSwitch")}
              className="col-span-2 flex min-h-11 items-center justify-center gap-1 rounded-2xl border border-white/60 bg-white/85 p-1 shadow-sm sm:col-span-1 sm:min-h-0"
              role="group"
            >
              <button
                aria-pressed={locale === "vi"}
                className={`min-h-9 flex-1 rounded-xl px-3 py-1.5 transition-all sm:flex-none ${
                  locale === "vi"
                    ? "bg-skyLab/25 font-black text-ink"
                    : "text-muted hover:bg-cream"
                }`}
                onClick={() => setLocale("vi")}
                type="button"
              >
                {t("localeVi")}
              </button>
              <button
                aria-pressed={locale === "en"}
                className={`min-h-9 flex-1 rounded-xl px-3 py-1.5 transition-all sm:flex-none ${
                  locale === "en"
                    ? "bg-skyLab/25 font-black text-ink"
                    : "text-muted hover:bg-cream"
                }`}
                onClick={() => setLocale("en")}
                type="button"
              >
                {t("localeEn")}
              </button>
              <Globe
                aria-hidden="true"
                className="mx-1 hidden h-4 w-4 text-skyLab sm:block"
              />
            </div>

            <button
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-100 sm:px-4 sm:py-2.5 ${
                bgmEnabled
                  ? "border-yellowLab/50 bg-yellowLab/30 text-ink"
                  : "border-white/60 bg-white/85 text-muted"
              }`}
              onClick={toggleBgm}
              title={bgmEnabled ? t("bgmOnTitle") : t("bgmOffTitle")}
              type="button"
            >
              {bgmEnabled ? (
                <Music className="h-4.5 w-4.5 animate-pulse text-orangeLab" />
              ) : (
                <VolumeX className="h-4.5 w-4.5 text-muted" />
              )}
              <span className="truncate">
                {bgmEnabled ? t("bgmOn") : t("bgmOff")}
              </span>
            </button>

            <button
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-white/60 bg-white/85 px-3 py-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-md active:scale-100 sm:px-4 sm:py-2.5"
              onClick={toggleVoiceGender}
              type="button"
            >
              <Volume2 className="h-4.5 w-4.5 shrink-0 text-skyLab" />
              <span className="truncate">
                {voiceGender === "female" ? t("voiceFemale") : t("voiceMale")}
              </span>
            </button>
            <span className="col-span-2 flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-greenLab/25 bg-greenLab/15 px-3 py-2 text-ink shadow-sm sm:col-span-1 sm:min-h-0 sm:px-4 sm:py-2.5">
              <ShieldCheck className="h-4 w-4 text-green-600" />{" "}
              {t("studentSafe")}
            </span>
          </nav>
        </div>
      </header>

      <div
        className={`relative z-10 ${isCompactLayout ? "flex min-h-0 flex-1 flex-col" : ""}`}
      >
        <Outlet />
      </div>

      {!isCompactLayout && (
        <footer className="relative z-10 mx-auto mt-12 w-full max-w-7xl flex-shrink-0 rounded-t-3xl border-white/20 border-t bg-white/30 px-4 py-8 text-center font-bold text-muted backdrop-blur-sm">
          {t("footer")}
        </footer>
      )}
    </div>
  );
}
