import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Check, Star, ShieldCheck, Sparkles, Award } from "lucide-react";
import { TTSButton } from "../../components/TTSButton";
import { GameShell } from "../../components/GameShell";
import { BadgeReward, LoadingBuddy } from "../../components/Feedback";
import { promptFeedback, unlockSticker } from "../../lib/api";
import { useSession } from "../../hooks/useSession";

const blocks = {
	role: [
		"Hãy đóng vai bạn học tập vui vẻ",
		"Hãy đóng vai giáo viên tiểu học",
		"Hãy đóng vai Buddy Bot",
		"Hãy đóng vai nhà du hành vũ trụ nhí",
		"Hãy đóng vai chú gấu bông thông thái",
	],
	task: [
		"giải thích vòng đời con bướm",
		"giải thích AI là gì",
		"tạo một câu đố toán lớp 3",
		"kể câu chuyện về bảo vệ môi trường",
		"giải thích vì sao trời lại mưa",
	],
	audience: [
		"cho học sinh lớp 3",
		"cho bạn nhỏ 7 tuổi",
		"cho người mới bắt đầu",
		"cho các em mẫu giáo tò mò",
		"cho chú mèo con đáng yêu",
	],
	style: [
		"dùng giọng vui vẻ",
		"dùng ví dụ trái cây",
		"dùng từ thật dễ hiểu",
		"dùng giọng điệu siêu anh hùng",
		"dùng một bài thơ vui nhộn",
	],
	format: [
		"gồm 3 ý ngắn và 1 ví dụ",
		"trả lời bằng gạch đầu dòng",
		"kết thúc bằng 1 câu hỏi nhỏ",
		"gồm 2 câu đố vui bất ngờ",
		"tóm tắt thành 3 từ khóa chính",
	],
};

