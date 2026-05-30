import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useLocation } from "react-router-dom";
import { TTSButton } from "../../components/TTSButton";
import { BuddyBot } from "../../components/BuddyBot";
import { GameShell } from "../../components/GameShell";
import { LoadingBuddy } from "../../components/Feedback";
import { askBuddy } from "../../lib/api";
import { useSession } from "../../hooks/useSession";

const chips = [
	"🤖 AI là gì?",
	"📝 Prompt là gì?",
	"🧠 Máy học là gì?",
	"❓ Vì sao AI có thể sai?",
	"🔢 Cho em một câu đố toán lớp 3.",
	"🍎 Giải thích bằng ví dụ trái cây.",
];

function formatMessageText(text: string) {
	const lines = text.split("\n");
	return lines.map((line, lineIdx) => {
		let content = line.trim();
		if (!content) return <div key={lineIdx} className="h-2" />;

		const isListItem = content.startsWith("* ") || content.startsWith("- ");
		if (isListItem) {
			content = content.substring(2).trim();
		}

		const parts = content.split(/\*\*([^*]+)\*\*/g);
		const parsedLine = parts.map((part, partIdx) => {
			if (partIdx % 2 === 1) {
				return (
					<strong key={partIdx} className="font-extrabold text-purpleLab">
						{part}
					</strong>
				);
			}
			return part;
		});

		if (isListItem) {
			return (
				<div
					key={lineIdx}
					className="flex items-start gap-1.5 my-1 pl-2 text-ink"
				>
					<span className="text-skyLab">✨</span>
					<span className="flex-1">{parsedLine}</span>
				</div>
			);
		}

		return (
			<p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
				{parsedLine}
			</p>
		);
	});
}

