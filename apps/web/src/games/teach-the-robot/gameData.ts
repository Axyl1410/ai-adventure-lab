import type { ItemBase, Level } from "./types";

export const easyItems: ItemBase[] = [
  { id: "cat", icon: "🐱", group: "animals" },
  { id: "dog", icon: "🐶", group: "animals" },
  { id: "apple", icon: "🍎", group: "fruit" },
  { id: "banana", icon: "🍌", group: "fruit" },
  { id: "toy_car", icon: "🚗", group: "toys" },
  { id: "ball", icon: "⚽", group: "toys" },
  { id: "lion", icon: "🦁", group: "animals" },
  { id: "teddy", icon: "🧸", group: "toys" },
  { id: "panda", icon: "🐼", group: "animals" },
  { id: "strawberry", icon: "🍓", group: "fruit" },
  { id: "toy_bike", icon: "🚲", group: "toys" },
  { id: "watermelon", icon: "🍉", group: "fruit" },
];

export const hardItems: ItemBase[] = [
  { id: "bat", icon: "🦇", group: "animals" },
  { id: "dolphin", icon: "🐬", group: "animals" },
  { id: "tomato", icon: "🍅", group: "fruit" },
  { id: "avocado", icon: "🥑", group: "fruit" },
  { id: "mini_car", icon: "🚙", group: "toys" },
  { id: "plastic_dino", icon: "🦖", group: "toys" },
  { id: "rc_helicopter", icon: "🚁", group: "toys" },
  { id: "pineapple", icon: "🍍", group: "fruit" },
  { id: "owl", icon: "🦉", group: "animals" },
  { id: "otter", icon: "🦦", group: "animals" },
  { id: "red_melon", icon: "🍉", group: "fruit" },
  { id: "lego_piece", icon: "🧩", group: "toys" },
];

export function getItemsForLevel(level: Level): ItemBase[] {
  return level === "easy" ? easyItems : hardItems;
}
