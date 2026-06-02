import { Bot, Music, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export function Layout() {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith("/games");
  const isCompactLayout = isGamePage;
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedVoice = localStorage.getItem("ai-lab-tts-gender");
    if (savedVoice === "male") {
      setVoiceGender("male");
    }

    // Initialize background music
    const bgm = new Audio("/music/bgm.ogg");
    bgm.loop = true;
    bgm.volume = 0.12; // Gentle BGM volume
    setAudio(bgm);

    const savedBgm = localStorage.getItem("ai-lab-bgm-enabled");
    let playBgm: (() => void) | null = null;
    if (savedBgm === "true") {
      setBgmEnabled(true);
      // Wait for user interaction to play (autoplay policy)
      playBgm = () => {
        bgm.play().catch(() => {});
        window.removeEventListener("click", playBgm!);
        playBgm = null;
      };
      window.addEventListener("click", playBgm);
    }

    return () => {
      bgm.pause();
      // FIX: cleanup event listener để tránh memory leak
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

  return (
    <div
      className={`relative overflow-x-hidden ${isCompactLayout ? "flex min-h-dvh flex-col" : "flex min-h-screen flex-col justify-between"}`}
    >
      {/* Floating decorations — background only */}
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
                {isGamePage ? "AI Lab" : "Phòng Thí Nghiệm AI"}
              </span>
              <span className="-mt-0.5 hidden font-bold text-muted text-xs sm:block">
                🌈 Rainbow Robot Classroom
              </span>
            </div>
          </Link>
          <nav className="grid grid-cols-2 items-center gap-2 font-bold text-xs sm:flex sm:flex-wrap sm:gap-2.5 sm:text-sm">
            {/* Background Music Toggle */}
            <button
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-100 sm:px-4 sm:py-2.5 ${
                bgmEnabled
                  ? "border-yellowLab/50 bg-yellowLab/30 text-ink"
                  : "border-white/60 bg-white/85 text-muted"
              }`}
              onClick={toggleBgm}
              title={bgmEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
              type="button"
            >
              {bgmEnabled ? (
                <Music className="h-4.5 w-4.5 animate-pulse text-orangeLab" />
              ) : (
                <VolumeX className="h-4.5 w-4.5 text-muted" />
              )}
              <span className="truncate">
                {bgmEnabled ? "Nhạc: Bật" : "Nhạc: Tắt"}
              </span>
            </button>

            <button
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-white/60 bg-white/85 px-3 py-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-md active:scale-100 sm:px-4 sm:py-2.5"
              onClick={toggleVoiceGender}
              type="button"
            >
              <Volume2 className="h-4.5 w-4.5 shrink-0 text-skyLab" />
              <span className="truncate">
                {voiceGender === "female" ? "Cô giáo" : "Thầy giáo"}
              </span>
            </button>
            <span className="col-span-2 flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-greenLab/25 bg-greenLab/15 px-3 py-2 text-ink shadow-sm sm:col-span-1 sm:min-h-0 sm:px-4 sm:py-2.5">
              <ShieldCheck className="h-4 w-4 text-green-600" /> An toàn cho học
              sinh
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
          🤖 AI có thể sai. Hãy kiểm tra với thầy cô nhé! 📚
        </footer>
      )}
    </div>
  );
}
