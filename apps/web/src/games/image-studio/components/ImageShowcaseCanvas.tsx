import { BookOpen, Download } from "lucide-react";
import { motion } from "motion/react";
import type { Ref } from "react";
import { BuddyBot } from "@/components/BuddyBot";
import { SafetyRedirect } from "@/components/Feedback";
import type { GeneratedImage } from "../types";

interface ImageShowcaseCanvasProps {
  error: string;
  image: GeneratedImage | null;
  loading: boolean;
  onStory: () => void;
  resultRef: Ref<HTMLDivElement>;
}

export function ImageShowcaseCanvas({
  error,
  image,
  loading,
  onStory,
  resultRef,
}: ImageShowcaseCanvasProps) {
  return (
    <div className="flex-1" ref={resultRef}>
      <div className="lab-card relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-white/80 bg-white/95 p-4 shadow-2xl sm:min-h-[460px] sm:rounded-[2.5rem] sm:p-6">
        {image && !loading && !error ? (
          <motion.article
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full flex-col items-center space-y-5"
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
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
                onClick={onStory}
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
                Buddy Bot đang phối hợp màu sắc phép thuật cho bức vẽ của em.
                Đợi xíu nhé!
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
                Chọn các chủ đề và màu sắc lấp lánh bên trái, rồi bấm nút{" "}
                <strong className="text-purpleLab">🎨 Tạo tranh AI</strong> ở
                trên để vẽ tranh nhé!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
