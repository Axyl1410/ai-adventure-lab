# Kế hoạch rà soát và nâng cấp giao diện

Ngày rà soát: 2026-05-26

## Tóm tắt hiện trạng

Dự án đã có MVP đầy đủ các phần chính: Home, Game Shell, Buddy Bot, Prompt Magic, Image Studio, Teachable Machine, Teacher Mode và backend API. Giao diện đã dùng đúng bảng màu Rainbow Robot Classroom, có card bo tròn, mascot SVG và copy tiếng Việt.

Các điểm cần nâng cấp để hợp hơn với học sinh tiểu học:

- Home đang hơi giống dashboard người lớn: nhiều text dạng nhãn, ít hình minh họa theo từng trò chơi.
- Game cards ở desktop bị nhạt ở vùng thấp của viewport; tương phản chưa ổn, dễ làm trẻ tưởng card bị disabled.
- Header trên mobile chiếm nhiều chiều cao; các nút mode/language/safety xuống nhiều dòng.
- Image Studio vẫn có nhiều input tự do. Với học sinh 6-11, nên ưu tiên bấm chọn bằng thẻ hình, chip màu, stepper số lượng, toggle chữ trong ảnh.
- Mascot hiện là SVG tốt cho MVP nhưng chưa có hệ nhân vật rõ: ít trạng thái biểu cảm, chưa đóng vai trò dẫn dắt từng bước.
- Chưa có bộ ảnh/illustration chủ đạo cho classroom, game cards, Image Studio output placeholder và teacher review.

## Mục tiêu thiết kế mới

Thiết kế hướng đến cảm giác "lớp học robot cầu vồng":

- Trẻ nhìn vào là biết bấm ở đâu trong 3 giây.
- Mỗi trò chơi có một hình/biểu tượng riêng, không chỉ icon line.
- Các bước trong game giống hoạt động lớp học: chọn, thử, nhận sao, nghe giải thích.
- Ít nhập chữ, nhiều chọn đáp án bằng thẻ lớn.
- Safety luôn dịu nhẹ: nhắc bảo vệ thông tin cá nhân nhưng không làm giao diện căng thẳng.

## Hướng thay đổi UI

### 1. Home

- Đổi hero thành khu "phòng lab" có Buddy Bot lớn, bảng lớp nhỏ, 3 CTA rõ:
  - Bắt đầu khám phá
  - Hỏi Buddy Bot
  - Tạo tranh AI
- Thay progress summary bằng các "mission chips" có icon:
  - Hôm nay em học AI
  - Không chia sẻ thông tin cá nhân
  - AI có thể sai
- Làm game cards thành "activity tiles" có:
  - Minh họa nhỏ theo trò chơi
  - Màu nền riêng
  - Một câu hành động ngắn
  - Badge độ khó
  - Nút bắt đầu tối thiểu 48px
- Sửa độ tương phản card: nền trắng rõ, text `ink`, nút màu đậm, không dùng opacity quá thấp cho nội dung chính.

### 2. Header Mobile

- Desktop giữ đủ điều hướng.
- Mobile rút gọn:
  - Logo một dòng.
  - Nút Teacher và VI/EN chuyển vào menu nhỏ.
  - Safety reminder thành chip ngắn: "An toàn".
- Không để header chiếm quá 25% chiều cao màn hình đầu tiên.

### 3. Game Shell

- Chuyển instruction thành "bảng nhiệm vụ" với số bước ngắn.
- Buddy Bot có speech bubble riêng thay vì nằm như hình trang trí.
- Progress bar dùng sao hoặc huy hiệu, trẻ dễ hiểu hơn phần trăm.
- TTS button đặt gần lời hướng dẫn và dùng nhãn "Nghe Buddy đọc".

### 4. Image Studio

- Chuyển flow thành wizard 4 bước:
  1. Chọn chủ đề
  2. Chọn phong cách
  3. Chọn chi tiết
  4. Xem prompt và tạo tranh
- Thay input subject/setting bằng thẻ gợi ý:
  - Robot đọc sách
  - Cá voi ngoài biển
  - Hành tinh vui vẻ
  - Cây cầu vồng
  - Bàn học thần kỳ
