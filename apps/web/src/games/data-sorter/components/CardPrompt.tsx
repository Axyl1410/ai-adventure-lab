import { Database } from "lucide-react";
import { TTSButton } from "../../../components/TTSButton";
import type { SorterCard } from "../types";

interface CardPromptProps {
  card: SorterCard;
  deckLength: number;
  index: number;
}

export function CardPrompt({ card, deckLength, index }: CardPromptProps) {
  return (
    <>
      <p aria-live="polite" className="mb-3 font-black text-muted text-sm">
        📋 Thẻ {index + 1} / {deckLength}
      </p>
      <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-skyLab/15 text-6xl shadow-sm">
        {card.emoji}
      </div>
      <div className="mb-7 flex items-center justify-center gap-3 rounded-3xl border border-yellowLab/20 bg-cream/70 p-5">
        <Database className="h-8 w-8 text-purpleLab" />
        <p className="font-black text-2xl text-ink leading-relaxed">
          {card.text}
        </p>
        <TTSButton
          autoPlay={true}
          autoPlayRole="content"
          compact={true}
          text={card.text}
        />
      </div>
    </>
  );
}
