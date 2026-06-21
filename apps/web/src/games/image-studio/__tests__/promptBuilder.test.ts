import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { buildStudentPrompt } from "../promptBuilder";

const t = ((key: string, options?: Record<string, string>) => {
  if (key === "imageStudio.ui.promptTemplate") {
    return `${options?.style} ${options?.subject} ${options?.setting} ${options?.theme} ${options?.colors} ${options?.mood} ${options?.textOption}`;
  }
  const map: Record<string, string> = {
    "imageStudio.subjects.buddy_bot.value": "Buddy Bot",
    "imageStudio.settings.rainbow_classroom.value": "lớp cầu vồng",
    "imageStudio.themes.classroom_robot": "Robot lớp học",
    "imageStudio.styles.cartoon": "Hoạt hình",
    "imageStudio.colors.sky_blue": "xanh da trời",
    "imageStudio.moods.happy": "vui vẻ",
    "imageStudio.ui.promptWithText": "có chữ",
    "imageStudio.ui.promptWithoutText": "không chữ",
  };
  return map[key] ?? key;
}) as TFunction<"gameContent">;

describe("buildStudentPrompt", () => {
  it("ghép theme, style, subject, setting", () => {
    const prompt = buildStudentPrompt(t, "classroom_robot", "cartoon", {
      subjectId: "buddy_bot",
      subject: "",
      settingId: "rainbow_classroom",
      setting: "",
      colors: ["sky_blue"],
      mood: "happy",
      includeText: false,
    });
    expect(prompt).toContain("Hoạt hình");
    expect(prompt).toContain("Buddy Bot");
    expect(prompt).toContain("không chữ");
  });

  it("includeText true dùng nhánh có chữ", () => {
    const prompt = buildStudentPrompt(t, "classroom_robot", "cartoon", {
      subjectId: "buddy_bot",
      subject: "",
      settingId: "rainbow_classroom",
      setting: "",
      colors: ["sky_blue"],
      mood: "happy",
      includeText: true,
    });
    expect(prompt).toContain("có chữ");
  });
});