- Cho phép giáo viên bật "nâng cao" mới hiện ô nhập tự do.
- Prompt preview dùng cấu trúc dễ hiểu:
  - Chủ thể
  - Bối cảnh
  - Màu sắc
  - Phong cách
  - Nhãn AI
- Generated image card luôn có:
  - "Hình này được tạo bởi AI."
  - Prompt đã dùng
  - Tải xuống
  - Viết chuyện
  - Xóa chỉ ở Teacher Mode

### 5. Buddy Bot Chat

- Tăng vai trò gợi ý: chips nên là thẻ câu hỏi lớn hơn.
- Message bubble của Buddy có avatar nhỏ, không chỉ text.
- Khi API lỗi, hiển thị fallback thân thiện và gợi ý câu hỏi offline.

## Nhân vật Buddy Bot

### Tính cách

Buddy Bot là bạn học tập vui vẻ, không giả làm con người. Bạn ấy:

- Tò mò
- Khen nỗ lực
- Nhắc kiểm tra với thầy cô
- Dẫn dắt từng bước
- Không hỏi thông tin cá nhân

### Trạng thái cần thiết

- Happy: dùng ở Home, feedback đúng.
- Thinking: dùng khi AI đang xử lý.
- Celebrating: dùng khi hoàn thành màn.
- Warning gentle: dùng khi chuyển hướng an toàn.
- Reading: dùng khi đọc hướng dẫn/TTS.
- Artist: dùng riêng cho Image Studio.
- Teacher helper: dùng trong Teacher Mode.

### Hướng asset

MVP nên giữ SVG component để nhẹ và dễ đổi màu. Sau đó bổ sung bitmap minh họa cho hero/cards:

- `buddy-bot-hero.png`
- `buddy-bot-thinking.png`
- `buddy-bot-artist.png`
- `buddy-bot-celebrating.png`
- `classroom-lab-background.png`
- `image-studio-placeholder.png`

Không dùng mặt trẻ em thật hoặc ảnh học sinh thật.

## Prompt tạo ảnh đề xuất

### Buddy Bot Hero

Use case: illustration-story  
Asset type: website hero mascot  
Primary request: A friendly rounded robot mascot named Buddy Bot in a colorful Vietnamese primary school AI lab, big expressive eyes, small antenna with a star, soft rainbow accents, cheerful classroom objects, picture book style, bright cream background, safe for children ages 6-11, no human faces, no text, no watermark.

### Buddy Bot Artist

Use case: illustration-story  
Asset type: Image Studio mascot state  
Primary request: Buddy Bot as a cheerful little robot artist holding a safe digital paint brush, surrounded by paper stars, crayons, small planets, and friendly learning posters, children's book illustration, bright soft colors, transparent-feeling simple background, no text, no human faces, no copyrighted characters.

### Classroom Lab Background

Use case: scientific-educational  
Asset type: website background illustration  
Primary request: A warm rainbow robot classroom for Vietnamese primary students, simple desks, a friendly robot lab corner, books, planets, safe AI icons, soft clouds and stars, wide composition for a web hero, bright cream and sky colors, no people, no readable text, no watermark.

## Thứ tự triển khai đề xuất

1. Sửa tương phản và layout Home trước vì đây là màn đầu tiên.
2. Tối ưu header mobile.
3. Nâng cấp GameShell để tất cả game hưởng lợi.
4. Tái thiết kế Image Studio thành wizard chọn bằng thẻ.
5. Mở rộng BuddyBot component với state `artist` và `teacher`.
6. Tạo/copy asset minh họa vào `apps/web/src/assets/mascot/`.
7. Kiểm tra desktop 1280px và mobile 390px bằng browser screenshots.
8. Chạy `npm run typecheck` và build frontend.

## Tiêu chí hoàn thành

- Trẻ em có thể bắt đầu một game từ Home mà không cần đọc nhiều.
- Text trong nút/card không bị mờ hoặc quá nhỏ trên mobile.
- Image Studio có thể dùng gần như hoàn toàn bằng click/tap.
- Buddy Bot xuất hiện như người dẫn dắt, không chỉ trang trí.
- Mỗi ảnh AI tạo ra luôn có nhãn AI và prompt đã dùng.
- Không có UI khuyến khích nhập thông tin cá nhân.
