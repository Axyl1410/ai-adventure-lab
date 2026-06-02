interface GenerateImageButtonProps {
  loading: boolean;
  onGenerate: () => void;
}

export function GenerateImageButton({
  loading,
  onGenerate,
}: GenerateImageButtonProps) {
  return (
    <button
      className={`big-button w-full text-lg text-white shadow-md transition-all duration-300 ${
        loading
          ? "cursor-not-allowed bg-muted/70"
          : "bg-gradient-to-r from-purpleLab to-pinkLab hover:scale-101 hover:shadow-lg active:scale-99"
      }`}
      disabled={loading}
      onClick={onGenerate}
      type="button"
    >
      {loading ? "⏳ Đang tạo tranh..." : "🎨 Tạo tranh AI"}
    </button>
  );
}
