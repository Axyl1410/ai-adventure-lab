import { useTranslation } from "react-i18next";
import type { LikeChip } from "../types";

interface FriendLikesChipsProps {
  likes: LikeChip[];
}

export function FriendLikesChips({ likes }: FriendLikesChipsProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="mb-5 flex flex-wrap justify-center gap-2">
      <span className="w-full font-bold text-muted text-sm">
        {t("aiRecommendations.recentLikesLabel")}
      </span>
      {likes.map((like) => (
        <span
          className="inline-flex items-center gap-1.5 rounded-2xl border border-skyLab/30 bg-skyLab/15 px-3 py-1.5 font-bold text-ink text-sm"
          key={`${like.emoji}-${like.labelKey}`}
        >
          <span aria-hidden>{like.emoji}</span>
          {like.label}
        </span>
      ))}
    </div>
  );
}
