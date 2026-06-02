export type Category = "Dữ liệu tốt" | "Dữ liệu nhiễu" | "Thông tin riêng tư";

export interface SorterCard {
  category: Category;
  emoji: string;
  explain: string;
  text: string;
}
