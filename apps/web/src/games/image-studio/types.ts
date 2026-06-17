import type {
  ImageColorId,
  ImageMoodId,
  ImageSettingId,
  ImageSubjectId,
} from "./studioData";

export interface ImageDetails {
  colors: ImageColorId[];
  includeText: boolean;
  mood: ImageMoodId;
  setting: string;
  settingId: ImageSettingId | "custom";
  subject: string;
  subjectId: ImageSubjectId | "custom";
}

export interface GeneratedImage {
  imageId: string;
  imageUrl: string;
  label: string;
  promptUsed: string;
}

export type { ImageStyleId, ImageThemeId } from "./studioData";
