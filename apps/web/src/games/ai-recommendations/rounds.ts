import type { RecommendationRoundBase } from "./types";

export const ALL_ROUNDS: RecommendationRoundBase[] = [
  {
    id: "round-1",
    friendEmoji: "🐻",
    recentLikes: [
      { emoji: "🔍", labelKey: "detective" },
      { emoji: "🤔", labelKey: "oops" },
    ],
    options: [
      { id: "detective", emoji: "🔍", labelKey: "detective" },
      { id: "image-studio", emoji: "🎨", labelKey: "image_studio" },
      { id: "ask-school", emoji: "🏫", labelKey: "ask_school" },
      { id: "teach-robot", emoji: "🤖", labelKey: "teach_robot" },
    ],
    correctOptionId: "detective",
    kind: "matchPattern",
  },
  {
    id: "round-2",
    friendEmoji: "⭐",
    recentLikes: [
      { emoji: "🎨", labelKey: "image_studio" },
      { emoji: "✨", labelKey: "prompt" },
    ],
    options: [
      { id: "image-studio", emoji: "🎨", labelKey: "image_studio" },
      { id: "detective", emoji: "🔍", labelKey: "detective" },
      { id: "data-sorter", emoji: "🗂️", labelKey: "data_sorter" },
      { id: "teachable", emoji: "📷", labelKey: "teachable" },
    ],
    correctOptionId: "image-studio",
    kind: "matchPattern",
  },
  {
    id: "round-3",
    friendEmoji: "🤖",
    recentLikes: [
      { emoji: "🧠", labelKey: "teach_robot" },
      { emoji: "📷", labelKey: "teachable" },
    ],
    options: [
      { id: "teach-robot", emoji: "🧠", labelKey: "teach_robot" },
      { id: "buddy-bot", emoji: "💬", labelKey: "buddy_bot" },
      { id: "oops", emoji: "🤔", labelKey: "oops" },
      { id: "safety", emoji: "🛡️", labelKey: "safety" },
    ],
    correctOptionId: "teach-robot",
    kind: "matchPattern",
  },
  {
    id: "round-4",
    friendEmoji: "🐻",
    recentLikes: [{ emoji: "🧭", labelKey: "commands" }],
    options: [
      { id: "repeat-commands", emoji: "🧭", labelKey: "repeat_commands" },
      { id: "image-studio", emoji: "🎨", labelKey: "image_studio" },
      { id: "detective", emoji: "🔍", labelKey: "detective" },
      { id: "ask-address", emoji: "🏠", labelKey: "ask_address" },
    ],
    correctOptionId: "repeat-commands",
    kind: "repeatOk",
  },
  {
    id: "round-5",
    friendEmoji: "⭐",
    recentLikes: [
      { emoji: "🗂️", labelKey: "data_sorter" },
      { emoji: "🛡️", labelKey: "safety" },
    ],
    options: [
      { id: "safety", emoji: "🛡️", labelKey: "safety" },
      { id: "image-studio", emoji: "🎨", labelKey: "image_studio" },
      { id: "prompt", emoji: "✨", labelKey: "prompt" },
      { id: "teachable", emoji: "📷", labelKey: "teachable" },
    ],
    correctOptionId: "safety",
    kind: "matchPattern",
  },
  {
    id: "round-6",
    friendEmoji: "🤖",
    recentLikes: [{ emoji: "💬", labelKey: "buddy_bot" }],
    options: [
      { id: "buddy-bot", emoji: "💬", labelKey: "buddy_bot" },
      { id: "ask-phone", emoji: "📱", labelKey: "ask_phone" },
      { id: "detective", emoji: "🔍", labelKey: "detective" },
      { id: "commands", emoji: "🧭", labelKey: "commands" },
    ],
    correctOptionId: "buddy-bot",
    kind: "matchPattern",
  },
  {
    id: "round-7",
    friendEmoji: "🐻",
    recentLikes: [{ emoji: "✨", labelKey: "prompt" }],
    options: [
      { id: "prompt", emoji: "✨", labelKey: "prompt" },
      { id: "teachable", emoji: "📷", labelKey: "teachable" },
      { id: "data-sorter", emoji: "🗂️", labelKey: "data_sorter" },
      { id: "oops", emoji: "🤔", labelKey: "oops" },
    ],
    correctOptionId: "prompt",
    kind: "matchPattern",
  },
  {
    id: "round-8",
    friendEmoji: "⭐",
    recentLikes: [
      { emoji: "🎨", labelKey: "image_studio" },
      { emoji: "✨", labelKey: "prompt" },
    ],
    options: [
      { id: "watch-history", emoji: "👀", labelKey: "watch_history" },
      { id: "ask-address", emoji: "🏠", labelKey: "ask_address" },
      { id: "repeat-fav", emoji: "🔁", labelKey: "repeat_fav" },
      { id: "similar", emoji: "🎯", labelKey: "similar" },
    ],
    correctOptionId: "ask-address",
    kind: "rejectPrivacy",
  },
];