export function BuddyBotGame() {
	const { session } = useSession();
	const location = useLocation();
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			text: "Chào em! 👋 Mình là Buddy Bot. Em muốn khám phá điều gì về AI nào?",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const processedStory = useRef(false);
	const [activeChips, setActiveChips] = useState(chips);

	// Auto scroll to bottom when new messages arrive
	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, []);

	async function send(text = input) {
		if (!session || !text.trim()) return;
		setInput("");
		setMessages((items) => [...items, { role: "user", text }]);
		setLoading(true);

		// Generate dynamic chips based on keywords in user message
		let nextChips = chips;
		const lowerText = text.toLowerCase();
		if (lowerText.includes("chuyện") || lowerText.includes("kể")) {
			nextChips = [
				"📖 Kể tiếp câu chuyện đi!",
				"💡 Bài học của truyện là gì?",
				"🤖 AI có tự viết truyện không?",
				"🏠 Về phòng lab chơi game",
			];
		} else if (
			lowerText.includes("toán") ||
			lowerText.includes("đố") ||
			lowerText.includes("câu đố")
		) {
			nextChips = [
				"🔢 Cho em câu đố khác khó hơn!",
				"✨ Gợi ý cho em một chút đi",
				"🍎 Giải thích bằng hình ảnh trái cây",
				"🤖 Buddy Bot tự giải toán được không?",
			];
		} else if (
			lowerText.includes("ai") ||
			lowerText.includes("trí tuệ nhân tạo") ||
			lowerText.includes("máy học")
		) {
			nextChips = [
				"🧠 Làm thế nào để dạy AI học?",
				"❓ Tại sao AI có lúc đoán sai?",
				"📱 Điện thoại em có AI không?",
				"🎨 AI vẽ tranh như thế nào?",
			];
		} else if (
			lowerText.includes("prompt") ||
			lowerText.includes("câu lệnh") ||
			lowerText.includes("tranh") ||
			lowerText.includes("vẽ")
		) {
			nextChips = [
				"🪄 Cách viết prompt tạo tranh đẹp",
				"🛡️ An toàn hình ảnh là gì?",
				"💬 Nhờ Buddy Bot sửa prompt giúp em",
				"🎨 Đi vẽ tranh ở Xưởng Tranh AI",
			];
		} else {
			nextChips = [
				"🤖 Cậu học thế nào vậy?",
				"🍎 Cho em một ví dụ dễ hiểu",
				"❓ AI có cảm xúc thật không?",
				"🔢 Đố toán vui lớp 3 đi",
			];
		}
		setActiveChips(nextChips);

		const answer = await askBuddy(session.id, text)
			.then((r) => r.answer)
			.catch(() => "Buddy Bot đang nghỉ một chút. Em thử lại sau nhé.")
			.finally(() => setLoading(false));
		setMessages((items) => [...items, { role: "assistant", text: answer }]);
	}

	useEffect(() => {
		const state = location.state as { storyPrompt?: string } | null;
		if (session && state?.storyPrompt && !processedStory.current) {
			processedStory.current = true;
			const prompt = state.storyPrompt;
			// Clean up navigation state
			window.history.replaceState({}, document.title);
			void send(prompt);
		}
		// send thay đổi mỗi render nhưng processedStory.current đảm bảo chỉ chạy 1 lần
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, location.state, send]);

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			void send();
		}
	}

	return (
		<GameShell
			title="💬 Buddy Bot Trò Chuyện"
			subtitle="Trò chuyện với robot học tập an toàn."
			instruction="Trò chuyện với robot học tập Buddy Bot."
		>
			<section className="grid flex-1 gap-5 lg:grid-cols-[220px_1fr]">
				<div className="lab-card hidden place-items-center bg-white/80 p-5 lg:grid">
					<BuddyBot state={loading ? "thinking" : "happy"} size={190} />
					<p className="text-center text-sm font-bold text-muted mt-3">
						{loading ? "Đang suy nghĩ..." : "Sẵn sàng giúp em! 🌟"}
					</p>
				</div>
				<div className="lab-card flex min-h-[62dvh] flex-col bg-white/80 p-3 sm:p-5 lg:min-h-[560px]">
					{/* Suggested chips */}
					<div className="mb-3 flex snap-x gap-2.5 overflow-x-auto pb-1 sm:mb-4 sm:flex-wrap sm:overflow-visible sm:pb-0">
						{activeChips.map((chip) => (
							<button
								type="button"
								className="min-h-11 shrink-0 snap-start rounded-full border border-yellowLab/25 bg-cream/80 px-4 py-2.5 text-sm font-bold text-ink shadow-xs transition-all duration-300 hover:scale-[1.03] hover:border-yellowLab/40 hover:bg-yellowLab/20"
								key={chip}
								onClick={() => void send(chip)}
							>
								{chip}
							</button>
						))}
					</div>

					{/* Chat messages */}
					<div
						ref={chatRef}
						className="min-h-[300px] flex-1 overflow-y-auto rounded-3xl border border-white/40 bg-cream/60 p-3 scroll-smooth sm:p-4"
					>
						{messages.map((msg, i) => (
							<div
								key={i}
								className={`mb-3 flex max-w-[92%] gap-2.5 sm:max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
							>
								{msg.role === "assistant" && (
									<div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-skyLab to-purpleLab grid place-items-center text-white text-xs font-black shadow-sm mt-1">
										🤖
									</div>
								)}
								<div className="flex flex-col gap-1.5 min-w-0">
									<div
										className={`rounded-3xl p-4 font-semibold leading-relaxed ${
											msg.role === "user"
												? "bg-gradient-to-r from-skyLab to-blueLab text-white shadow-sm"
												: "bg-white text-ink shadow-xs border border-white/60"
										}`}
									>
										{formatMessageText(msg.text)}
									</div>
									{msg.role === "assistant" && (
										<div className="self-start pl-1">
											<TTSButton
												text={msg.text}
												compact
												autoPlay={i === messages.length - 1}
											/>
										</div>
									)}
								</div>
							</div>
						))}
						{loading && <LoadingBuddy />}
					</div>

					{/* Input */}
					<p className="mt-3 rounded-2xl border border-yellowLab/30 bg-yellowLab/15 px-4 py-2 text-xs font-black text-ink">
						🔒 Không nhập tên thật, số điện thoại, địa chỉ hoặc tên trường của
						em.
					</p>
					<div className="sticky bottom-0 mt-2 flex gap-2.5 rounded-2xl bg-white/85 pt-2 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:mt-3">
						<label className="sr-only" htmlFor="buddy-chat-input">
							Câu hỏi của em
						</label>
						<input
							id="buddy-chat-input"
							className="min-h-13 flex-1 rounded-2xl border-2 border-skyLab/25 hover:border-skyLab/40 focus:border-skyLab focus:ring-4 focus:ring-skyLab/15 px-5 font-semibold text-ink transition-all duration-300 focus:outline-none"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="✏️ Gõ câu hỏi ngắn rồi nhấn Enter..."
						/>
						<button
							type="button"
							aria-label="Gửi câu hỏi cho Buddy Bot"
							className="big-button bg-gradient-to-r from-ink to-ink/90 text-white shadow-md px-5 disabled:opacity-50"
							disabled={loading || !input.trim()}
							onClick={() => void send()}
						>
							<Send className="h-5 w-5" />
						</button>
					</div>
				</div>
			</section>
		</GameShell>
	);
}
