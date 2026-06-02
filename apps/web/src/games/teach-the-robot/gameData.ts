import type { Item, Level } from "./types";

export const easyItems: Item[] = [
  { icon: "🐱", label: "Mèo", group: "Động vật" },
  { icon: "🐶", label: "Chó", group: "Động vật" },
  { icon: "🍎", label: "Táo", group: "Trái cây" },
  { icon: "🍌", label: "Chuối", group: "Trái cây" },
  { icon: "🚗", label: "Xe đồ chơi", group: "Đồ chơi" },
  { icon: "⚽", label: "Bóng", group: "Đồ chơi" },
  { icon: "🦁", label: "Sư tử", group: "Động vật" },
  { icon: "🧸", label: "Gấu bông", group: "Đồ chơi" },
  { icon: "🐼", label: "Gấu trúc", group: "Động vật" },
  { icon: "🍓", label: "Dâu tây", group: "Trái cây" },
  { icon: "🚲", label: "Xe đạp đồ chơi", group: "Đồ chơi" },
  { icon: "🍉", label: "Dưa hấu", group: "Trái cây" },
];

export const hardItems: Item[] = [
  {
    icon: "🦇",
    label: "Con dơi",
    group: "Động vật",
    hint: "Biết bay như chim nhưng là loài thú đẻ con đấy!",
  },
  {
    icon: "🐬",
    label: "Cá heo",
    group: "Động vật",
    hint: "Sống dưới nước như cá nhưng thực chất là thú!",
  },
  {
    icon: "🍅",
    label: "Cà chua",
    group: "Trái cây",
    hint: "Rất hay bị nhầm là rau củ dùng để nấu canh.",
  },
  {
    icon: "🥑",
    label: "Quả bơ",
    group: "Trái cây",
    hint: "Béo ngậy và ít ngọt nhưng vẫn là quả trái cây.",
  },
  {
    icon: "🚙",
    label: "Ô tô nhựa mini",
    group: "Đồ chơi",
    hint: "Trông giống xe thật nhưng nhỏ bằng bàn tay, chỉ để bé chơi!",
  },
  {
    icon: "🦖",
    label: "Khủng long nhựa",
    group: "Đồ chơi",
    hint: "Hình dáng con vật nhưng làm từ nhựa để bé chơi!",
  },
  {
    icon: "🚁",
    label: "Máy bay điều khiển",
    group: "Đồ chơi",
    hint: "Có cánh quạt bay được nhưng chỉ là đồ chơi chạy pin.",
  },
  {
    icon: "🍍",
    label: "Quả dứa",
    group: "Trái cây",
    hint: "Nhiều gai góc xù xì trông rất giống con nhím.",
  },
  {
    icon: "🦉",
    label: "Chim cú mèo",
    group: "Động vật",
    hint: "Có tên gọi là 'cú mèo' nhưng thực ra là loài chim bay đêm.",
  },
  {
    icon: "🦦",
    label: "Rái cá",
    group: "Động vật",
    hint: "Trông giống mèo nước nhưng bơi lội cực giỏi!",
  },
  {
    icon: "🍉",
    label: "Dưa đỏ",
    group: "Trái cây",
    hint: "Vỏ xanh ruột đỏ nhưng lại thuộc họ bầu bí dây leo!",
  },
  {
    icon: "🧩",
    label: "Mảnh Lego",
    group: "Đồ chơi",
    hint: "Nhìn như khối nhựa gạch xây dựng nhưng ghép thành đồ chơi!",
  },
];

export function getItemsForLevel(level: Level): Item[] {
  return level === "easy" ? easyItems : hardItems;
}
