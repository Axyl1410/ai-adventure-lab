export type RoundKind = "matchPattern" | "repeatOk" | "rejectPrivacy";

export interface LikeChip {
  emoji: string;
  label: string;
}

export interface RecommendationOption {
  emoji: string;
  id: string;
  label: string;
}

export interface RecommendationRound {
  correctOptionId: string;
  explain: string;
  friendEmoji: string;
  friendLabel: string;
  id: string;
  kind: RoundKind;
  options: RecommendationOption[];
  question: string;
  recentLikes: LikeChip[];
}
