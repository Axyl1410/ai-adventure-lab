import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	BadgeCheck,
	BookOpen,
	BrainCircuit,
	Camera,
	Database,
	ImageIcon,
	MessageCircle,
	Search,
	ShieldCheck,
	Sparkles,
	Star,
	Trophy,
	Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BuddyBot } from "../components/BuddyBot";

import detectiveBanner from "../assets/detective-banner.png";
import oopsBanner from "../assets/oops-banner.png";
import robotLab from "../assets/robot-lab.png";
import buddyHero from "../assets/mascot/buddy-bot-hero.svg";
import buddyReading from "../assets/mascot/buddy-bot-reading.png";
import stickerArtist from "../assets/stickers/sticker-artist.png";
import stickerDetective from "../assets/stickers/sticker-detective.png";
import stickerOops from "../assets/stickers/sticker-oops.png";
import stickerPrompt from "../assets/stickers/sticker-prompt.png";
import stickerRobot from "../assets/stickers/sticker-robot.png";

const STICKERS = [
	{
		id: "detective",
		name: "Thám tử nhí",
		image: stickerDetective,
		hint: "Đạt >= 4 điểm trong game Thám tử AI",
	},
	{
		id: "robot",
		name: "Kỹ sư máy học",
		image: stickerRobot,
		hint: "Đạt >= 5 điểm trong Dạy Robot Học hoặc hoàn thành Huấn Luyện AI Mini",
	},
	{
		id: "oops",
		name: "Thám tử phản biện",
		image: stickerOops,
		hint: "Đạt >= 3 điểm trong game AI Có Thể Sai",
	},
	{
		id: "prompt",
		name: "Pháp sư Prompt",
		image: stickerPrompt,
		hint: "Đạt >= 80 điểm trong game Phép thuật câu lệnh",
	},
	{
		id: "artist",
		name: "Họa sĩ AI",
		image: stickerArtist,
		hint: "Tạo thành công tranh trong Xưởng Tranh AI",
	},
];

