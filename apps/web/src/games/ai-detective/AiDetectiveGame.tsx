import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "../../components/GameShell";
import { TTSButton } from "../../components/TTSButton";
import {
	HappyFeedback,
	TryAgainFeedback,
	ConfettiSuccess,
} from "../../components/Feedback";
import { saveProgress, unlockSticker, type AiQuestion } from "../../lib/api";
import { useSession } from "../../hooks/useSession";
import { Award } from "lucide-react";
import detectiveBanner from "../../assets/detective-banner.png";

interface AiQuestionWithEmoji extends AiQuestion {
	emoji: string;
}

const easyQuestions: AiQuestionWithEmoji[] = [
	{
		emoji: "📺",
		text: "YouTube gợi ý video cho em.",
		answer: true,
		explain: "Có AI vì hệ thống học từ video em thường xem để gợi ý.",
	},
	{
		emoji: "🌀",
		text: "Cái quạt quay khi bấm nút.",
		answer: false,
		explain: "Không AI. Nó chỉ làm theo nút bấm vật lý thông thường.",
	},
	{
		emoji: "⏰",
		text: "Đồng hồ báo thức kêu lúc 6 giờ.",
		answer: false,
		explain: "Không AI. Nó chỉ kêu theo giờ em đã cài đặt trước.",
	},
	{
		emoji: "🔦",
		text: "Đèn pin sáng lên khi gạt công tắc.",
		answer: false,
		explain: "Không AI. Điện chạy qua làm sáng đèn pin ngay lập tức.",
	},
	{
		emoji: "🤖",
		text: "Máy hút bụi tự động né tránh bàn ghế trong nhà.",
		answer: true,
		explain:
			"Có AI vì máy sử dụng cảm biến và học cách nhận biết chướng ngại vật để di chuyển.",
	},
	{
		emoji: "💡",
		text: "Đèn đường tự động sáng khi trời tối nhờ cảm biến ánh sáng.",
		answer: false,
		explain:
			"Không AI. Đây chỉ là cảm biến quang học bật tắt công tắc dòng điện vật lý thông thường.",
	},
	{
		emoji: "🧮",
		text: "Máy tính bỏ túi tính ra kết quả 123 + 456 = 579.",
		answer: false,
		explain:
			"Không AI. Nó chỉ chạy theo công thức toán học cố định được cài sẵn.",
	},
	{
		emoji: "✍️",
		text: "Điện thoại tự sửa từ viết sai chính tả khi em gõ tin nhắn.",
		answer: true,
		explain:
			"Có AI vì bàn phím thông minh học từ thói quen gõ chữ của con người để đoán từ đúng.",
	},
	{
		emoji: "🧼",
		text: "Vòi nước tự xả khi em đưa tay vào dưới vòi nhờ cảm biến tiệm cận.",
		answer: false,
		explain:
			"Không AI. Cảm biến khoảng cách chỉ bật van nước cơ học bình thường khi bị che khuất.",
	},
	{
		emoji: "📱",
		text: "Ứng dụng máy ảnh tự động làm mịn da và làm to mắt em.",
		answer: true,
		explain:
			"Có AI vì ứng dụng tự phát hiện cấu trúc khuôn mặt và áp dụng hiệu ứng làm đẹp thông minh.",
	},
	{
		emoji: "📺",
		text: "Tivi tự động chuyển kênh khi em bấm nút số trên điều khiển.",
		answer: false,
		explain:
			"Không AI. Tivi chỉ nhận tín hiệu hồng ngoại cố định tương ứng với nút bấm để đổi kênh.",
	},
	{
		emoji: "🧊",
		text: "Tủ lạnh tự làm đá viên khi ngăn chứa đầy nước.",
		answer: false,
		explain:
			"Không AI. Đây là hệ thống cơ điện tự động đổ khay đá khi đủ độ lạnh, không cần tự học.",
	},
];

