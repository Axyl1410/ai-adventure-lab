import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bot,
  BrainCircuit,
  Camera,
  Database,
  ImageIcon,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import detectiveBanner from "@/assets/detective-banner.png";
import buddyReading from "@/assets/mascot/buddy-bot-reading.png";
import oopsBanner from "@/assets/oops-banner.png";
import robotLab from "@/assets/robot-lab.png";
import stickerArtist from "@/assets/stickers/sticker-artist.png";
import stickerDetective from "@/assets/stickers/sticker-detective.png";
import stickerOops from "@/assets/stickers/sticker-oops.png";
import stickerPrompt from "@/assets/stickers/sticker-prompt.png";
import stickerRobot from "@/assets/stickers/sticker-robot.png";

export type StickerId =
  | "detective"
  | "robot"
  | "oops"
  | "prompt"
  | "artist"
  | "commander"
  | "curator";

export type GameCardId =
  | "aiDetective"
  | "teachRobot"
  | "teachableMachine"
  | "promptMagic"
  | "oopsAiMistake"
  | "buddyBot"
  | "imageStudio"
  | "dataSorter"
  | "aiSafetyQuest"
  | "robotCommands"
  | "aiRecommendations";

export type StickerConfig = {
  id: StickerId;
  name: string;
  image: string;
  hint: string;
};

export type GameCardConfig = {
  id: GameCardId;
  title: string;
  desc: string;
  badge: string;
  time: string;
  to: string;
  image: string;
  alt: string;
  icon: LucideIcon;
  color: string;
  imageTone: string;
};

/** Static sticker assets — ids must match unlockSticker() in games. */
export const STICKER_IDS: StickerId[] = [
  "detective",
  "robot",
  "oops",
  "prompt",
  "artist",
  "commander",
  "curator",
];

const STICKER_IMAGES: Record<StickerId, string> = {
  detective: stickerDetective,
  robot: stickerRobot,
  oops: stickerOops,
  prompt: stickerPrompt,
  artist: stickerArtist,
  commander: stickerRobot,
  curator: stickerPrompt,
};

const GAME_CARD_STATIC: Omit<
  GameCardConfig,
  "title" | "desc" | "badge" | "time" | "alt"
>[] = [
  {
    id: "aiDetective",
    to: "/games/ai-detective",
    image: detectiveBanner,
    icon: Search,
    color: "from-skyLab to-blueLab",
    imageTone: "bg-skyLab/15",
  },
  {
    id: "teachRobot",
    to: "/games/teach-the-robot",
    image: stickerRobot,
    icon: BrainCircuit,
    color: "from-greenLab to-mintLab",
    imageTone: "bg-greenLab/15",
  },
  {
    id: "teachableMachine",
    to: "/games/teachable-machine",
    image: robotLab,
    icon: Camera,
    color: "from-purpleLab to-pinkLab",
    imageTone: "bg-purpleLab/15",
  },
  {
    id: "promptMagic",
    to: "/games/prompt-magic",
    image: stickerPrompt,
    icon: Wand2,
    color: "from-yellowLab to-orangeLab",
    imageTone: "bg-yellowLab/20",
  },
  {
    id: "oopsAiMistake",
    to: "/games/oops-ai-mistake",
    image: oopsBanner,
    icon: BadgeCheck,
    color: "from-redSoft to-orangeLab",
    imageTone: "bg-redSoft/15",
  },
  {
    id: "buddyBot",
    to: "/games/buddy-bot",
    image: buddyReading,
    icon: MessageCircle,
    color: "from-blueLab to-purpleLab",
    imageTone: "bg-blueLab/15",
  },
  {
    id: "imageStudio",
    to: "/games/image-studio",
    image: stickerArtist,
    icon: ImageIcon,
    color: "from-pinkLab to-yellowLab",
    imageTone: "bg-pinkLab/15",
  },
  {
    id: "dataSorter",
    to: "/games/data-sorter",
    image: stickerRobot,
    icon: Database,
    color: "from-greenLab to-skyLab",
    imageTone: "bg-greenLab/15",
  },
  {
    id: "aiSafetyQuest",
    to: "/games/ai-safety-quest",
    image: oopsBanner,
    icon: ShieldCheck,
    color: "from-mintLab to-greenLab",
    imageTone: "bg-greenLab/15",
  },
  {
    id: "robotCommands",
    to: "/games/robot-commands",
    image: robotLab,
    icon: Bot,
    color: "from-skyLab to-mintLab",
    imageTone: "bg-skyLab/15",
  },
  {
    id: "aiRecommendations",
    to: "/games/ai-recommendations",
    image: stickerPrompt,
    icon: Sparkles,
    color: "from-purpleLab to-pinkLab",
    imageTone: "bg-purpleLab/15",
  },
];

/** @deprecated Use useStickers() for translated copy. Kept for sticker id sync. */
export const STICKERS = STICKER_IDS.map((id) => ({
  id,
  image: STICKER_IMAGES[id],
  name: "",
  hint: "",
}));

export function useStickers(): StickerConfig[] {
  const { t } = useTranslation("home");

  return STICKER_IDS.map((id) => ({
    id,
    image: STICKER_IMAGES[id],
    name: t(`stickers.${id}.name`),
    hint: t(`stickers.${id}.hint`),
  }));
}

export function useGameCards(): GameCardConfig[] {
  const { t } = useTranslation("home");

  return GAME_CARD_STATIC.map((card) => ({
    ...card,
    title: t(`gameCards.${card.id}.title`),
    desc: t(`gameCards.${card.id}.desc`),
    badge: t(`gameCards.${card.id}.badge`),
    time: t(`gameCards.${card.id}.time`),
    alt: t(`gameCards.${card.id}.alt`),
  }));
}

export function useQuickStats() {
  const { t } = useTranslation("home");

  return [
    {
      label: t("stats.games"),
      value: String(GAME_CARD_STATIC.length),
      tone: "bg-skyLab/15 text-sky-700",
    },
    {
      label: t("stats.stickers"),
      value: String(STICKER_IDS.length),
      tone: "bg-yellowLab/25 text-orange-700",
    },
    {
      label: t("stats.noAccount"),
      value: t("stats.noAccountValue"),
      tone: "bg-greenLab/20 text-green-700",
    },
  ] as const;
}

/** @deprecated Use useGameCards() for translated cards. */
export const gameCards: GameCardConfig[] = [];

/** @deprecated Use useQuickStats(). */
export const quickStats = [] as const;

export { STICKER_IDS as STICKER_COUNT_SOURCE };