const gameCards = [
	{
		title: "Thám Tử AI",
		desc: "Đoán xem hoạt động nào có sử dụng trí tuệ nhân tạo.",
		badge: "Dễ",
		time: "3 phút",
		to: "/games/ai-detective",
		image: detectiveBanner,
		alt: "Buddy Bot trong vai thám tử AI",
		icon: Search,
		color: "from-skyLab to-blueLab",
		imageTone: "bg-skyLab/15",
	},
	{
		title: "Dạy Robot Học",
		desc: "Gán nhãn ví dụ để robot học cách phân biệt đồ vật.",
		badge: "Dễ",
		time: "5 phút",
		to: "/games/teach-the-robot",
		image: stickerRobot,
		alt: "Robot học từ các ví dụ",
		icon: BrainCircuit,
		color: "from-greenLab to-mintLab",
		imageTone: "bg-greenLab/15",
	},
	{
		title: "Huấn Luyện AI Mini",
		desc: "Thử model Teachable Machine với camera trong trình duyệt.",
		badge: "Khám phá",
		time: "6 phút",
		to: "/games/teachable-machine",
		image: robotLab,
		alt: "Phòng lab robot cho Teachable Machine",
		icon: Camera,
		color: "from-purpleLab to-pinkLab",
		imageTone: "bg-purpleLab/15",
	},
	{
		title: "Phép Thuật Câu Lệnh",
		desc: "Ghép các khối hướng dẫn để tạo prompt rõ ràng.",
		badge: "Vừa",
		time: "4 phút",
		to: "/games/prompt-magic",
		image: stickerPrompt,
		alt: "Buddy Bot cầm cây đũa prompt",
		icon: Wand2,
		color: "from-yellowLab to-orangeLab",
		imageTone: "bg-yellowLab/20",
	},
	{
		title: "AI Có Thể Sai",
		desc: "Tìm lỗi sai và học cách kiểm tra lại thông tin.",
		badge: "Dễ",
		time: "3 phút",
		to: "/games/oops-ai-mistake",
		image: oopsBanner,
		alt: "Một tình huống AI trả lời sai cần kiểm tra",
		icon: BadgeCheck,
		color: "from-redSoft to-orangeLab",
		imageTone: "bg-redSoft/15",
	},
	{
		title: "Buddy Bot Trò Chuyện",
		desc: "Hỏi đáp cùng robot học tập bằng tiếng Việt an toàn.",
		badge: "Khám phá",
		time: "Tự chọn",
		to: "/games/buddy-bot",
		image: buddyReading,
		alt: "Buddy Bot đang đọc sách",
		icon: MessageCircle,
		color: "from-blueLab to-purpleLab",
		imageTone: "bg-blueLab/15",
	},
	{
		title: "Xưởng Tranh AI",
		desc: "Chọn chủ đề, phong cách và tạo tranh AI an toàn.",
		badge: "Khám phá",
		time: "5 phút",
		to: "/games/image-studio",
		image: stickerArtist,
		alt: "Buddy Bot họa sĩ tạo tranh AI",
		icon: ImageIcon,
		color: "from-pinkLab to-yellowLab",
		imageTone: "bg-pinkLab/15",
	},
	{
		title: "Xếp Loại Dữ Liệu",
		desc: "Phân loại dữ liệu tốt, dữ liệu nhiễu và thông tin riêng tư.",
		badge: "Vừa",
		time: "4 phút",
		to: "/games/data-sorter",
		image: stickerRobot,
		alt: "Robot phân loại dữ liệu để học AI",
		icon: Database,
		color: "from-greenLab to-skyLab",
		imageTone: "bg-greenLab/15",
	},
	{
		title: "Nhiệm Vụ An Toàn AI",
		desc: "Chọn hành động an toàn khi trò chuyện và tạo nội dung với AI.",
		badge: "Dễ",
		time: "4 phút",
		to: "/games/ai-safety-quest",
		image: oopsBanner,
		alt: "Nhiệm vụ an toàn khi dùng AI",
		icon: ShieldCheck,
		color: "from-mintLab to-greenLab",
		imageTone: "bg-greenLab/15",
	},
];

const quickStats = [
	{ label: "Trò chơi", value: "9", tone: "bg-skyLab/15 text-sky-700" },
	{ label: "Sticker", value: "5", tone: "bg-yellowLab/25 text-orange-700" },
	{
		label: "Không cần tài khoản",
		value: "✓",
		tone: "bg-greenLab/20 text-green-700",
	},
];

