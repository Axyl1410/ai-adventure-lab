import type { GeneratedImage } from "../types";
import { GeneratedImageCard } from "./GeneratedImageCard";

interface ImageGalleryProps {
  images: GeneratedImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {images.map((image) => (
        <GeneratedImageCard image={image} key={image.imageId} />
      ))}
    </div>
  );
}
