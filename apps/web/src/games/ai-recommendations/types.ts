export type RoundKind = "matchPattern" | "repeatOk" | "rejectPrivacy";

export interface LikeChipBase {
  emoji: string;
  labelKey: string;
}

export interface LikeChip extends LikeChipBase {
  label: string;
}

export interface RecommendationOptionBase {
  emoji: string;
  id: string;
  labelKey: string;
}

export interface RecommendationOption extends RecommendationOptionBase {
  label: string;
}

export interface RecommendationRoundBase {
  correctOptionId: string;
  friendEmoji: string;
  id: string;
  kind: RoundKind;
  options: RecommendationOptionBase[];
  recentLikes: LikeChipBase[];
}

export interface RecommendationRound extends RecommendationRoundBase {
  explain: string;
  friendLabel: string;
  options: RecommendationOption[];
  question: string;
  recentLikes: LikeChip[];
}
