export const safeRedirectMessage =
  "Câu hỏi này chưa phù hợp với lớp mình. Mình có thể cùng em học về AI, khoa học, tiếng Anh, toán vui hoặc tạo tranh an toàn nhé!";

export const imageRedirectMessage =
  "Ý tưởng này chưa phù hợp cho lớp mình. Em có thể tạo tranh về robot học tập, động vật dễ thương, vũ trụ hoặc thiên nhiên nhé!";

export const safeRedirectMessageEn =
  "This question isn't right for our class. We can learn about AI, science, English, fun math, or safe art together!";

export const imageRedirectMessageEn =
  "This idea isn't right for our class. You can make art about study robots, cute animals, space, or nature instead!";

export const personalDataMessage =
  "Mình không cần thông tin cá nhân đâu. Em hãy dùng biệt danh và quay lại bài học nhé!";

export const personalDataMessageEn =
  "I don't need personal information. Please use a nickname and let's get back to learning!";

export const safeTopicSwitchMessage =
  "Mình chuyển sang chủ đề học tập an toàn nhé.";

export const safeTopicSwitchMessageEn =
  "Let's switch to a safe learning topic!";

export const imageReadyMessage = "Prompt đã sẵn sàng để tạo tranh AI an toàn.";

export const imageReadyMessageEn =
  "Your prompt is ready to create safe AI art.";

export function getSafeRedirectMessage(locale: "vi" | "en") {
  return locale === "en" ? safeRedirectMessageEn : safeRedirectMessage;
}

export function getImageRedirectMessage(locale: "vi" | "en") {
  return locale === "en" ? imageRedirectMessageEn : imageRedirectMessage;
}

export function getPersonalDataMessage(locale: "vi" | "en") {
  return locale === "en" ? personalDataMessageEn : personalDataMessage;
}

export function getSafeTopicSwitchMessage(locale: "vi" | "en") {
  return locale === "en" ? safeTopicSwitchMessageEn : safeTopicSwitchMessage;
}

export function getImageReadyMessage(locale: "vi" | "en") {
  return locale === "en" ? imageReadyMessageEn : imageReadyMessage;
}
