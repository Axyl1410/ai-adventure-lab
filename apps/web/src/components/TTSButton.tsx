import { useEffect, useState, useRef, useCallback } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { speak } from "../lib/api";

// Pre-load browser voices (async in Chrome/Edge)
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
	return new Promise((resolve) => {
		const voices = window.speechSynthesis?.getVoices() ?? [];
		if (voices.length > 0) return resolve(voices);
		const handler = () => resolve(window.speechSynthesis.getVoices());
		window.speechSynthesis?.addEventListener("voiceschanged", handler, {
			once: true,
		});
		// Fallback nếu event không fire (Firefox)
		setTimeout(() => resolve(window.speechSynthesis?.getVoices() ?? []), 1200);
	});
}

/**
 * Chọn giọng vi-VN phù hợp giới tính.
 * Microsoft voices: "HoaiMy" = nữ, "NamMinh" = nam
 * Nếu không có, fallback sang voice đầu tiên + pitch để phân biệt.
 */
function pickVoice(
	voices: SpeechSynthesisVoice[],
	isMale: boolean,
): SpeechSynthesisVoice | undefined {
	// Lọc tất cả giọng tiếng Việt
	const viVoices = voices.filter(
		(v) =>
			v.lang === "vi-VN" ||
			v.lang === "vi" ||
			v.name.toLowerCase().includes("vietnam") ||
			v.name.toLowerCase().includes("vietnamese"),
	);

	if (viVoices.length === 0) return undefined;

	// Tên vi-VN thường gặp trên Windows/Edge/Chrome:
	// Nữ: HoaiMy, Hoai My, Thu, female, woman, girl
	// Nam: NamMinh, Nam Minh, male, man, boy
	const femaleKeywords = ["hoaimy", "hoai my", "hoai_my", "thu", "female", "woman", "girl"];
	const maleKeywords = ["namminh", "nam minh", "nam_minh", "male", "man", "boy"];

	const targetKeywords = isMale ? maleKeywords : femaleKeywords;
	const found = viVoices.find((v) =>
		targetKeywords.some((kw) => v.name.toLowerCase().replace(/\s+/g, "").includes(kw.replace(/\s+/g, ""))),
	);

	if (found) return found;

	// Không tìm được theo tên → dùng index:
	// Voices thường được sort: HoaiMy (nữ) trước NamMinh (nam)
	if (isMale && viVoices.length >= 2) return viVoices[1];
	return viVoices[0];
}

// ---------------------------------------------------------------------------
// Module-level: shared state across all TTSButton instances
// ---------------------------------------------------------------------------

/** null = chưa kiểm tra, true = backend OK, false = chỉ dùng browser */
let backendAvailable: boolean | null = null;
let backendCheckPromise: Promise<boolean> | null = null;

/** Lấy voice name hiện tại theo localStorage gender */
function getCurrentVoice() {
	const gender = localStorage.getItem("ai-lab-tts-gender") || "female";
	return gender === "male" ? "minhkhang" : "ngochuyen";
}

/** Kiểm tra backend TTS — dùng voice đang được chọn */
function checkBackend(): Promise<boolean> {
	if (backendAvailable !== null) return Promise.resolve(backendAvailable);
	if (backendCheckPromise) return backendCheckPromise;

	backendCheckPromise = (async () => {
		try {
			const voice = getCurrentVoice();
			const result = await Promise.race([
				speak("Xin chào", voice),
				new Promise<null>((_, reject) =>
					setTimeout(() => reject(new Error("timeout")), 3000),
				),
			]);
			const ok = !!(result && (result as { audioUrl?: string }).audioUrl);
			backendAvailable = ok;
			return ok;
		} catch {
			backendAvailable = false;
			return false;
		} finally {
			backendCheckPromise = null;
		}
	})();

	return backendCheckPromise;
}

