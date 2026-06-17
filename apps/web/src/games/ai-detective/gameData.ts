import type { DetectiveQuestionBase, Level } from "./types";

export const easyQuestions: DetectiveQuestionBase[] = [
  { id: "youtube_suggests_videos", emoji: "📺", answer: true },
  { id: "fan_button_spin", emoji: "🌀", answer: false },
  { id: "alarm_at_six", emoji: "⏰", answer: false },
  { id: "flashlight_switch", emoji: "🔦", answer: false },
  { id: "robot_vacuum_avoids", emoji: "🤖", answer: true },
  { id: "streetlight_sensor", emoji: "💡", answer: false },
  { id: "calculator_addition", emoji: "🧮", answer: false },
  { id: "phone_spellcheck", emoji: "✍️", answer: true },
  { id: "faucet_proximity", emoji: "🧼", answer: false },
  { id: "camera_beautify_filter", emoji: "📱", answer: true },
  { id: "tv_remote_channel", emoji: "📺", answer: false },
  { id: "fridge_ice_maker", emoji: "🧊", answer: false },
];

export const hardQuestions: DetectiveQuestionBase[] = [
  { id: "google_translate", emoji: "🌐", answer: true },
  { id: "camera_face_detection", emoji: "📸", answer: true },
  { id: "email_spam_filter", emoji: "📧", answer: true },
  { id: "self_driving_stop_sign", emoji: "🚗", answer: true },
  { id: "ac_wind_tracking", emoji: "❄️", answer: true },
  { id: "maps_traffic_routing", emoji: "🗺️", answer: true },
  { id: "factory_robot_arm", emoji: "🏭", answer: false },
  { id: "smart_lock_face_id", emoji: "🔑", answer: true },
  { id: "ai_image_from_text", emoji: "🎨", answer: true },
  { id: "buddy_bot_suggestions", emoji: "💬", answer: true },
  { id: "xray_medical_analysis", emoji: "🩺", answer: true },
  { id: "song_recognition", emoji: "🎼", answer: true },
];

export function getQuestionBank(level: Level): DetectiveQuestionBase[] {
  return level === "easy" ? easyQuestions : hardQuestions;
}
