import { CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { BuddyBot } from "./BuddyBot";
import { TTSButton } from "./TTSButton";

export function HappyFeedback({ text }: { text: string }) {
	return (
		<div className="flex flex-col sm:flex-row items-center gap-5 rounded-3xl bg-greenLab/15 border border-greenLab/25 p-5 font-bold text-ink text-center sm:text-left">
			<div className="flex-shrink-0">
				<BuddyBot state="celebrating" size={85} />
			</div>
			<div className="flex-1">
				<div className="flex items-center justify-center sm:justify-start gap-1.5 text-green-700 text-xl font-black mb-1.5">
					<CheckCircle2 className="h-6 w-6 text-green-600" />
					<span>Đúng rồi!</span>
				</div>
				<p className="text-ink text-base font-semibold leading-relaxed">
					{text}
				</p>
			</div>
			<div className="flex-shrink-0">
				<TTSButton text={text} compact autoPlay />
			</div>
		</div>
	);
}

export function TryAgainFeedback({ text }: { text: string }) {
	return (
		<div className="flex flex-col sm:flex-row items-center gap-5 rounded-3xl bg-yellowLab/20 border border-yellowLab/30 p-5 font-bold text-ink text-center sm:text-left">
			<div className="flex-shrink-0">
				<BuddyBot state="warning" size={85} />
			</div>
			<div className="flex-1">
				<div className="flex items-center justify-center sm:justify-start gap-1.5 text-orange-600 text-xl font-black mb-1.5">
					<Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
					<span>Ồ, chú ý nhé!</span>
				</div>
				<p className="text-ink text-base font-semibold leading-relaxed">
					{text}
				</p>
			</div>
			<div className="flex-shrink-0">
				<TTSButton text={text} compact autoPlay />
			</div>
		</div>
	);
}

export function SafetyRedirect({ text }: { text: string }) {
	return (
		<div className="flex flex-col sm:flex-row items-center gap-5 rounded-3xl bg-redSoft/15 border border-redSoft/30 p-5 font-bold text-ink text-center sm:text-left">
			<div className="flex-shrink-0">
				<BuddyBot state="warning" size={85} />
			</div>
			<div className="flex-1">
				<div className="flex items-center justify-center sm:justify-start gap-1.5 text-red-600 text-xl font-black mb-1.5">
					<ShieldAlert className="h-6 w-6 text-red-500" />
					<span>Nguyên tắc An toàn</span>
				</div>
				<p className="text-ink text-base font-semibold leading-relaxed">
					{text}
				</p>
			</div>
			<div className="flex-shrink-0">
				<TTSButton text={text} compact autoPlay />
			</div>
		</div>
	);
}

export function BadgeReward({ text }: { text: string }) {
	return (
		<span className="rounded-full bg-purpleLab/20 px-3 py-2 text-sm font-black text-ink">
			{text}
		</span>
	);
}

export function ConfettiSuccess() {
	return (
		<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#FACC15_2px,transparent_3px)] bg-[length:28px_28px] opacity-20" />
	);
}

export function LoadingBuddy() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/60 border border-white/40 p-6 text-center font-bold text-muted backdrop-blur-xs">
			<BuddyBot state="thinking" size={95} />
			<p className="text-ink text-lg font-black animate-pulse">
				Buddy Bot đang suy nghĩ một chút...
			</p>
		</div>
	);
}
