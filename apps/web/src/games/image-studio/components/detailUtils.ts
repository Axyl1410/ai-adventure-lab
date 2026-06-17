import type { ImageColorId } from "../studioData";

export function toggleColorSelection(
  items: ImageColorId[],
  value: ImageColorId
): ImageColorId[] {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}
