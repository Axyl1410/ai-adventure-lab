import { useState } from "react";
import {
	Download,
	Sparkles,
	Trash2,
	HelpCircle,
	Check,
	BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TTSButton } from "../../components/TTSButton";

export const suggestedSubjects = [
	{ label: "chú mèo đeo ba lô 🐱", value: "một chú mèo con đeo ba lô" },
	{ label: "robot Buddy Bot 🤖", value: "chú robot Buddy Bot vui vẻ" },
	{ label: "cá heo mỉm cười 🐬", value: "chú cá heo đang cười lớn" },
	{ label: "phi thuyền vũ trụ 🚀", value: "chiếc phi thuyền vũ trụ bay lượn" },
	{ label: "khủng long tinh nghịch 🦖", value: "chú khủng long con tinh nghịch" },
	{ label: "gấu bông dễ thương 🧸", value: "chú gấu bông dễ thương" },
];

export const suggestedSettings = [
	{ label: "lớp học cầu vồng 🏫", value: "trong lớp học cầu vồng" },
	{ label: "vũ trụ đầy sao 🌌", value: "ngoài vũ trụ bao la đầy sao" },
	{ label: "khu rừng phép thuật 🌲", value: "trong khu rừng phép thuật lấp lánh" },
	{ label: "bãi biển ấm áp 🏖️", value: "trên bãi biển ngập nắng ấm áp" },
	{ label: "đại dương sâu thẳm 🌊", value: "dưới đại dương sâu thẳm nhiều san hô" },
	{ label: "công viên giải trí 🎡", value: "trong công viên giải trí nhộn nhịp" },
];

export const themes = [
	"Động vật dễ thương",
	"Robot trong lớp học",
	"Hành tinh và vũ trụ",
	"Khu rừng cầu vồng",
	"Đồ vật học tập",
	"Nhân vật truyện cổ tích không có bản quyền",
	"Biển và sinh vật biển",
	"Thành phố tương lai thân thiện",
];
export const styles = [
	"Tranh hoạt hình",
	"Tranh màu nước",
	"Sticker vui nhộn",
	"Poster lớp học",
	"Sách tranh thiếu nhi",
	"Pixel art đơn giản",
];

export function ImageThemePicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<Picker
			title="🎨 Chọn chủ đề tranh"
			items={themes}
			value={value}
			onChange={onChange}
			activeColor="bg-pinkLab text-white border-pinkLab/40 hover:bg-pinkLab/90"
		/>
	);
}

export function ImageStylePicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<Picker
			title="✨ Chọn phong cách vẽ"
			items={styles}
			value={value}
			onChange={onChange}
			activeColor="bg-purpleLab text-white border-purpleLab/40 hover:bg-purpleLab/90"
		/>
	);
}