export function HomePage() {
	const [unlockedStickers, setUnlockedStickers] = useState<string[]>([]);
	const [showStickerBook, setShowStickerBook] = useState(false);

	useEffect(() => {
		const loadStickers = () => {
			const saved = localStorage.getItem("ai-lab-unlocked-stickers");
			if (!saved) return;
			try {
				setUnlockedStickers(JSON.parse(saved));
			} catch {
				setUnlockedStickers([]);
			}
		};

		loadStickers();
		window.addEventListener("sticker-unlocked", loadStickers);
		return () => window.removeEventListener("sticker-unlocked", loadStickers);
	}, []);

	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-5 sm:py-8">
			<section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur-md sm:p-7 lg:p-8">
				<div
					className="absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab"
					aria-hidden="true"
				/>
				<div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<motion.div
						className="space-y-5"
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45 }}
					>
						<p className="inline-flex items-center gap-2 rounded-full border border-purpleLab/25 bg-purpleLab/15 px-4 py-2 text-sm font-black text-purple-700">
							<Sparkles className="h-4 w-4" /> Rainbow Robot Classroom
						</p>
						<div className="space-y-3">
							<h1 className="max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
								Phòng Thí Nghiệm{" "}
								<span className="bg-gradient-to-r from-skyLab via-purpleLab to-pinkLab bg-clip-text text-transparent">
									AI Vui Nhộn
								</span>
							</h1>
							<p className="max-w-2xl text-base font-bold leading-relaxed text-muted sm:text-lg">
								Cùng Buddy Bot khám phá AI qua trò chơi, hình ảnh, giọng nói và
								thử thách thông minh!
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
							{quickStats.map((stat) => (
								<div
									key={stat.label}
									className={`rounded-3xl px-4 py-3 font-black shadow-sm ${stat.tone}`}
								>
									<div className="text-2xl leading-none">{stat.value}</div>
									<div className="mt-1 text-xs uppercase tracking-wide">
										{stat.label}
									</div>
								</div>
							))}
						</div>

						<div className="flex flex-wrap gap-3">
							<a
								href="#games"
								className="big-button inline-flex items-center gap-2 bg-gradient-to-r from-ink to-ink/90 text-white"
							>
								Chọn trò chơi <ArrowRight className="h-5 w-5" />
							</a>
							<button
								type="button"
								onClick={() => setShowStickerBook(true)}
								className="big-button inline-flex items-center gap-2 border border-yellowLab/50 bg-yellowLab/25 text-ink"
							>
								<Trophy className="h-5 w-5 text-orange-500" /> Sổ Sticker (
								{unlockedStickers.length}/5)
							</button>
						</div>
					</motion.div>

					<motion.div
						className="relative min-h-[280px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-skyLab/20 via-white to-yellowLab/25 p-5"
						initial={{ opacity: 0, scale: 0.94 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.45, delay: 0.1 }}
					>
						<div className="absolute left-5 top-5 rounded-3xl bg-white/85 px-4 py-3 text-sm font-black text-ink shadow-sm">
							<ShieldCheck className="mr-1 inline h-4 w-4 text-green-600" />
							Học AI an toàn
						</div>
						<img
							src={buddyHero}
							alt="Buddy Bot chào mừng học sinh vào phòng thí nghiệm AI"
							className="mx-auto h-[250px] w-full object-contain sm:h-[320px]"
						/>
						<div className="absolute bottom-5 right-5 max-w-[230px] rounded-3xl bg-white/90 px-4 py-3 text-sm font-black leading-snug text-ink shadow-sm">
							AI có thể sai. Mình cùng kiểm tra với thầy cô nhé!
						</div>
					</motion.div>
				</div>
			</section>

			<section className="mt-6 grid gap-3 sm:grid-cols-3">
				<div className="rounded-3xl border border-skyLab/20 bg-skyLab/15 px-4 py-3 font-bold text-ink">
					<BookOpen className="mr-2 inline h-5 w-5 text-sky-600" />
					Bài học ngắn, dễ hiểu cho học sinh tiểu học.
				</div>
				<div className="rounded-3xl border border-greenLab/25 bg-greenLab/15 px-4 py-3 font-bold text-ink">
					<ShieldCheck className="mr-2 inline h-5 w-5 text-green-600" />
					Không yêu cầu tên thật hay tài khoản cá nhân.
				</div>
				<div className="rounded-3xl border border-yellowLab/35 bg-yellowLab/20 px-4 py-3 font-bold text-ink">
					<Star className="mr-2 inline h-5 w-5 text-orange-500" />
					Hoàn thành thử thách để mở sticker Buddy Bot.
				</div>
			</section>

			<section id="games" className="mt-8">
				<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
					<div>
						<p className="text-sm font-black uppercase tracking-wide text-purple-700">
							Chọn một cuộc phiêu lưu
						</p>
						<h2 className="text-3xl font-black text-ink">
							Trò chơi AI có minh họa
						</h2>
					</div>
					<p className="max-w-xl text-sm font-bold leading-relaxed text-muted">
						Mỗi trò chơi có hình ảnh riêng để học sinh dễ nhận biết mục tiêu
						trước khi bắt đầu.
					</p>
				</div>

				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{gameCards.map((card, index) => {
						const Icon = card.icon;
						return (
							<motion.article
								key={card.title}
								className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
								initial={{ opacity: 0, y: 18 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.35, delay: index * 0.04 }}
							>
								<div
									className={`relative h-48 overflow-hidden ${card.imageTone}`}
								>
									<div
										className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${card.color}`}
										aria-hidden="true"
									/>
									<img
										src={card.image}
										alt={card.alt}
										className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
									/>
									<span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 text-xs font-black text-ink shadow-sm">
										<Icon className="h-4 w-4" /> {card.badge}
									</span>
								</div>

								<div className="space-y-4 p-5">
									<div className="min-h-[106px]">
										<div className="flex items-start justify-between gap-3">
											<h3 className="text-2xl font-black leading-tight text-ink">
												{card.title}
											</h3>
											<span className="shrink-0 rounded-2xl bg-cream px-3 py-1 text-xs font-black text-muted">
												{card.time}
											</span>
										</div>
										<p className="mt-3 text-sm font-bold leading-relaxed text-muted">
											{card.desc}
										</p>
									</div>

									<Link
										className={`big-button flex w-full items-center justify-center gap-2 bg-gradient-to-r ${card.color} text-ink shadow-sm`}
										to={card.to}
									>
										Bắt đầu{" "}
										<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
									</Link>
								</div>
							</motion.article>
						);
					})}
				</div>
			</section>

			<AnimatePresence>
				{showStickerBook && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowStickerBook(false)}
						/>

						<motion.div
							aria-labelledby="sticker-book-title"
							aria-modal="true"
							role="dialog"
							className="relative z-10 flex max-h-[90dvh] w-full max-w-4xl flex-col rounded-3xl border border-white/70 bg-white p-6 shadow-2xl md:p-8"
							initial={{ scale: 0.9, y: 50, opacity: 0 }}
							animate={{ scale: 1, y: 0, opacity: 1 }}
							exit={{ scale: 0.9, y: 50, opacity: 0 }}
							transition={{ type: "spring", stiffness: 260, damping: 25 }}
						>
							<button
								type="button"
								className="absolute right-4 top-4 z-20 rounded-2xl px-3 py-2 text-2xl font-black text-muted hover:bg-cream hover:text-ink focus:outline-none focus:ring-4 focus:ring-skyLab/30"
								onClick={() => setShowStickerBook(false)}
								aria-label="Đóng sổ sticker"
							>
								x
							</button>

							<div className="shrink-0 pr-10">
								<h2
									id="sticker-book-title"
									className="flex items-center gap-2 border-b border-cream pb-3 text-2xl font-black text-ink"
								>
									<Trophy className="h-7 w-7 text-orange-500" /> Sổ thu thập
									Sticker Buddy Bot
								</h2>
								<p className="mt-2 text-sm font-bold text-muted">
									Chơi các trò chơi và hoàn thành thử thách để thu thập trọn bộ
									sticker Buddy Bot.
								</p>
							</div>

							<div className="mt-6 grid flex-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 md:grid-cols-5">
								{STICKERS.map((sticker) => {
									const isUnlocked = unlockedStickers.includes(sticker.id);
									return (
										<motion.div
											key={sticker.id}
											className={`flex flex-col items-center justify-between rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
												isUnlocked
													? "border-yellowLab bg-gradient-to-br from-yellowLab/20 to-orangeLab/25 shadow-sm"
													: "border-cream bg-cream/40 opacity-70"
											}`}
											whileHover={isUnlocked ? { scale: 1.05, y: -4 } : {}}
										>
											<div className="relative mb-3 flex h-20 w-20 items-center justify-center">
												<img
													src={sticker.image}
													alt={sticker.name}
													className={`h-full w-full object-contain transition-all duration-300 ${
														isUnlocked
															? "drop-shadow-md"
															: "grayscale opacity-40 blur-[0.5px]"
													}`}
												/>
												{!isUnlocked && (
													<span
														className="absolute text-lg"
														role="img"
														aria-label="locked"
													>
														🔒
													</span>
												)}
											</div>
											<div>
												<h3
													className={`text-base font-black ${isUnlocked ? "text-ink" : "text-muted"}`}
												>
													{sticker.name}
												</h3>
												<p className="mt-1 text-xs font-semibold text-muted/80">
													{isUnlocked ? "Đã mở khóa!" : sticker.hint}
												</p>
											</div>
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</main>
	);
}
