# 🎵 Playlist Nhạc Nền Tự Động

## ✅ Đã cấu hình sẵn:

### 🎶 Playlist tự động:

-   **Playlist hiện tại**:
    -   `lonhuanhyeuem.mp3` (Lỡ Như Anh Yêu Em - Chi Dân)
    -   `Christina Perri - A Thousand Years [Official Music Video].mp3`
-   **Tự động phát** khi mở website
-   **Tự động chuyển bài** khi kết thúc
-   **Shuffle ngẫu nhiên** thứ tự phát
-   **Âm lượng 25%** phù hợp làm nhạc nền
-   **Ẩn hoàn toàn** control music và hướng dẫn

### 📁 Cấu trúc thư mục:

```
project/
├── index.html
├── script-threejs.js
├── style.css
└── music/
    └── lonhuanhyeuem.mp3
```

## 🎵 Thêm nhạc vào playlist:

### Bước 1: Thêm file nhạc mới

1. **Đặt file MP3** vào thư mục `music/`
2. **Đặt tên file** rõ ràng (ví dụ: `bai-hat-moi.mp3`)

### Bước 2: Cập nhật playlist

Mở file `script-threejs.js` và tìm phần:

```javascript
let playlist = [
    "./music/lonhuanhyeuem.mp3",
    "./music/Christina Perri - A Thousand Years [Official Music Video].mp3",
];
```

Thêm bài hát mới:

```javascript
let playlist = [
    "./music/lonhuanhyeuem.mp3",
    "./music/Christina Perri - A Thousand Years [Official Music Video].mp3",
    "./music/bai-hat-moi.mp3",
];
```

### 🔄 Tính năng playlist:

-   **Tự động chuyển bài**: Khi một bài kết thúc, tự động chuyển sang bài tiếp theo
-   **Shuffle ngẫu nhiên**: Thứ tự phát được xáo trộn mỗi lần load trang
-   **Lặp vô hạn**: Khi hết playlist, tự động quay lại bài đầu tiên
-   **Xử lý lỗi**: Nếu một bài không phát được, tự động chuyển sang bài tiếp theo

### Bước 3: Các tùy chọn khác

#### Sử dụng URL trực tuyến:

Nếu bạn có link trực tiếp đến file nhạc, có thể sử dụng:

```javascript
backgroundMusic.src = "https://your-domain.com/path/to/lo-nhu-anh-yeu-em.mp3";
```

#### Sử dụng YouTube (cần thêm thư viện):

Để phát từ YouTube, cần sử dụng YouTube API hoặc thư viện như youtube-audio-stream.

### Bước 4: Kiểm tra

1. Mở website trong trình duyệt
2. Nhấn nút "Nhạc nền" ở góc trên bên phải
3. Nhạc sẽ bắt đầu phát

## Lưu ý:

-   File nhạc nên có dung lượng nhỏ để tải nhanh
-   Định dạng MP3 được hỗ trợ tốt nhất
-   Một số trình duyệt yêu cầu người dùng tương tác trước khi phát nhạc
-   Âm lượng mặc định được đặt ở 25% để không quá to

## Tính năng hiện tại:

-   ✅ Nút bật/tắt nhạc nền
-   ✅ Hiển thị tên bài hát và ca sĩ
-   ✅ Phát lặp lại tự động
-   ✅ Giao diện đẹp với hiệu ứng
-   ✅ Tương thích mobile
-   ✅ Âm lượng phù hợp làm nhạc nền
