import { Sparkles } from "lucide-react";
import { TTSButton } from "@/components/TTSButton";
import type { RecommendationRound } from "../types";
import { FriendLikesChips } from "./FriendLikesChips";

interface RoundPromptProps {
  deckLength: number;
  index: number;
  round: RecommendationRound;
}

export function RoundPrompt({ deckLength, index, round }: RoundPromptProps) {
  const ttsText = `${round.friendLabel} ${round.recentLikes.map((like) => like.label).join(", ")}. ${round.question}`;

  return (
    <>
      <p className="mb-3 font-black text-muted text-sm">
        Gợi ý {index + 1} / {deckLength}
      </p>
      <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-purpleLab/15 text-5xl shadow-sm">
        {round.friendEmoji}
      </div>
      <p className="mb-4 font-black text-ink text-xl">{round.friendLabel}</p>
      <FriendLikesChips likes={round.recentLikes} />
      <div className="mb-6 flex items-center justify-center gap-3 rounded-3xl border border-purpleLab/20 bg-cream/70 p-5">
        <Sparkles className="h-7 w-7 shrink-0 text-purpleLab" />
        <p className="font-black text-ink text-lg leading-relaxed">
          {round.question}
        </p>
        <TTSButton
          autoPlay={true}
          autoPlayRole="content"
          compact={true}
          text={ttsText}
        />
      </div>
    </>
  );
}
