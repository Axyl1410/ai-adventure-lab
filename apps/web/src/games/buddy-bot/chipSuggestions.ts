import type { BuddyChipGroup } from "./constants";

interface ChipGroupConfig {
  group: BuddyChipGroup;
  keywords: {
    en: string[];
    vi: string[];
  };
}

const CHIP_GROUPS: ChipGroupConfig[] = [
  {
    group: "story",
    keywords: {
      vi: ["chuyện", "kể"],
      en: ["story", "tell"],
    },
  },
  {
    group: "math",
    keywords: {
      vi: ["toán", "đố", "câu đố"],
      en: ["math", "puzzle", "quiz"],
    },
  },
  {
    group: "ai_topic",
    keywords: {
      vi: ["ai", "trí tuệ nhân tạo", "máy học"],
      en: ["ai", "artificial intelligence", "machine learning", "ml"],
    },
  },
  {
    group: "prompt_topic",
    keywords: {
      vi: ["prompt", "câu lệnh", "tranh", "vẽ"],
      en: ["prompt", "command", "picture", "draw", "image"],
    },
  },
];

const GROUP_CHIP_IDS: Record<BuddyChipGroup, string[]> = {
  default: [
    "what_is_ai",
    "what_is_prompt",
    "what_is_ml",
    "why_ai_wrong",
    "math_quiz",
    "fruit_example",
  ],
  story: ["continue_story", "story_lesson", "ai_writes_stories", "back_to_lab"],
  math: ["harder_quiz", "give_hint", "fruit_visual", "bot_solves_math"],
  ai_topic: [
    "how_to_teach_ai",
    "why_ai_guesses_wrong",
    "phone_has_ai",
    "how_ai_draws",
  ],
  prompt_topic: [
    "image_prompt_tips",
    "image_safety",
    "fix_my_prompt",
    "go_image_studio",
  ],
  fallback: ["how_do_you_learn", "easy_example", "ai_emotions", "fun_math"],
};

function matchesKeywords(text: string, keywords: string[]) {
  const lowerText = text.toLowerCase();
  return keywords.some((keyword) => lowerText.includes(keyword));
}

/** Suggest follow-up chip IDs from keywords in the user's message */
export function getFollowUpChipIds(userText: string): string[] {
  const lowerText = userText.toLowerCase();

  for (const config of CHIP_GROUPS) {
    if (
      matchesKeywords(lowerText, config.keywords.vi) ||
      matchesKeywords(lowerText, config.keywords.en)
    ) {
      return GROUP_CHIP_IDS[config.group];
    }
  }

  return GROUP_CHIP_IDS.fallback;
}

export function getDefaultChipIds(): string[] {
  return GROUP_CHIP_IDS.default;
}

export function chipTranslationKey(group: BuddyChipGroup, chipId: string) {
  return `buddyBot.chips.${group}.${chipId}`;
}

export function resolveChipGroup(chipId: string): BuddyChipGroup {
  for (const [group, ids] of Object.entries(GROUP_CHIP_IDS) as [
    BuddyChipGroup,
    string[],
  ][]) {
    if (ids.includes(chipId)) {
      return group;
    }
  }
  return "default";
}
