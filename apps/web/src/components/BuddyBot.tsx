import { motion } from "motion/react";
import buddyBotArtist from "@/assets/mascot/buddy-bot-artist.svg";
import buddyBotCelebrating from "@/assets/mascot/buddy-bot-celebrating.png";
import buddyBotHappy from "@/assets/mascot/buddy-bot-happy.png";
import buddyBotReading from "@/assets/mascot/buddy-bot-reading.png";
import buddyBotThinking from "@/assets/mascot/buddy-bot-thinking.png";
import buddyBotWarning from "@/assets/mascot/buddy-bot-warning.png";

type BotState =
  | "happy"
  | "thinking"
  | "celebrating"
  | "warning"
  | "reading"
  | "artist";

const mascotImages: Record<BotState, string> = {
  happy: buddyBotHappy,
  thinking: buddyBotThinking,
  celebrating: buddyBotCelebrating,
  warning: buddyBotWarning,
  reading: buddyBotReading,
  artist: buddyBotArtist,
};

export function BuddyBot({
  state = "happy",
  size = 150,
}: {
  state?: BotState;
  size?: number;
}) {
  const imgSrc = mascotImages[state] || buddyBotHappy;

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      className="relative flex select-none items-center justify-center"
      style={{ width: size, height: size }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 3.5,
        ease: "easeInOut",
      }}
    >
      <img
        alt={`Buddy Bot - ${state}`}
        className="h-full w-full object-contain drop-shadow-xl"
        draggable={false}
        src={imgSrc}
      />
    </motion.div>
  );
}
