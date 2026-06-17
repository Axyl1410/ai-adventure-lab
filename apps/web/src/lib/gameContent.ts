import type { TFunction } from "i18next";
import type { DetectiveQuestion } from "@/games/ai-detective/types";
import type {
  RecommendationRound,
  RecommendationRoundBase,
} from "@/games/ai-recommendations/types";
import type { Scenario } from "@/games/ai-safety-quest/types";
import type { SorterCard } from "@/games/data-sorter/types";
import type { OopsQuestion } from "@/games/oops-ai-mistake/types";
import type { Puzzle, PuzzleBase } from "@/games/robot-commands/types";
import type { Item, ItemBase } from "@/games/teach-the-robot/types";

type ContentT = TFunction<"gameContent">;

export function buildFeedback(
  t: ContentT,
  correct: boolean,
  explain: string,
  correctKey: string,
  wrongKey: string
): string {
  const prefix = t(
    (correct ? correctKey : wrongKey) as Parameters<ContentT>[0]
  );
  return `${prefix} ${explain}`;
}

export function localizeDetectiveQuestion(
  t: ContentT,
  q: { id: string; emoji: string; answer: boolean }
): DetectiveQuestion {
  return {
    id: q.id,
    emoji: q.emoji,
    answer: q.answer,
    text: t(`aiDetective.questions.${q.id}.text`),
    explain: t(`aiDetective.questions.${q.id}.explain`),
  };
}

export function localizeOopsQuestion(
  t: ContentT,
  q: { id: string; answer: OopsQuestion["answer"] }
): OopsQuestion {
  return {
    id: q.id,
    answer: q.answer,
    text: t(`oopsAi.questions.${q.id}.text`),
    explain: t(`oopsAi.questions.${q.id}.explain`),
  };
}

export function localizeSorterCard(
  t: ContentT,
  card: { id: string; emoji: string; category: SorterCard["category"] }
): SorterCard {
  return {
    id: card.id,
    emoji: card.emoji,
    category: card.category,
    text: t(`dataSorter.items.${card.id}.text`),
    explain: t(`dataSorter.items.${card.id}.explain`),
  };
}

export function localizeScenario(
  t: ContentT,
  s: { id: string; emoji: string; answer: Scenario["answer"] }
): Scenario {
  return {
    id: s.id,
    emoji: s.emoji,
    answer: s.answer,
    text: t(`aiSafety.scenarios.${s.id}.text`),
    explain: t(`aiSafety.scenarios.${s.id}.explain`),
  };
}

export function localizeTeachItem(t: ContentT, item: ItemBase): Item {
  const base = {
    id: item.id,
    icon: item.icon,
    group: item.group,
    label: t(`teachRobot.items.${item.id}.label`),
  };
  const hintKey = `teachRobot.items.${item.id}.hint`;
  const hint = t(hintKey, { defaultValue: "" });
  return hint ? { ...base, hint } : base;
}

export function localizePuzzle(t: ContentT, puzzle: PuzzleBase): Puzzle {
  const key = puzzle.id.replace("-", "_");
  return {
    ...puzzle,
    title: t(`robotCommands.puzzles.${key}.title`),
    hint: t(`robotCommands.puzzles.${key}.hint`),
  };
}

export function localizeRound(
  t: ContentT,
  round: RecommendationRoundBase
): RecommendationRound {
  const roundKey = round.id.replace("-", "_");
  return {
    ...round,
    friendLabel: t(`aiRecommendations.rounds.${roundKey}.friendLabel`),
    question: t(`aiRecommendations.rounds.${roundKey}.question`),
    explain: t(`aiRecommendations.rounds.${roundKey}.explain`),
    recentLikes: round.recentLikes.map((like) => ({
      ...like,
      label: t(`aiRecommendations.gameLabels.${like.labelKey}`),
    })),
    options: round.options.map((opt) => ({
      ...opt,
      label: t(`aiRecommendations.gameLabels.${opt.labelKey}`),
    })),
  };
}

export function verdictLabel(t: ContentT, verdict: OopsQuestion["answer"]) {
  const map = {
    correct: "shared.verdicts.correct",
    wrong: "shared.verdicts.wrong",
    needs_check: "shared.verdicts.checkMore",
  } as const;
  return t(map[verdict]);
}

export function categoryLabel(t: ContentT, category: SorterCard["category"]) {
  const map = {
    good: "shared.categories.goodData",
    noisy: "shared.categories.noisyData",
    private: "shared.categories.privateInfo",
  } as const;
  return t(map[category]);
}

export function choiceLabel(t: ContentT, choice: Scenario["answer"]) {
  const map = {
    do_it: "shared.verdicts.shouldDo",
    dont: "shared.verdicts.shouldNot",
    ask_adult: "shared.verdicts.askAdult",
  } as const;
  return t(map[choice]);
}

export function groupLabel(t: ContentT, group: Item["group"]) {
  const map = {
    animals: "shared.groups.animals",
    fruit: "shared.groups.fruit",
    toys: "shared.groups.toys",
  } as const;
  return t(map[group]);
}

export function commandLabel(
  t: ContentT,
  command: "forward1" | "forward2" | "turnRight" | "turnLeft" | "pick"
) {
  return t(`robotCommands.commands.${command}`);
}

export function imageThemeLabel(t: ContentT, themeId: string) {
  return t(`imageStudio.themes.${themeId}`);
}

export function imageStyleLabel(t: ContentT, styleId: string) {
  return t(`imageStudio.styles.${styleId}`);
}

export function imageSubjectLabel(t: ContentT, subjectId: string) {
  return t(`imageStudio.subjects.${subjectId}.label`);
}

export function imageSubjectValue(t: ContentT, subjectId: string) {
  return t(`imageStudio.subjects.${subjectId}.value`);
}

export function imageSettingLabel(t: ContentT, settingId: string) {
  return t(`imageStudio.settings.${settingId}.label`);
}

export function imageSettingValue(t: ContentT, settingId: string) {
  return t(`imageStudio.settings.${settingId}.value`);
}

export function imageColorLabel(t: ContentT, colorId: string) {
  return t(`imageStudio.colors.${colorId}`);
}

export function imageMoodLabel(t: ContentT, moodId: string) {
  return t(`imageStudio.moods.${moodId}`);
}

export function resolveImageDetails(
  t: ContentT,
  details: {
    subjectId: string;
    subject: string;
    settingId: string;
    setting: string;
  }
) {
  return {
    subject:
      details.subjectId === "custom"
        ? details.subject
        : imageSubjectValue(t, details.subjectId),
    setting:
      details.settingId === "custom"
        ? details.setting
        : imageSettingValue(t, details.settingId),
  };
}
