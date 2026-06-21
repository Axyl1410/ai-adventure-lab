import { beforeEach, describe, expect, it, vi } from "vitest";
import { GALLERY_MAX_ITEMS } from "../constants";
import { loadGallery, prependToGallery, saveGallery } from "../galleryStorage";
import type { GeneratedImage } from "../types";

const image = (id: string): GeneratedImage => ({
  imageId: id,
  imageUrl: `/api/uploads/generated-images/${id}.svg`,
  promptUsed: "robot",
  label: "Hình này được tạo bởi AI.",
});

describe("galleryStorage", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    });
  });

  it("loadGallery trả [] khi chưa có dữ liệu", () => {
    expect(loadGallery()).toEqual([]);
  });

  it("saveGallery và loadGallery round-trip", () => {
    saveGallery([image("a"), image("b")]);
    expect(loadGallery()).toHaveLength(2);
  });

  it("loadGallery trả [] khi JSON hỏng", () => {
    storage.set("ai-lab-images-gallery", "{bad json");
    expect(loadGallery()).toEqual([]);
  });

  it("prependToGallery dedupe theo imageId", () => {
    const next = prependToGallery([image("a"), image("b")], image("a"));
    expect(next.map((item) => item.imageId)).toEqual(["a", "b"]);
  });

  it("prependToGallery giới hạn GALLERY_MAX_ITEMS", () => {
    const current = Array.from({ length: GALLERY_MAX_ITEMS }, (_, index) =>
      image(`img-${index}`)
    );
    const next = prependToGallery(current, image("new"));
    expect(next).toHaveLength(GALLERY_MAX_ITEMS);
    expect(next[0]?.imageId).toBe("new");
  });
});
