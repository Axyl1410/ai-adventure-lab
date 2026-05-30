# Security Notes

## Tối thiểu hóa dữ liệu trẻ em

- Không cần tài khoản học sinh.
- Session chỉ lưu nickname mặc định hoặc biệt danh, độ tuổi nhóm và tiến độ học.
- Không thu thập tên thật, địa chỉ, số điện thoại, email, trường học, mật khẩu hoặc ảnh cá nhân.
- Webcam của Teachable Machine chạy trong trình duyệt và không upload ảnh lên server.

## Giới hạn của AI

- AI có thể trả lời sai hoặc thiếu ngữ cảnh.
- App luôn nhắc học sinh kiểm tra thông tin với giáo viên, phụ huynh hoặc sách đáng tin cậy.
- Buddy Bot là công cụ hỗ trợ học tập, không thay thế giáo viên hoặc phụ huynh.

## Giới hạn an toàn

- `safety.service.ts` chặn/chuyển hướng nội dung rõ ràng không phù hợp bằng keyword và pattern.
- Safety filter không hoàn hảo; giáo viên vẫn cần giám sát.
- Không gửi nội dung bị chặn sang TTS.
- Image Studio dùng guided blocks, hạn chế free-form prompt cho học sinh.
- Ảnh AI được lưu local, không chia sẻ công khai tự động.

## Khuyến nghị vận hành

- Đổi `TEACHER_PASSCODE` trước khi dùng thật.
- Chạy sau HTTPS reverse proxy nếu public Internet.
- Giới hạn CORS bằng domain thật.
- Đặt rate limit thấp cho lớp nhỏ, đặc biệt với image generation.
- Sao lưu SQLite và thư mục uploads nếu cần giữ dữ liệu lớp học.
- Xem lại thư viện ảnh định kỳ trong Teacher Mode.
