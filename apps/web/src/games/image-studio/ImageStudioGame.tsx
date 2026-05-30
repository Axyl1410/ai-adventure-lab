import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { GameShell } from "../../components/GameShell";
import { SafetyRedirect } from "../../components/Feedback";
import { api, unlockSticker } from "../../lib/api";
import { useSession } from "../../hooks/useSession";
import { BuddyBot } from "../../components/BuddyBot";
import { GeneratedImageCard, ImageDetailBuilder, ImagePromptPreview, ImageStylePicker, ImageThemePicker, themes, styles, type GeneratedImage, type ImageDetails } from "./ImageStudioComponents";

export function ImageStudioGame() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(themes[1]);
  const [style, setStyle] = useState(styles[0]);
  const [details, setDetails] = useState<ImageDetails>({ subject: "một robot thân thiện đang đọc sách", setting: "lớp học cầu vồng", colors: ["xanh da trời", "vàng"], mood: "vui vẻ", includeText: false });
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const prompt = useMemo(() => `Tạo ${style.toLowerCase()} về ${details.subject} trong ${details.setting}, chủ đề ${theme}, màu ${details.colors.join(", ")}, cảm xúc ${details.mood}, ${details.includeText ? "có chữ ngắn" : "không có chữ trong ảnh"}.`, [theme, style, details]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-lab-images-gallery");
    if (saved) {
      try {
        setGallery(JSON.parse(saved));
      } catch {}
    }
  }, []);

  async function generate() {
    if (!session) return;
    setError("");
    setLoading(true);
    try {
      const result = await api<GeneratedImage>("/api/images/generate", {
        method: "POST",
        body: JSON.stringify({ sessionId: session.id, theme, style, details, ageGroup: "6-8" })
      });
      setImage(result);
      
      // Save to gallery
      const updatedGallery = [result, ...gallery.filter(img => img.imageId !== result.imageId)].slice(0, 6);
      setGallery(updatedGallery);
      localStorage.setItem("ai-lab-images-gallery", JSON.stringify(updatedGallery));

      // Unlock "Họa sĩ AI" sticker (dùng unlockSticker để dispatch event cho Sổ Sticker)
      unlockSticker("artist");

      // Auto-scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chưa tạo được tranh. Em thử chủ đề khác nhé.");
    } finally {
      setLoading(false);
    }
  }

  const handleStory = () => {
    if (!image) return;
    navigate("/games/buddy-bot", {
      state: {
        storyPrompt: `Hãy kể một câu chuyện ngắn khoảng 4-6 câu thật vui vẻ, dễ thương và có bài học ý nghĩa về bức tranh này: ${image.promptUsed}`
      }
    });
  };

  return (
    <GameShell title="Xưởng Tranh AI" subtitle="Viết prompt vui vẻ để tạo tranh học tập cùng Buddy Bot!" instruction="Chọn các khối an toàn. Hình tạo ra luôn cần được ghi nhãn là hình AI.">
      <div className="flex-1 space-y-8 pr-0 sm:space-y-10 sm:pr-1">
        <section className="grid items-start gap-5 lg:grid-cols-[380px_1fr] lg:gap-6">
          {/* Left: Builder controls */}
          <div className="lab-card space-y-5 p-4 sm:p-5">
            <ImageThemePicker value={theme} onChange={setTheme} />
            <ImageStylePicker value={style} onChange={setStyle} />
            <div><h2 className="mb-2 text-xl font-black">Chi tiết</h2><ImageDetailBuilder details={details} setDetails={setDetails} /></div>
          </div>

          {/* Right: Sticky panel — prompt + button + Showcase Canvas */}
          <aside className="lg:sticky lg:top-4 space-y-4 flex flex-col">
            <ImagePromptPreview prompt={prompt} />
            <button 
              className={`big-button w-full text-white text-lg shadow-md transition-all duration-300 ${
                loading 
                  ? "bg-muted/70 cursor-not-allowed" 
                  : "bg-gradient-to-r from-purpleLab to-pinkLab hover:shadow-lg hover:scale-101 active:scale-99"
              }`}
              onClick={() => void generate()} 
              disabled={loading}
            >
              {loading ? "⏳ Đang tạo tranh..." : "🎨 Tạo tranh AI"}
            </button>
            
            {/* The showcase canvas (takes center stage) */}
            <div ref={resultRef} className="flex-1">
              <div className="lab-card relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-white/80 bg-white/95 p-4 shadow-2xl sm:min-h-[460px] sm:rounded-[2.5rem] sm:p-6">
                {image && !loading && !error ? (
                  <motion.article 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full flex flex-col items-center space-y-5"
                  >
                    {/* Wooden-like Easel/Frame Outer Ring */}
                    <div className="group relative flex aspect-square w-full max-w-[480px] items-center justify-center overflow-hidden rounded-[1.5rem] border-[6px] border-yellowLab bg-cream/30 p-1 shadow-xl transition-transform duration-500 hover:scale-[1.01] sm:rounded-[2rem] sm:border-[8px]">
                      <img 
                        className="w-full h-full object-cover rounded-2xl shadow-inner transition-transform duration-75 group-hover:scale-101" 
                        src={image.imageUrl} 
                        alt="Tranh AI của em" 
                      />
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="rounded-full bg-yellowLab/95 border border-yellowLab/10 px-3.5 py-2 text-[10px] font-black text-ink shadow-md flex items-center gap-1 backdrop-blur-xs select-none">
                          ✨ Hình này được tạo bởi AI
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid w-full max-w-[480px] gap-3 pt-1 sm:grid-cols-2">
                      <a 
                        className="big-button flex items-center justify-center gap-1.5 bg-skyLab py-3.5 text-sm text-white shadow-md transition-all hover:bg-skyLab/90 hover:shadow-lg" 
                        href={image.imageUrl} 
                        download
                      >
                        <Download className="h-4.5 w-4.5" /> Tải xuống tranh
                      </a>
                      <button 
                        className="big-button flex items-center justify-center gap-1.5 bg-purpleLab py-3.5 text-sm text-white shadow-md transition-all hover:bg-purpleLab/90 hover:shadow-lg"
                        onClick={handleStory}
                      >
                        <BookOpen className="h-4.5 w-4.5" /> Kể câu chuyện
                      </button>
                    </div>
                  </motion.article>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center space-y-5 py-4 text-center">
                    <BuddyBot state="thinking" size={140} />
                    <div className="space-y-1.5 px-4">
                      <h3 className="text-xl font-black text-ink animate-pulse">🎨 Đang tô vẽ tranh...</h3>
                      <p className="text-xs font-bold text-muted max-w-xs leading-relaxed">
                        Buddy Bot đang phối hợp màu sắc phép thuật cho bức vẽ của em. Đợi xíu nhé!
                      </p>
                    </div>
                    <div className="w-56 h-3 rounded-full bg-white border border-white/60 shadow-inner overflow-hidden relative">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 15, ease: "linear" }}
                      />
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center max-w-sm px-4">
                    <BuddyBot state="warning" size={120} />
                    <SafetyRedirect text={error} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-5 py-6 text-center px-4">
                    <BuddyBot state="happy" size={140} />
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-ink">Bản thiết kế tranh của em</h3>
                      <p className="text-xs font-bold text-muted max-w-xs leading-relaxed">
                        Chọn các chủ đề và màu sắc lấp lánh bên trái, rồi bấm nút <strong className="text-purpleLab">🎨 Tạo tranh AI</strong> ở trên để vẽ tranh nhé!
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
            <h2 className="text-3xl font-black text-ink flex items-center gap-2 border-b border-white/50 pb-2">
              🖼️ Thư viện tranh đã tạo của em
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((img) => (
                <GeneratedImageCard key={img.imageId} image={img} />
              ))}
            </div>
          </section>
        )}
      </div>
    </GameShell>
  );
}