const hardQuestions: AiQuestionWithEmoji[] = [
	{
		emoji: "🌐",
		text: "Google Translate dịch câu tiếng Anh.",
		answer: true,
		explain: "Có AI vì máy học hàng triệu mẫu câu để dịch ngôn ngữ.",
	},
	{
		emoji: "📸",
		text: "Máy ảnh tự nhận diện khuôn mặt em.",
		answer: true,
		explain: "Có AI vì máy tính đã học cách nhận dạng các khuôn mặt khác nhau.",
	},
	{
		emoji: "📧",
		text: "Hộp thư email tự lọc thư rác quảng cáo.",
		answer: true,
		explain: "Có AI vì hệ thống tự phân tích từ ngữ để chặn thư rác.",
	},
	{
		emoji: "🚗",
		text: "Xe tự lái dừng lại trước biển báo đỏ.",
		answer: true,
		explain: "Có AI vì camera nhận diện và xử lý biển báo để dừng xe.",
	},
	{
		emoji: "❄️",
		text: "Điều hòa tự điều chỉnh hướng gió khi có người.",
		answer: true,
		explain:
			"Có AI vì cảm biến hồng ngoại nhận diện vị trí con người để hướng gió.",
	},
	{
		emoji: "🗺️",
		text: "Bản đồ Google Maps chỉ đường tránh kẹt xe.",
		answer: true,
		explain:
			"Có AI vì hệ thống phân tích dữ liệu di chuyển của hàng triệu người để dự báo điểm tắc đường.",
	},
	{
		emoji: "🏭",
		text: "Cánh tay robot lặp lại động tác lắp ráp trong nhà máy.",
		answer: false,
		explain:
			"Không AI. Nó chỉ hoạt động chính xác theo lập trình cứng có sẵn, không tự học hỏi điều mới.",
	},
	{
		emoji: "🔑",
		text: "Khóa cửa thông minh tự mở khi nhận diện đúng Face ID khuôn mặt của bố mẹ.",
		answer: true,
		explain:
			"Có AI vì hệ thống sử dụng thuật toán nhận dạng để ghi nhớ và phân tích đặc điểm khuôn mặt.",
	},
	{
		emoji: "🎨",
		text: "Ứng dụng tự vẽ ra một bức tranh khi em gõ mô tả bằng lời nói.",
		answer: true,
		explain:
			"Có AI tạo sinh hình ảnh (Generative AI) được huấn luyện trên hàng triệu bức tranh để vẽ ra hình mới.",
	},
	{
		emoji: "💬",
		text: "Buddy Bot gợi ý các câu hỏi thông minh khi em đang chat.",
		answer: true,
		explain: "Có AI phân tích các từ em gõ để tìm ra chủ đề phù hợp tiếp theo.",
	},
	{
		emoji: "🩺",
		text: "Hệ thống máy tính phân tích ảnh X-quang để giúp bác sĩ phát hiện bệnh phổi.",
		answer: true,
		explain:
			"Có AI vì máy tính được huấn luyện trên hàng triệu bức ảnh y tế để học cách nhận diện dấu hiệu tổn thương.",
	},
	{
		emoji: "🎼",
		text: "Ứng dụng tự nhận diện tên bài hát khi em cho nó nghe một đoạn nhạc ngắn.",
		answer: true,
		explain:
			"Có AI phân tích tần số âm thanh và đối chiếu nhanh với cơ sở dữ liệu hàng triệu bài hát.",
	},
];

