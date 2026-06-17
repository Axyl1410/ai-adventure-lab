import { useTranslation } from "react-i18next";
import type { GeneratedImage } from "../types";
import { GeneratedImageCard } from "./GeneratedImageCard";

interface StudentGallerySectionProps {
  gallery: GeneratedImage[];
}

export function StudentGallerySection({ gallery }: StudentGallerySectionProps) {
  const { t } = useTranslation("gameContent");

  return (
    <section className="mt-12 space-y-6">
      <h2 className="flex items-center gap-2 border-white/50 border-b pb-2 font-black text-3xl text-ink">
        {t("imageStudio.ui.galleryTitle")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((img) => (
          <GeneratedImageCard image={img} key={img.imageId} />
        ))}
      </div>
    </section>
  );
}
