import { GALLERY_MAX_ITEMS, GALLERY_STORAGE_KEY } from "./constants";
import type { GeneratedImage } from "./types";

export function loadGallery(): GeneratedImage[] {
  const saved = localStorage.getItem(GALLERY_STORAGE_KEY);
  if (!saved) {
    return [];
  }
  try {
    return JSON.parse(saved) as GeneratedImage[];
  } catch {
    return [];
  }
}

export function saveGallery(images: GeneratedImage[]): void {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(images));
}

export function prependToGallery(
  current: GeneratedImage[],
  newImage: GeneratedImage
): GeneratedImage[] {
  return [
    newImage,
    ...current.filter((img) => img.imageId !== newImage.imageId),
  ].slice(0, GALLERY_MAX_ITEMS);
}
