import { motion } from "framer-motion";
import { BookOpen, Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BuddyBot } from "../../components/BuddyBot";
import { SafetyRedirect } from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { useSession } from "../../hooks/useSession";
import { api, unlockSticker } from "../../lib/api";
import {
  type GeneratedImage,
  GeneratedImageCard,
  ImageDetailBuilder,
  type ImageDetails,
  ImagePromptPreview,
  ImageStylePicker,
  ImageThemePicker,
  styles,
  themes,
} from "./ImageStudioComponents";

export function ImageStudioGame() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(themes[1]);
  const [style, setStyle] = useState(styles[0]);
  const [details, setDetails] = useState<ImageDetails>({
    subject: "một chú mèo con đeo ba lô",
    setting: "trong lớp học cầu vồng",
    colors: ["xanh da trời", "vàng"],
    mood: "vui vẻ",
    includeText: false,
  });
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const prompt = useMemo(
    () =>
      `Tạo ${style.toLowerCase()} về ${details.subject} trong ${details.setting}, chủ đề ${theme}, màu ${details.colors.join(", ")}, cảm xúc ${details.mood}, ${details.includeText ? "có chữ ngắn" : "không có chữ trong ảnh"}.`,
    [theme, style, details]
  );

  useEffect(() => {
    const saved = localStorage.getItem("ai-lab-images-gallery");
    if (saved) {
      try {
        setGallery(JSON.parse(saved));
      } catch {}
    }
  }, []);

  async function generate() {
    if (!session) {
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await api<GeneratedImage>("/api/images/generate", {
        method: "POST",
        body: JSON.stringify({
          sessionId: session.id,
          theme,
          style,
          details,
          ageGroup: "6-8",
        }),
      });
      setImage(result);

      // Save to gallery
      const updatedGallery = [
        result,
        ...gallery.filter((img) => img.imageId !== result.imageId),
      ].slice(0, 6);
      setGallery(updatedGallery);
      localStorage.setItem(
        "ai-lab-images-gallery",
        JSON.stringify(updatedGallery)
      );

      // Unlock the "Họa sĩ AI" sticker (unlockSticker notifies the sticker album UI)
      unlockSticker("artist");

      // Auto-scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Chưa tạo được tranh. Em thử chủ đề khác nhé."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleStory = () => {
    if (!image) {
      return;
    }
    navigate("/games/buddy-bot", {
      state: {
        storyPrompt: `Hãy kể một câu chuyện ngắn khoảng 4-6 câu thật vui vẻ, dễ thương và có bài học ý nghĩa về bức tranh này: ${image.promptUsed}`,
      },
    });
  };

  return (
    <GameShell
      instruction="Chọn các khối an toàn. Hình tạo ra luôn cần được ghi nhãn là hình AI."
      subtitle="Viết prompt vui vẻ để tạo tranh học tập cùng Buddy Bot!"
      title="Xưởng Tranh AI"
    >
      <div className="flex-1 space-y-8 pr-0 sm:space-y-10 sm:pr-1">
        <section className="grid items-start gap-5 lg:grid-cols-[380px_1fr] lg:gap-6">
          {/* Left: Builder controls */}
          <div className="lab-card space-y-5 p-4 sm:p-5">
            <ImageThemePicker onChange={setTheme} value={theme} />
            <ImageStylePicker onChange={setStyle} value={style} />
            <div>
              <h2 className="mb-2 font-black text-xl">Chi tiết</h2>
              <ImageDetailBuilder details={details} setDetails={setDetails} />
            </div>
          </div>

          {/* Right: Sticky panel — prompt + button + Showcase Canvas */}
          <aside className="flex flex-col space-y-4 lg:sticky lg:top-4">
            <ImagePromptPreview prompt={prompt} />
            <button
              className={`big-button w-full text-lg text-white shadow-md transition-all duration-300 ${
                loading
                  ? "cursor-not-allowed bg-muted/70"
                  : "bg-gradient-to-r from-purpleLab to-pinkLab hover:scale-101 hover:shadow-lg active:scale-99"
              }`}
              disabled={loading}
              onClick={() => void generate()}
              type="button"
            >
              {loading ? "⏳ Đang tạo tranh..." : "🎨 Tạo tranh AI"}
            </button>

            {/* The showcase canvas (takes center stage) */}
            <div className="flex-1" ref={resultRef}>
              <div className="lab-card relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-white/80 bg-white/95 p-4 shadow-2xl sm:min-h-[460px] sm:rounded-[2.5rem] sm:p-6">
                {image && !loading && !error ? (
                  <motion.article
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex w-full flex-col items-center space-y-5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Wooden-like Easel/Frame Outer Ring */}
                    <div className="group relative flex aspect-square w-full max-w-[480px] items-center justify-center overflow-hidden rounded-[1.5rem] border-[6px] border-yellowLab bg-cream/30 p-1 shadow-xl transition-transform duration-500 hover:scale-[1.01] sm:rounded-[2rem] sm:border-[8px]">
                      <img
                        alt="Tranh AI của em"
                        className="h-full w-full rounded-2xl object-cover shadow-inner transition-transform duration-75 group-hover:scale-101"
                        src={image.imageUrl}
                      />
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="flex select-none items-center gap-1 rounded-full border border-yellowLab/10 bg-yellowLab/95 px-3.5 py-2 font-black text-[10px] text-ink shadow-md backdrop-blur-xs">
                          ✨ Hình này được tạo bởi AI
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid w-full max-w-[480px] gap-3 pt-1 sm:grid-cols-2">
                      <a
                        className="big-button flex items-center justify-center gap-1.5 bg-skyLab py-3.5 text-sm text-white shadow-md transition-all hover:bg-skyLab/90 hover:shadow-lg"
                        download={true}
                        href={image.imageUrl}
                      >
                        <Download className="h-4.5 w-4.5" /> Tải xuống tranh
                      </a>
                      <button
                        className="big-button flex items-center justify-center gap-1.5 bg-purpleLab py-3.5 text-sm text-white shadow-md transition-all hover:bg-purpleLab/90 hover:shadow-lg"
                        onClick={handleStory}
                        type="button"
                      >
                        <BookOpen className="h-4.5 w-4.5" /> Kể câu chuyện
                      </button>
                    </div>
                  </motion.article>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center space-y-5 py-4 text-center">
                    <BuddyBot size={140} state="artist" />
                    <div className="space-y-1.5 px-4">
                      <h3 className="animate-pulse font-black text-ink text-xl">
                        🎨 Đang tô vẽ tranh...
                      </h3>
                      <p className="max-w-xs font-bold text-muted text-xs leading-relaxed">
                        Buddy Bot đang phối hợp màu sắc phép thuật cho bức vẽ
                        của em. Đợi xíu nhé!
                      </p>
                    </div>
                    <div className="relative h-3 w-56 overflow-hidden rounded-full border border-white/60 bg-white shadow-inner">
                      <motion.div
                        animate={{ width: "100%" }}
                        className="h-full rounded-full bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab"
                        initial={{ width: "0%" }}
                        transition={{ duration: 15, ease: "linear" }}
                      />
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex max-w-sm flex-col items-center justify-center space-y-4 px-4 py-6 text-center">
                    <BuddyBot size={120} state="warning" />
                    <SafetyRedirect text={error} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-5 px-4 py-6 text-center">
                    <BuddyBot size={140} state="artist" />
                    <div className="space-y-1.5">
                      <h3 className="font-black text-ink text-lg">
                        Bản thiết kế tranh của em
                      </h3>
                      <p className="max-w-xs font-bold text-muted text-xs leading-relaxed">
                        Chọn các chủ đề và màu sắc lấp lánh bên trái, rồi bấm
                        nút{" "}
                        <strong className="text-purpleLab">
                          🎨 Tạo tranh AI
                        </strong>{" "}
                        ở trên để vẽ tranh nhé!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>

        {gallery.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="flex items-center gap-2 border-white/50 border-b pb-2 font-black text-3xl text-ink">
              🖼️ Thư viện tranh đã tạo của em
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((img) => (
                <GeneratedImageCard image={img} key={img.imageId} />
              ))}
            </div>
          </section>
        )}
      </div>
    </GameShell>
  );
}
