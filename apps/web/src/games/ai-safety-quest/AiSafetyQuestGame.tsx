import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Award } from "lucide-react";
import { GameShell } from "../../components/GameShell";
import {
	HappyFeedback,
	TryAgainFeedback,
	ConfettiSuccess,
} from "../../components/Feedback";
import { TTSButton } from "../../components/TTSButton";
import { saveProgress, unlockSticker } from "../../lib/api";
import { useSession } from "../../hooks/useSession";

type Choice = "Nên làm" | "Không nên" | "Hỏi người lớn";

interface Scenario {
	emoji: string;
	text: string;
	answer: Choice;
	explain: string;
}

const scenarios: Scenario[] = [
	{
		emoji: "🔐",
		text: "AI hỏi mật khẩu tài khoản học tập của em.",
		answer: "Không nên",
		explain: "Mật khẩu là bí mật. Không chia sẻ cho AI hoặc người lạ.",
	},
	{
		emoji: "📚",
		text: "Em nhờ AI giải thích bài khoa học bằng 3 ý ngắn.",
		answer: "Nên làm",
		explain: "Đây là cách dùng AI hỗ trợ học tập an toàn.",
	},
	{
		emoji: "🏥",
		text: "AI khuyên uống thuốc khi em bị đau bụng.",
		answer: "Hỏi người lớn",
		explain: "Thông tin sức khỏe cần hỏi bố mẹ, thầy cô hoặc bác sĩ.",
	},
	{
		emoji: "🖼️",
		text: "Em muốn tạo tranh robot trong lớp học và ghi nhãn là hình AI.",
		answer: "Nên làm",
		explain: "Tạo tranh an toàn và ghi nhãn rõ ràng là thói quen tốt.",
	},
	{
		emoji: "🏠",
		text: "AI yêu cầu em nhập địa chỉ nhà để kể chuyện hay hơn.",
		answer: "Không nên",
		explain: "Địa chỉ nhà là thông tin riêng tư.",
	},
	{
		emoji: "📰",
		text: "AI nói một tin lạ trên mạng là đúng 100%.",
		answer: "Hỏi người lớn",
		explain: "Tin lạ cần kiểm tra với nguồn đáng tin cậy và người lớn.",
	},
	{
		emoji: "🧠",
		text: "Em hỏi AI: Vì sao AI có thể sai?",
		answer: "Nên làm",
		explain: "Học cách hiểu giới hạn của AI giúp em dùng AI thông minh hơn.",
	},
	{
		emoji: "👤",
		text: "Em tải ảnh mặt thật của bạn lên để AI chỉnh sửa.",
		answer: "Không nên",
		explain: "Ảnh người thật cần được đồng ý và bảo vệ riêng tư.",
	},
];

const choices: Choice[] = ["Nên làm", "Không nên", "Hỏi người lớn"];

const choiceStyle: Record<Choice, { emoji: string; className: string }> = {
	"Nên làm": { emoji: "✅", className: "from-greenLab to-mintLab text-ink" },
	"Không nên": { emoji: "🛑", className: "from-redSoft to-pinkLab text-ink" },
	"Hỏi người lớn": {
		emoji: "🙋",
		className: "from-yellowLab to-orangeLab text-ink",
	},
};

export function AiSafetyQuestGame() {
	const { session } = useSession();
	const [deck, setDeck] = useState<Scenario[]>([]);
	const [index, setIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [done, setDone] = useState(false);

	useEffect(() => {
		setDeck([...scenarios].sort(() => Math.random() - 0.5).slice(0, 6));
	}, []);

	const current = deck[index];

	function answer(choice: Choice) {
		if (!current || feedback) return;
		const correct = choice === current.answer;
		const nextScore = score + (correct ? 1 : 0);
		setScore(nextScore);
		setFeedback(
			`${correct ? "Quyết định an toàn!" : "Mình cân nhắc lại nhé."} ${current.explain}`,
		);

		if (index === deck.length - 1) {
			setDone(true);
			if (nextScore >= 5) unlockSticker("oops");
			if (session)
				void saveProgress(
					session.id,
					"ai-safety-quest",
					nextScore,
					deck.length,
				);
		}
	}

	function next() {
		setFeedback("");
		setIndex((value) => Math.min(value + 1, deck.length - 1));
	}

	function restart() {
		setDeck([...scenarios].sort(() => Math.random() - 0.5).slice(0, 6));
		setIndex(0);
		setScore(0);
		setFeedback("");
		setDone(false);
	}

	return (
		<GameShell
			title="🛡️ AI Safety Quest"
			subtitle="Ra quyết định an toàn khi dùng AI."
			instruction="Đọc tình huống rồi chọn hành động phù hợp: nên làm, không nên hoặc hỏi người lớn."
			score={score}
			maxScore={deck.length || 6}
		>
			<section className="lab-card mx-auto max-w-4xl p-6 text-center bg-white/85 relative overflow-hidden">
				{done && <ConfettiSuccess />}
				<AnimatePresence mode="wait">
					{current && (
						<motion.div
							key={index}
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -30 }}
						>
							<p className="text-sm font-black text-muted mb-3">
								🛡️ Nhiệm vụ {index + 1} / {deck.length}
							</p>
							<div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-greenLab/15 text-6xl shadow-sm">
								{current.emoji}
							</div>
							<div className="mb-7 flex items-center justify-center gap-3 rounded-3xl bg-cream/70 border border-greenLab/20 p-5">
								<ShieldCheck className="h-8 w-8 text-green-600" />
								<p className="text-2xl font-black text-ink leading-relaxed">
									{current.text}
								</p>
								<TTSButton text={current.text} compact autoPlay />
							</div>

							{!feedback ? (
								<div className="grid gap-3 md:grid-cols-3">
									{choices.map((choice) => {
										const style = choiceStyle[choice];
										return (
											<motion.button
												key={choice}
												className={`big-button bg-gradient-to-r ${style.className} py-4 text-lg shadow-sm border border-white/40`}
												onClick={() => answer(choice)}
												whileHover={{ scale: 1.03 }}
												whileTap={{ scale: 0.97 }}
											>
												<span className="mr-2 text-2xl">{style.emoji}</span>
												{choice}
											</motion.button>
										);
									})}
								</div>
							) : (
								<div className="space-y-5">
									{feedback.startsWith("Quyết") ? (
										<HappyFeedback text={feedback} />
									) : (
										<TryAgainFeedback text={feedback} />
									)}
									{!done ? (
										<button
											type="button"
											className="big-button bg-ink text-white text-lg"
											onClick={next}
										>
											Nhiệm vụ tiếp theo ➡️
										</button>
									) : (
										<div className="space-y-4">
											<div className="inline-flex items-center gap-3 rounded-2xl bg-yellowLab/35 px-6 py-4 text-xl font-black text-ink">
												<Award className="h-7 w-7 text-orange-500" /> Hoàn
												thành: {score}/{deck.length} điểm!
											</div>
											<button
												type="button"
												className="big-button bg-ink text-white text-lg"
												onClick={restart}
											>
												🔄 Chơi lại
											</button>
										</div>
									)}
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</section>
		</GameShell>
	);
}
