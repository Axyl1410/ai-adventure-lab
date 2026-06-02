import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { STICKERS } from "./homeData";

export function StickerBookModal({
  open,
  unlockedStickers,
  onClose,
}: {
  open: boolean;
  unlockedStickers: string[];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Đóng sổ sticker"
            className="fixed inset-0 cursor-default bg-ink/40 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />

          <motion.div
            animate={{ scale: 1, y: 0, opacity: 1 }}
            aria-labelledby="sticker-book-title"
            aria-modal="true"
            className="relative z-10 flex max-h-[90dvh] w-full max-w-4xl flex-col rounded-3xl border border-white/70 bg-white p-6 shadow-2xl md:p-8"
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            role="dialog"
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <button
              aria-label="Đóng sổ sticker"
              className="absolute top-4 right-4 z-20 rounded-2xl px-3 py-2 font-black text-2xl text-muted hover:bg-cream hover:text-ink focus:outline-none focus:ring-4 focus:ring-skyLab/30"
              onClick={onClose}
              type="button"
            >
              ×
            </button>

            <div className="shrink-0 pr-10">
              <h2
                className="flex items-center gap-2 border-cream border-b pb-3 font-black text-2xl text-ink"
                id="sticker-book-title"
              >
                <Trophy className="h-7 w-7 text-orange-500" /> Sổ thu thập
                Sticker Buddy Bot
              </h2>
              <p className="mt-2 font-bold text-muted text-sm">
                Chơi các trò chơi và hoàn thành thử thách để thu thập trọn bộ
                sticker Buddy Bot.
              </p>
            </div>

            <div className="sticker-book-scroll mt-6 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-0.5 md:flex-none md:overflow-visible">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
                {STICKERS.map((sticker) => {
                  const isUnlocked = unlockedStickers.includes(sticker.id);
                  return (
                    <div
                      className={`flex flex-col items-center justify-between rounded-2xl border-2 p-4 text-center transition-[transform,box-shadow,border-color] duration-300 ${
                        isUnlocked
                          ? "border-yellowLab bg-gradient-to-br from-yellowLab/20 to-orangeLab/25 shadow-sm hover:-translate-y-1 hover:border-yellowLab hover:shadow-md"
                          : "border-white/70 bg-cream/45 opacity-80 hover:border-skyLab/35"
                      }`}
                      key={sticker.id}
                    >
                      <div className="relative mb-3 flex h-20 w-20 items-center justify-center">
                        <img
                          alt={sticker.name}
                          className={`h-full w-full object-contain transition-all duration-300 ${
                            isUnlocked
                              ? "drop-shadow-md"
                              : "opacity-40 blur-[0.5px] grayscale"
                          }`}
                          src={sticker.image}
                        />
                        {!isUnlocked && (
                          <span
                            aria-label="locked"
                            className="absolute text-lg"
                            role="img"
                          >
                            🔒
                          </span>
                        )}
                      </div>
                      <div>
                        <h3
                          className={`font-black text-base ${isUnlocked ? "text-ink" : "text-muted"}`}
                        >
                          {sticker.name}
                        </h3>
                        <p className="mt-1 font-semibold text-muted/80 text-xs">
                          {isUnlocked ? "Đã mở khóa!" : sticker.hint}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
