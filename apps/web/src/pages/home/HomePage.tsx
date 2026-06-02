import { useState } from "react";
import { GameCard } from "./GameCard";
import { HomeHero } from "./HomeHero";
import { HomeHighlights } from "./HomeHighlights";
import { gameCards } from "./homeData";
import { StickerBookModal } from "./StickerBookModal";
import { useUnlockedStickers } from "./useUnlockedStickers";

export function HomePage() {
  const unlockedStickers = useUnlockedStickers();
  const [showStickerBook, setShowStickerBook] = useState(false);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:py-8">
      <HomeHero
        onOpenStickerBook={() => setShowStickerBook(true)}
        unlockedCount={unlockedStickers.length}
      />

      <HomeHighlights />

      <section className="mt-8" id="games">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-black text-purple-700 text-sm uppercase tracking-wide">
              Chọn một cuộc phiêu lưu
            </p>
            <h2 className="font-black text-3xl text-ink">
              Trò chơi AI có minh họa
            </h2>
          </div>
          <p className="max-w-xl font-bold text-muted text-sm leading-relaxed">
            Mỗi trò chơi có hình ảnh riêng để học sinh dễ nhận biết mục tiêu
            trước khi bắt đầu.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gameCards.map((card, index) => (
            <GameCard card={card} index={index} key={card.to} />
          ))}
        </div>
      </section>

      <StickerBookModal
        onClose={() => setShowStickerBook(false)}
        open={showStickerBook}
        unlockedStickers={unlockedStickers}
      />
    </main>
  );
}
