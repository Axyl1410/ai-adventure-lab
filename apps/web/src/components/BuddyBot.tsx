import { motion } from "framer-motion";
import buddyBotHappy from "../assets/mascot/buddy-bot-happy.png";
import buddyBotWarning from "../assets/mascot/buddy-bot-warning.png";
import buddyBotCelebrating from "../assets/mascot/buddy-bot-celebrating.png";
import buddyBotThinking from "../assets/mascot/buddy-bot-thinking.png";
import buddyBotReading from "../assets/mascot/buddy-bot-reading.png";

type BotState = "happy" | "thinking" | "celebrating" | "warning" | "reading";

const mascotImages: Record<BotState, string> = {
	happy: buddyBotHappy,
	thinking: buddyBotThinking,
	celebrating: buddyBotCelebrating,
	warning: buddyBotWarning,
	reading: buddyBotReading,
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
			style={{ width: size, height: size }}
			className="relative flex items-center justify-center select-none"
			animate={{ y: [0, -10, 0] }}
			transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
		>
			<img
				src={imgSrc}
				alt={`Buddy Bot - ${state}`}
				className="h-full w-full object-contain drop-shadow-xl"
				draggable={false}
			/>
		</motion.div>
	);
}
