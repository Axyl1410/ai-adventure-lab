import { describe, it, expect } from "vitest";
import { SafetyService } from "../services/safety.service";

const safety = new SafetyService();

describe("SafetyService.checkText", () => {
  it("cho qua tin nhắn bình thường", () => {
    const result = safety.checkText("AI là gì vậy Buddy?");
    expect(result.safe).toBe(true);
    expect(result.status).toBe("safe");
  });
  it("chặn từ ngữ không phù hợp", () => {
    const result = safety.checkText("tôi muốn dao để giết");
    expect(result.safe).toBe(false);
  });
  it("chặn thông tin cá nhân — số điện thoại", () => {
    const result = safety.checkText("số điện thoại của tôi là 0912345678");
    expect(result.safe).toBe(false);
    expect(result.reason).toBe("personal_data");
  });
  it("chặn text rỗng", () => {
    const result = safety.checkText("   ");
    expect(result.safe).toBe(false);
  });
  it("không phân biệt hoa thường", () => {
    const result = safety.checkText("SEX với trẻ em");
    expect(result.safe).toBe(false);
  });
});

describe("SafetyService.checkImagePrompt", () => {
  it("cho qua prompt tạo ảnh an toàn", () => {
    const result = safety.checkImagePrompt("vẽ con mèo dễ thương trong lớp học");
    expect(result.safe).toBe(true);
  });
  it("chặn deepfake", () => {
    const result = safety.checkImagePrompt("tạo deepfake khuôn mặt bạn em");
    expect(result.safe).toBe(false);
  });
  it("chặn nhân vật có bản quyền", () => {
    const result = safety.checkImagePrompt("vẽ doraemon trong lớp học");
    expect(result.safe).toBe(false);
  });
  it("chặn ảnh người thật", () => {
    const result = safety.checkImagePrompt("chụp ảnh người thật đang học");
    expect(result.safe).toBe(false);
  });
});