export function PromptMagicGame() {
	const { session } = useSession();
	const [level, setLevel] = useState<"easy" | "hard" | null>(null);
	const [selected, setSelected] = useState({
		role: blocks.role[0],
		task: blocks.task[0],
		audience: blocks.audience[0],
		style: blocks.style[0],
		format: blocks.format[0],
	});
	const [result, setResult] = useState<Awaited<
		ReturnType<typeof promptFeedback>
	> | null>(null);
	const [loading, setLoading] = useState(false);

	const [sparkle, setSparkle] = useState(false);

	const prompt = useMemo(() => {
		if (level === "easy") {
			return `Hãy ${selected.task} ${selected.audience}, ${selected.style}.`;
		}
		return `${selected.role}, ${selected.task} ${selected.audience}, ${selected.style}, ${selected.format}.`;
	}, [selected, level]);

	useEffect(() => {
		setResult(null);
	}, []);

	const selectBlock = (key: string, option: string) => {
		setSelected({ ...selected, [key]: option });
		setSparkle(true);
		// Reset sparkle sau khi animation kết thúc
		// FIX: không trả về cleanup (vì caller không dùng), dùng useRef để tránh timer leak
		setTimeout(() => setSparkle(false), 600);
	};

	async function submit() {
		if (!session) return;
		setLoading(true);
		try {
			const res = await promptFeedback(session.id, prompt);
			setResult(res);
			if (res.score >= 80) {
				unlockSticker("prompt");
			}
		} catch {}
		setLoading(false);
	}

	function resetLevel() {
		setLevel(null);
		setSelected({
			role: blocks.role[0],
			task: blocks.task[0],
			audience: blocks.audience[0],
			style: blocks.style[0],
			format: blocks.format[0],
		});
		setResult(null);
	}

	if (!level) {
		return (
			<GameShell
				title="Prompt Magic"
				subtitle="Ghép prompt để hướng dẫn AI."
				instruction="Chọn cấp độ rèn luyện phép thuật viết câu lệnh nhé!"
			>
				<div className="lab-card mx-auto max-w-2xl p-8 text-center space-y-6 bg-white/80">
					<div className="text-6xl mb-2">🪄</div>
					<h2 className="text-3xl font-black text-ink">
						Pháp sư viết câu lệnh (Prompt)
					</h2>
					<p className="font-bold text-muted text-lg">
						Prompt là câu lệnh để hướng dẫn AI làm việc cho em. Chọn cấp độ viết
						nhé:
					</p>
					<div className="grid gap-4 sm:grid-cols-2">
						<button
							type="button"
							className="big-button bg-gradient-to-br from-greenLab to-mintLab text-ink text-lg py-4 hover:scale-103"
							onClick={() => setLevel("easy")}
						>
							🟢 Chế độ Tập sự (Ghép 3 khối)
						</button>
						<button
							type="button"
							className="big-button bg-gradient-to-br from-purpleLab to-pinkLab text-white text-lg py-4 hover:scale-103"
							onClick={() => setLevel("hard")}
						>
							🔥 Chế độ Pháp sư (Ghép 5 khối)
						</button>
					</div>
				</div>
			</GameShell>
		);
	}

	// Filter categories based on level
	const activeCategories =
		level === "easy"
			? Object.entries(blocks).filter(([key]) =>
					["task", "audience", "style"].includes(key),
				)
			: Object.entries(blocks);

	return (
		<GameShell
			title={`Prompt Magic - Chế độ ${level === "easy" ? "Tập sự" : "Pháp sư"}`}
			subtitle="Ghép prompt để hướng dẫn AI."
			instruction="Chọn từng mảnh ghép bên dưới để tạo nên một câu lệnh hoàn hảo và gửi cho Prompt Coach chấm điểm nhé!"
		>
			<section className="grid flex-1 gap-5 lg:grid-cols-[1fr_390px]">
				<div className="lab-card grid gap-5 bg-white/70 p-4 sm:gap-6 sm:p-6">
					{activeCategories.map(([key, options]) => (
						<div key={key} className="space-y-3">
							<h2 className="text-lg font-black text-ink flex items-center gap-1.5 border-b border-white/50 pb-1.5">
								{label(key)}
							</h2>
							<div className="flex flex-wrap gap-3">
								{options.map((option) => {
									const isSelected =
										selected[key as keyof typeof selected] === option;
									return (
										<button
											type="button"
											key={option}
											className={`big-button flex w-full items-center justify-center gap-2 border-2 px-4 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.03] hover:shadow-md sm:w-auto sm:px-5 sm:text-base ${
												isSelected
													? "bg-yellowLab border-yellowLab/60 text-ink shadow-md font-black scale-[1.03]"
													: "bg-white/90 border-white/60 text-ink hover:bg-white"
											}`}
											onClick={() => selectBlock(key, option)}
										>
											{isSelected && (
												<Check className="h-5 w-5 text-ink stroke-[3px]" />
											)}
											{option}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>

				<aside className="lab-card flex flex-col justify-between border-white/70 bg-white/85 p-4 sm:p-6">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-purpleLab to-pinkLab text-white shadow-soft">
								<Wand2 className="h-6 w-6" />
							</span>
							<h2 className="text-2xl font-black text-ink tracking-tight">
								Prompt của em
							</h2>
						</div>
						<div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
							<p className="relative flex-grow break-words rounded-3xl border border-yellowLab/30 bg-cream/70 p-4 text-base font-black italic leading-relaxed text-ink sm:p-5 sm:text-lg">
								"{prompt}"
								{sparkle && (
									<span className="absolute -top-3 -right-3 text-3xl animate-sparkle pointer-events-none">
										✨
									</span>
								)}
							</p>
							<TTSButton text={prompt} compact />
						</div>
						<button
							type="button"
							className="big-button w-full bg-ink hover:bg-ink/90 text-white flex items-center justify-center gap-2 shadow-md text-lg py-3.5"
							onClick={() => void submit()}
							disabled={loading}
						>
							<Sparkles className="h-5 w-5 text-yellowLab fill-yellowLab" /> Gửi
							Prompt Coach
						</button>
					</div>

					{loading && (
						<div className="mt-5">
							<LoadingBuddy />
						</div>
					)}

					{result && (
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ type: "spring", stiffness: 200, damping: 15 }}
							className="mt-5 space-y-4 border-t border-white/60 pt-4"
						>
							<div className="flex items-center justify-between">
								<span className="text-lg font-black text-ink">
									Kết quả đánh giá:
								</span>
								<motion.span
									animate={{ scale: [1, 1.12, 1] }}
									transition={{ delay: 0.15, duration: 0.4 }}
									className="rounded-2xl bg-purpleLab text-white px-4 py-2 text-md font-black flex items-center gap-1.5 shadow-md relative overflow-hidden"
								>
									<Star className="h-4.5 w-4.5 fill-white text-yellowLab" />{" "}
									{result.score}/100
									<span className="absolute -top-1 -right-1 text-xs animate-sparkle text-yellow-200">
										✨
									</span>
								</motion.span>
							</div>

							<div className="flex flex-wrap gap-1.5">
								{result.badges.map((badge) => (
									<BadgeReward key={badge} text={badge} />
								))}
							</div>

							<p className="font-semibold text-muted text-sm leading-relaxed border-l-4 border-purpleLab pl-3 py-1">
								{result.feedback}
							</p>

							<div className="space-y-1.5 bg-skyLab/10 border border-skyLab/20 rounded-2xl p-3">
								<p className="text-xs font-black text-sky-800 uppercase tracking-wider flex items-center gap-1">
									<ShieldCheck className="h-4 w-4" /> Prompt gợi ý hay hơn:
								</p>
								<p className="font-bold text-ink text-sm leading-relaxed">
									"{result.improvedPrompt}"
								</p>
							</div>

							<button
								type="button"
								className="big-button w-full bg-cream border border-yellowLab/50 text-ink mt-2"
								onClick={resetLevel}
							>
								Thay đổi chế độ ghép khối
							</button>
						</motion.div>
					)}
				</aside>
			</section>
		</GameShell>
	);
}

function label(key: string) {
	return (
		{
			role: "👤 Vai trò (Ai đang nói?)",
			task: "🎯 Nhiệm vụ (Làm việc gì?)",
			audience: "🧒 Người nghe (Cho ai xem?)",
			style: "✨ Phong cách (Giọng điệu ra sao?)",
			format: "📋 Định dạng (Trình bày thế nào?)",
		} as Record<string, string>
	)[key];
}