export function AiDetectiveGame() {
	const { session } = useSession();
	const [level, setLevel] = useState<"easy" | "hard" | null>(null);
	const [questions, setQuestions] = useState<AiQuestionWithEmoji[]>([]);
	const [index, setIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [showConfetti, setShowConfetti] = useState(false);

	useEffect(() => {
		if (level) {
			const selectedSet = level === "easy" ? easyQuestions : hardQuestions;
			const shuffled = [...selectedSet].sort(() => Math.random() - 0.5);
			setQuestions(shuffled.slice(0, 5));
			setIndex(0);
			setScore(0);
			setFeedback("");
			setShowConfetti(false);
		}
	}, [level]);

	const current = questions[index];
	const isLastQuestion = index === questions.length - 1;

	function answer(value: boolean) {
		if (!current) return;
		const correct = value === current.answer;
		const nextScore = score + (correct ? 1 : 0);
		setScore(nextScore);
		setFeedback(
			`${correct ? "Chính xác!" : "Gần đúng rồi!"} ${current.explain}`,
		);
		if (isLastQuestion) {
			setShowConfetti(true);
			if (nextScore >= 4) {
				unlockSticker("detective");
			}
			if (session)
				void saveProgress(
					session.id,
					`ai-detective-${level}`,
					nextScore,
					questions.length,
				);
		}
	}

	function next() {
		setFeedback("");
		setIndex((v) => Math.min(v + 1, questions.length - 1));
	}

	if (!level) {
		return (
			<GameShell
				title="🔍 Thám Tử AI"
				subtitle="Đoán xem hoạt động nào có AI."
				instruction="Chọn cấp độ chơi phù hợp với em nhé!"
			>
				<div className="lab-card mx-auto max-w-2xl p-8 text-center space-y-6 bg-white/80">
					<div className="w-full rounded-2xl overflow-hidden shadow-md max-h-48 mb-2 flex items-center justify-center bg-skyLab/15">
						<img
							src={detectiveBanner}
							alt="Thám tử AI Banner"
							className="w-full h-full object-cover max-h-48"
						/>
					</div>
					<h2 className="text-3xl font-black text-ink">Thử thách Thám tử AI</h2>
					<p className="font-bold text-muted text-lg">
						Em đã sẵn sàng đi tìm dấu vết của trí tuệ nhân tạo chưa?
					</p>
					<div className="grid gap-4 sm:grid-cols-2">
						<motion.button
							className="big-button bg-gradient-to-br from-greenLab to-mintLab text-ink text-lg py-4"
							onClick={() => setLevel("easy")}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.97 }}
						>
							<span className="text-2xl mr-2">🌱</span> Mầm non AI
							<span className="block text-xs font-semibold text-ink/60 mt-1">
								Ngẫu nhiên 5 câu dễ
							</span>
						</motion.button>
						<motion.button
							className="big-button bg-gradient-to-br from-purpleLab to-pinkLab text-white text-lg py-4"
							onClick={() => setLevel("hard")}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.97 }}
						>
							<span className="text-2xl mr-2">🔥</span> Thám tử Tập sự
							<span className="block text-xs font-semibold text-white/70 mt-1">
								Ngẫu nhiên 5 câu thử thách
							</span>
						</motion.button>
					</div>
				</div>
			</GameShell>
		);
	}

	return (
		<GameShell
			title={`🔍 Thám Tử AI — ${level === "easy" ? "Mầm non AI" : "Thám tử Tập sự"}`}
			subtitle="Đoán xem hoạt động nào có AI."
			instruction="Đọc thẻ tình huống rồi chọn Có AI hoặc Không AI."
			score={score}
			maxScore={questions.length}
		>
			<section className="lab-card mx-auto max-w-3xl p-6 md:p-8 text-center bg-white/85 relative overflow-hidden">
				{showConfetti && <ConfettiSuccess />}
				<AnimatePresence mode="wait">
					{current && (
						<motion.div
							key={index}
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -40 }}
							transition={{ duration: 0.3 }}
						>
							<p className="text-sm font-black text-muted mb-3">
								📋 Câu {index + 1} / {questions.length}
							</p>
							<div className="text-6xl mb-4">{current.emoji}</div>
							<div className="mb-8 flex items-center justify-center gap-3">
								<p className="text-2xl md:text-3xl font-black text-ink leading-relaxed">
									"{current.text}"
								</p>
								<TTSButton text={current.text} compact autoPlay />
							</div>
							{!feedback ? (
								<div className="grid gap-4 sm:grid-cols-2">
									<motion.button
										className="big-button bg-gradient-to-r from-greenLab to-mintLab text-ink shadow-sm text-lg py-4 flex items-center justify-center gap-2"
										onClick={() => answer(true)}
										whileHover={{ scale: 1.04 }}
										whileTap={{ scale: 0.96 }}
									>
										<span className="text-2xl">🤖</span> Có AI
									</motion.button>
									<motion.button
										className="big-button bg-gradient-to-r from-blueLab to-skyLab text-white shadow-sm text-lg py-4 flex items-center justify-center gap-2"
										onClick={() => answer(false)}
										whileHover={{ scale: 1.04 }}
										whileTap={{ scale: 0.96 }}
									>
										<span className="text-2xl">🔌</span> Không AI
									</motion.button>
								</div>
							) : (
								<div className="space-y-5">
									{feedback.startsWith("Chính") ? (
										<HappyFeedback text={feedback} />
									) : (
										<TryAgainFeedback text={feedback} />
									)}
									{!isLastQuestion ? (
										<motion.button
											className="big-button bg-ink text-white text-lg"
											onClick={next}
											whileHover={{ scale: 1.03 }}
										>
											Câu tiếp theo ➡️
										</motion.button>
									) : (
										<div className="space-y-4 pt-3">
											<motion.div
												className="inline-flex items-center gap-3 rounded-2xl bg-yellowLab/35 border border-yellowLab/55 px-6 py-4 text-xl font-black text-ink shadow-sm"
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ type: "spring", stiffness: 200 }}
											>
												<Award className="h-7 w-7 text-orange-500 fill-orange-200" />
												<span>
													🎉 Hoàn thành: {score}/{questions.length} điểm!
												</span>
											</motion.div>
											<div>
												<button
													className="big-button bg-ink text-white mt-2 text-lg"
													onClick={() => setLevel(null)}
												>
													🔄 Chơi lại hoặc chọn cấp độ khác
												</button>
											</div>
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
