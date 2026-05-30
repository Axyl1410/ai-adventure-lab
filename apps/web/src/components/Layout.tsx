import { Bot, Volume2, ShieldCheck, Music, VolumeX } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Layout() {
	const location = useLocation();
	const isGamePage = location.pathname.startsWith("/games");
	const isCompactLayout = isGamePage;
	const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
	const [bgmEnabled, setBgmEnabled] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

	useEffect(() => {
		const savedVoice = localStorage.getItem("ai-lab-tts-gender");
		if (savedVoice === "male") setVoiceGender("male");

		// Initialize background music
		const bgm = new Audio("/music/bgm.ogg");
		bgm.loop = true;
		bgm.volume = 0.12; // Gentle BGM volume
		setAudio(bgm);

		const savedBgm = localStorage.getItem("ai-lab-bgm-enabled");
		let playBgm: (() => void) | null = null;
		if (savedBgm === "true") {
			setBgmEnabled(true);
			// Wait for user interaction to play (autoplay policy)
			playBgm = () => {
				bgm.play().catch(() => {});
				window.removeEventListener("click", playBgm!);
				playBgm = null;
			};
			window.addEventListener("click", playBgm);
		}

		return () => {
			bgm.pause();
			// FIX: cleanup event listener để tránh memory leak
			if (playBgm) {
				window.removeEventListener("click", playBgm);
			}
		};
	}, []);

	const toggleVoiceGender = () => {
		const next = voiceGender === "female" ? "male" : "female";
		setVoiceGender(next);
		localStorage.setItem("ai-lab-tts-gender", next);
		window.dispatchEvent(new Event("tts-gender-changed"));
	};

	const toggleBgm = () => {
		if (!audio) return;
		if (bgmEnabled) {
			audio.pause();
			setBgmEnabled(false);
			localStorage.setItem("ai-lab-bgm-enabled", "false");
		} else {
			audio.play().catch(() => {});
			setBgmEnabled(true);
			localStorage.setItem("ai-lab-bgm-enabled", "true");
		}
	};

	return (
		<div
			className={`relative overflow-x-hidden ${isCompactLayout ? "min-h-dvh flex flex-col" : "min-h-screen flex flex-col justify-between"}`}
		>
			{/* Floating decorations — background only */}
			<div
				className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
				aria-hidden="true"
			>
				<div
					className="floating-star"
					style={{ top: "8%", left: "5%", animationDelay: "0s" }}
				/>
				<div
					className="floating-star"
					style={{ top: "15%", right: "8%", animationDelay: "1.5s" }}
				/>
				<div
					className="floating-star"
					style={{ top: "55%", left: "3%", animationDelay: "3s" }}
				/>
				<div
					className="floating-star"
					style={{ top: "70%", right: "6%", animationDelay: "0.8s" }}
				/>
				<div
					className="floating-cloud"
					style={{ top: "12%", left: "15%", animationDelay: "0s" }}
				/>
				<div
					className="floating-cloud"
					style={{ top: "45%", right: "12%", animationDelay: "4s" }}
				/>
				<div
					className="floating-cloud"
					style={{ top: "80%", left: "60%", animationDelay: "2s" }}
				/>
				<div
					className="floating-bubble"
					style={{ bottom: "20%", left: "10%", animationDelay: "1s" }}
				/>
				<div
					className="floating-bubble"
					style={{ bottom: "35%", right: "15%", animationDelay: "3.5s" }}
				/>
				<div
					className="floating-bubble"
					style={{ top: "30%", left: "70%", animationDelay: "2.5s" }}
				/>
			</div>

			<header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-lg shadow-sm flex-shrink-0">
				<div className="mx-auto grid max-w-7xl gap-2 px-3 py-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3">
					<Link
						to="/"
						className="flex min-w-0 items-center gap-2 group transition-transform hover:scale-[1.01] sm:gap-3"
					>
						<span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-skyLab via-purpleLab to-pinkLab text-white shadow-lg group-hover:shadow-xl transition-shadow sm:h-13 sm:w-13">
							<Bot className="h-6 w-6 sm:h-7 sm:w-7" />
						</span>
						<div className="min-w-0">
							<span className="block truncate text-lg font-black tracking-tight text-ink sm:text-2xl">
								{isGamePage ? "AI Lab" : "Phòng Thí Nghiệm AI"}
							</span>
							<span className="hidden sm:block text-xs font-bold text-muted -mt-0.5">
								🌈 Rainbow Robot Classroom
							</span>
						</div>
					</Link>
					<nav className="grid grid-cols-2 items-center gap-2 text-xs font-bold sm:flex sm:flex-wrap sm:gap-2.5 sm:text-sm">
						{/* Background Music Toggle */}
						<button
							type="button"
							onClick={toggleBgm}
							className={`min-h-11 rounded-2xl px-3 py-2 shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow-md hover:scale-[1.02] active:scale-100 border sm:px-4 sm:py-2.5 ${
								bgmEnabled
									? "bg-yellowLab/30 border-yellowLab/50 text-ink"
									: "bg-white/85 border-white/60 text-muted"
							}`}
							title={bgmEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
						>
							{bgmEnabled ? (
								<Music className="h-4.5 w-4.5 text-orangeLab animate-pulse" />
							) : (
								<VolumeX className="h-4.5 w-4.5 text-muted" />
							)}
							<span className="truncate">
								{bgmEnabled ? "Nhạc: Bật" : "Nhạc: Tắt"}
							</span>
						</button>

						<button
							type="button"
							onClick={toggleVoiceGender}
							className="min-h-11 rounded-2xl bg-white/85 hover:bg-white px-3 py-2 shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow-md hover:scale-[1.02] active:scale-100 border border-white/60 sm:px-4 sm:py-2.5"
						>
							<Volume2 className="h-4.5 w-4.5 shrink-0 text-skyLab" />
							<span className="truncate">
								{voiceGender === "female" ? "Cô giáo" : "Thầy giáo"}
							</span>
						</button>
						<span className="col-span-2 min-h-10 rounded-2xl bg-greenLab/15 border border-greenLab/25 px-3 py-2 shadow-sm text-ink flex items-center justify-center gap-1.5 sm:col-span-1 sm:min-h-0 sm:px-4 sm:py-2.5">
							<ShieldCheck className="h-4 w-4 text-green-600" /> An toàn cho học
							sinh
						</span>
					</nav>
				</div>
			</header>

			<div
				className={`relative z-10 ${isCompactLayout ? "flex-1 min-h-0 flex flex-col" : ""}`}
			>
				<Outlet />
			</div>

			{!isCompactLayout && (
				<footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 text-center font-bold text-muted border-t border-white/20 mt-12 bg-white/30 backdrop-blur-sm rounded-t-3xl flex-shrink-0">
					🤖 AI có thể sai. Hãy kiểm tra với thầy cô nhé! 📚
				</footer>
			)}
		</div>
	);
}