// Dừng mọi audio đang phát (backend hoặc browser)
let stopActiveAudio: (() => void) | null = null;
let activeAudio: HTMLAudioElement | null = null;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TTSButton({
	text,
	compact,
	autoPlay,
}: {
	text: string;
	compact?: boolean;
	autoPlay?: boolean;
}) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Lắng nghe sự kiện đổi giọng → reset backend cache
	// Đặt trong useEffect để cleanup đúng khi HMR reload
	useEffect(() => {
		const onGenderChange = () => {
			backendAvailable = null;
			backendCheckPromise = null;
		};
		window.addEventListener("tts-gender-changed", onGenderChange);
		return () => window.removeEventListener("tts-gender-changed", onGenderChange);
	}, []);

	// Dùng Web Speech API (browser built-in) — fallback khi backend offline
	const speakWithBrowser = useCallback(
		async (utterText: string) => {
			if (!window.speechSynthesis) return;
			window.speechSynthesis.cancel();

			const gender = localStorage.getItem("ai-lab-tts-gender") || "female";
			const isMale = gender === "male";

			const utter = new SpeechSynthesisUtterance(utterText);
			utter.lang = "vi-VN";
			// Tốc độ và pitch khác nhau để phân biệt nam/nữ rõ hơn
			utter.rate = isMale ? 0.85 : 0.95;
			utter.pitch = isMale ? 0.6 : 1.15;

			// Chờ load voices (async trong Chrome/Edge)
			const voices = await loadVoices();

			// Chọn giọng phù hợp — nhận diện theo tên voice thực tế của Windows/Edge
			const selectedVoice = pickVoice(voices, isMale);
			if (selectedVoice) utter.voice = selectedVoice;

			// Log để debug (sẽ xóa sau khi confirm OK)
			console.log(
				`[TTS] gender=${gender} voice="${selectedVoice?.name ?? "default"}" pitch=${utter.pitch} rate=${utter.rate}`,
			);

			utter.onstart = () => setIsPlaying(true);
			utter.onend = () => {
				setIsPlaying(false);
				stopActiveAudio = null;
			};
			utter.onerror = () => {
				setIsPlaying(false);
				stopActiveAudio = null;
			};

			stopActiveAudio = () => {
				window.speechSynthesis.cancel();
				setIsPlaying(false);
			};

			window.speechSynthesis.speak(utter);
		},
		[],
	);

	// Phát audio từ backend TTS — voice được lấy tại thời điểm gọi
	const speakWithBackend = useCallback(
		async (utterText: string) => {
			// Đọc gender từ localStorage ngay lúc phát (không cache)
			const voice = getCurrentVoice();

			try {
				const result = await speak(utterText, voice);
				setIsLoading(false);

				if (!result?.audioUrl) {
					// Backend trả lỗi → fallback browser
					backendAvailable = false;
					void speakWithBrowser(utterText);
					return;
				}

				const audio = new Audio(result.audioUrl);
				audioRef.current = audio;
				activeAudio = audio;

				stopActiveAudio = () => {
					audio.pause();
					audio.currentTime = 0;
					setIsPlaying(false);
				};

				setIsPlaying(true);
				audio.play().catch(() => {
					// Autoplay bị block → fallback browser
					void speakWithBrowser(utterText);
				});
				audio.onended = () => {
					setIsPlaying(false);
					if (activeAudio === audio) {
						activeAudio = null;
						stopActiveAudio = null;
					}
				};
			} catch {
				setIsLoading(false);
				backendAvailable = false;
				void speakWithBrowser(utterText);
			}
		},
		[speakWithBrowser],
	);

	const onSpeak = useCallback(async () => {
		// --- Dừng nếu đang phát ---
		if (isPlaying) {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}
			if (window.speechSynthesis?.speaking) {
				window.speechSynthesis.cancel();
			}
			setIsPlaying(false);
			return;
		}

		// Dừng audio khác đang phát
		if (stopActiveAudio) stopActiveAudio();

		setIsLoading(true);

		// Kiểm tra backend (dùng cache nếu đã biết kết quả)
		const useBackend = await checkBackend();
		setIsLoading(false);

		if (useBackend) {
			setIsLoading(true);
			await speakWithBackend(text);
		} else {
			void speakWithBrowser(text);
		}
	}, [text, isPlaying, speakWithBackend, speakWithBrowser]);

	// Autoplay khi câu hỏi mới xuất hiện
	useEffect(() => {
		const autoplayEnabled =
			localStorage.getItem("ai-lab-tts-autoplay") === "true";
		if (autoPlay && autoplayEnabled && text) {
			const timer = setTimeout(() => {
				void onSpeak();
			}, 500);
			return () => clearTimeout(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [text, autoPlay]);

	// Dừng audio khi component unmount
	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
			}
		};
	}, []);

	return (
		<button
			type="button"
			className={
				compact
					? `grid h-11 w-11 shrink-0 place-items-center rounded-full text-white shadow-sm transition-all hover:scale-105 active:scale-100 ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
					: `big-button text-white transition-all ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
			}
			onClick={onSpeak}
			disabled={isLoading}
			aria-label="Nghe nội dung"
		>
			{isLoading ? (
				<Loader2
					className={
						compact
							? "h-5 w-5 animate-spin"
							: "mr-2 inline h-5 w-5 animate-spin"
					}
				/>
			) : (
				<Volume2 className={compact ? "h-5 w-5" : "mr-2 inline h-5 w-5"} />
			)}
			{!compact && (isLoading ? "Đang tải..." : isPlaying ? "Dừng" : "Nghe")}
		</button>
	);
}