function Picker({
	title,
	items,
	value,
	onChange,
	activeColor,
}: {
	title: string;
	items: string[];
	value: string;
	onChange: (value: string) => void;
	activeColor: string;
}) {
	return (
		<div className="space-y-3">
			<h2 className="text-xl font-black text-ink flex items-center gap-1.5">
				{title}
			</h2>
			<div className="flex flex-wrap gap-2.5">
				{items.map((item) => {
					const isSelected = value === item;
					return (
						<button
							type="button"
							key={item}
							className={`big-button border px-4 py-2.5 text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-102 ${
								isSelected
									? `${activeColor} shadow-md`
									: "bg-white/80 border-white/50 text-ink hover:bg-white hover:border-skyLab/40"
							}`}
							onClick={() => onChange(item)}
						>
							{isSelected && <Check className="h-4 w-4" />}
							{item}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export function ImageDetailBuilder({
	details,
	setDetails,
}: {
	details: ImageDetails;
	setDetails: (value: ImageDetails) => void;
}) {
	const colors = ["xanh da trời", "vàng", "hồng", "xanh lá", "tím", "cam"];
	const [customSubject, setCustomSubject] = useState(false);
	const [customSetting, setCustomSetting] = useState(false);

	return (
		<div className="grid gap-5 bg-white/40 p-4 rounded-3xl border border-white/50 shadow-inner">
			{/* Vẽ ai hoặc cái gì? */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<label className="text-sm font-black text-muted ml-1">
						Vẽ ai hoặc cái gì?
					</label>
					<button
						type="button"
						onClick={() => setCustomSubject(!customSubject)}
						className="text-xs font-black text-purple-600 bg-purpleLab/10 border border-purpleLab/20 rounded-xl px-2.5 py-1 hover:bg-purpleLab/20 transition-all focus:outline-none"
					>
						{customSubject ? "📋 Chọn nhanh" : "✏️ Em tự viết"}
					</button>
				</div>

				{customSubject ? (
					<input
						className="w-full rounded-2xl border-2 border-skyLab/20 hover:border-skyLab/40 focus:border-skyLab focus:ring-4 focus:ring-skyLab/15 px-4 py-3 font-semibold text-ink transition-all duration-300 focus:outline-none bg-white"
						value={details.subject}
						onChange={(e) => setDetails({ ...details, subject: e.target.value })}
						placeholder="Ví dụ: một chú mèo con đeo ba lô"
					/>
				) : (
					<div className="flex flex-wrap gap-2">
						{suggestedSubjects.map((sub) => {
							const isSelected = details.subject === sub.value;
							return (
								<button
									type="button"
									key={sub.value}
									onClick={() => setDetails({ ...details, subject: sub.value })}
									className={`rounded-2xl px-3.5 py-2 font-bold text-xs border transition-all duration-300 focus:outline-none ${
										isSelected
											? "bg-purpleLab border-purpleLab/55 text-white scale-102 shadow-sm font-black"
											: "bg-white/80 border-white/50 text-ink hover:border-purpleLab/35 hover:bg-white"
									}`}
								>
									{sub.label}
								</button>
							);
						})}
					</div>
				)}
			</div>

			{/* Ở đâu? (Bối cảnh) */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<label className="text-sm font-black text-muted ml-1">
						Ở đâu? (Bối cảnh)
					</label>
					<button
						type="button"
						onClick={() => setCustomSetting(!customSetting)}
						className="text-xs font-black text-purple-600 bg-purpleLab/10 border border-purpleLab/20 rounded-xl px-2.5 py-1 hover:bg-purpleLab/20 transition-all focus:outline-none"
					>
						{customSetting ? "📋 Chọn nhanh" : "✏️ Em tự viết"}
					</button>
				</div>

				{customSetting ? (
					<input
						className="w-full rounded-2xl border-2 border-skyLab/20 hover:border-skyLab/40 focus:border-skyLab focus:ring-4 focus:ring-skyLab/15 px-4 py-3 font-semibold text-ink transition-all duration-300 focus:outline-none bg-white"
						value={details.setting}
						onChange={(e) => setDetails({ ...details, setting: e.target.value })}
						placeholder="Ví dụ: trong khu vườn hoa lấp lánh"
					/>
				) : (
					<div className="flex flex-wrap gap-2">
						{suggestedSettings.map((set) => {
							const isSelected = details.setting === set.value;
							return (
								<button
									type="button"
									key={set.value}
									onClick={() => setDetails({ ...details, setting: set.value })}
									className={`rounded-2xl px-3.5 py-2 font-bold text-xs border transition-all duration-300 focus:outline-none ${
										isSelected
											? "bg-pinkLab border-pinkLab/55 text-white scale-102 shadow-sm font-black"
											: "bg-white/80 border-white/50 text-ink hover:border-pinkLab/35 hover:bg-white"
									}`}
								>
									{set.label}
								</button>
							);
						})}
					</div>
				)}
			</div>


			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1">
					<label className="text-sm font-black text-muted ml-1">
						Cảm xúc tranh
					</label>
					<select
						className="w-full rounded-2xl border-2 border-skyLab/20 hover:border-skyLab/40 focus:border-skyLab focus:ring-4 focus:ring-skyLab/15 px-4 py-3 font-bold text-ink transition-all duration-300 focus:outline-none"
						value={details.mood}
						onChange={(e) => setDetails({ ...details, mood: e.target.value })}
					>
						<option>vui vẻ</option>
						<option>tò mò</option>
						<option>ấm áp</option>
						<option>hào hứng</option>
					</select>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-black text-muted ml-1">
						Có chữ ngắn
					</label>
					<label className="flex items-center gap-3 rounded-2xl bg-white border border-white/60 p-3 font-bold text-ink cursor-pointer hover:bg-cream/40 transition-colors">
						<input
							type="checkbox"
							className="h-5 w-5 rounded-md border-skyLab text-purpleLab focus:ring-purpleLab"
							checked={details.includeText}
							onChange={(e) =>
								setDetails({ ...details, includeText: e.target.checked })
							}
						/>
						<span>Thêm chữ ngắn</span>
					</label>
				</div>
			</div>

			<div className="space-y-2 mt-1">
				<label className="text-sm font-black text-muted ml-1">
					🎨 Chọn các màu sắc chính:
				</label>
				<div className="flex flex-wrap gap-2">
					{colors.map((color) => {
						const isSelected = details.colors.includes(color);
						return (
							<button
								type="button"
								key={color}
								className={`rounded-full px-4 py-2 font-bold text-sm transition-all duration-300 shadow-xs border ${
									isSelected
										? "bg-yellowLab border-yellowLab/50 text-ink scale-105"
										: "bg-white border-white/40 text-muted hover:border-skyLab/30"
								}`}
								onClick={() =>
									setDetails({
										...details,
										colors: toggle(details.colors, color),
									})
								}
							>
								{isSelected ? `✓ ${color}` : color}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function ImagePromptPreview({ prompt }: { prompt: string }) {
	return (
		<div className="rounded-3xl bg-cream/70 border border-yellowLab/30 p-4 shadow-sm sm:p-5">
			<h2 className="mb-2 flex items-center gap-1.5 text-base font-black text-ink">
				<HelpCircle className="h-5 w-5 shrink-0 text-orangeLab animate-bounce" />{" "}
				Câu thần chú prompt gửi tới AI:
			</h2>
			<div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
				<p className="flex-1 break-words rounded-2xl border border-white/50 bg-white/70 p-3 text-sm font-semibold italic leading-relaxed text-muted">
					{prompt}
				</p>
				<TTSButton text={prompt} compact />
			</div>
		</div>
	);
}

export function AiGeneratedLabel() {
	return (
		<span className="rounded-full bg-yellowLab/35 border border-yellowLab/55 px-3 py-1.5 text-xs font-black text-ink flex items-center gap-1">
			✨ Hình được tạo bởi AI
		</span>
	);
}

export function GeneratedImageCard({
	image,
	teacher,
	onDelete,
	compact,
}: {
	image: GeneratedImage;
	teacher?: boolean;
	onDelete?: () => void;
	compact?: boolean;
}) {
	const navigate = useNavigate();

	const handleStory = () => {
		navigate("/games/buddy-bot", {
			state: {
				storyPrompt: `Hãy kể một câu chuyện ngắn khoảng 4-6 câu thật vui vẻ, dễ thương và có bài học ý nghĩa về bức tranh này: ${image.promptUsed}`,
			},
		});
	};

	return (
		<article className="lab-card p-4 space-y-3 sm:p-5">
			<div className="relative overflow-hidden rounded-2xl shadow-md border border-white/30">
				<img
					className={`w-full object-cover transition-transform duration-500 hover:scale-103 ${compact ? "max-h-52" : "aspect-square"}`}
					src={image.imageUrl}
					alt="Tranh AI được tạo từ prompt"
				/>
				<div className="absolute bottom-3 left-3">
					<AiGeneratedLabel />
				</div>
			</div>

			{!compact && (
				<div className="space-y-1.5">
					<p className="text-xs font-black text-muted uppercase tracking-wider ml-1">
						Lệnh prompt đã dùng:
					</p>
					<div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
						<p className="flex-grow break-words rounded-2xl bg-cream/60 border border-yellowLab/20 p-3 text-sm font-bold text-ink leading-relaxed">
							{image.promptUsed}
						</p>
						<TTSButton text={image.promptUsed} compact />
					</div>
				</div>
			)}

			<div className="flex flex-wrap gap-2.5 pt-1">
				<a
					className="big-button flex-1 bg-skyLab hover:bg-skyLab/90 text-white flex items-center justify-center gap-1.5"
					href={image.imageUrl}
					download
				>
					<Download className="h-5 w-5" /> Tải xuống
				</a>
				<button
					className="big-button flex-1 bg-purpleLab hover:bg-purpleLab/90 text-white flex items-center justify-center gap-1.5"
					onClick={handleStory}
				>
					<BookOpen className="h-5 w-5" /> Kể chuyện
				</button>
				{teacher && (
					<button
						className="big-button bg-redSoft border border-redSoft/30 text-ink flex items-center justify-center gap-1.5 hover:bg-redSoft/80"
						onClick={onDelete}
					>
						<Trash2 className="h-5 w-5 text-red-600" /> Xóa
					</button>
				)}
			</div>
		</article>
	);
}

export function ImageGallery({ images }: { images: GeneratedImage[] }) {
	return (
		<div className="grid gap-5 md:grid-cols-2">
			{images.map((image) => (
				<GeneratedImageCard key={image.imageId} image={image} />
			))}
		</div>
	);
}

export function TeacherImageReviewPanel() {
	return (
		<div className="rounded-3xl bg-yellowLab/15 border border-yellowLab/25 p-5 font-bold text-ink leading-relaxed shadow-sm">
			💡 Chế độ Giáo viên: Bạn có thể xem lại thư viện các bức tranh học sinh đã
			tạo, xóa các hình ảnh không phù hợp và thiết lập quy trình kiểm duyệt
			tranh trước khi hiển thị cho cả lớp.
		</div>
	);
}

export interface ImageDetails {
	subject: string;
	setting: string;
	colors: string[];
	mood: string;
	includeText: boolean;
}

export interface GeneratedImage {
	imageId: string;
	imageUrl: string;
	promptUsed: string;
	label: string;
}

function toggle(items: string[], value: string) {
	return items.includes(value)
		? items.filter((item) => item !== value)
		: [...items, value];
}
