import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GameCard } from "./GameCard";
import { HomeHero } from "./HomeHero";
import { HomeHighlights } from "./HomeHighlights";
import { useGameCards, useStickers } from "./homeData";
import { StickerBookModal } from "./StickerBookModal";
import { useUnlockedStickers } from "./useUnlockedStickers";

export function HomePage() {
  const { t } = useTranslation("home");
  const gameCards = useGameCards();
  const stickers = useStickers();
  const unlockedStickers = useUnlockedStickers();
  const [showStickerBook, setShowStickerBook] = useState(false);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:py-8">
      <HomeHero
        onOpenStickerBook={() => setShowStickerBook(true)}
        stickerTotal={stickers.length}
        unlockedCount={unlockedStickers.length}
      />

      <HomeHighlights />

      <section className="mt-8" id="games">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-black text-purple-700 text-sm uppercase tracking-wide">
              {t("gamesSection.eyebrow")}
            </p>
            <h2 className="font-black text-3xl text-ink">
              {t("gamesSection.title")}
            </h2>
          </div>
          <p className="max-w-xl font-bold text-muted text-sm leading-relaxed">
            {t("gamesSection.description")}
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
        stickers={stickers}
        unlockedStickers={unlockedStickers}
      />
    </main>
  );
}
