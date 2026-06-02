export interface ImageDetails {
  colors: string[];
  includeText: boolean;
  mood: string;
  setting: string;
  subject: string;
}

export interface GeneratedImage {
  imageId: string;
  imageUrl: string;
  label: string;
  promptUsed: string;
}
