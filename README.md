# Flappy Bird

Game HTML/CSS/JavaScript thuần, chạy trực tiếp trên GitHub Pages. Không cần build, thư viện hay dịch vụ ngoài.

## Chơi

Chạm bất kỳ đâu trong vùng game hoặc nhấn **Bắt đầu bay** để bắt đầu. Chạm tiếp để vỗ cánh, tránh ống và mặt đất. Mỗi cặp ống vượt qua được 1 điểm. Chạm để chơi lại sau khi thua. Nút tạm dừng ở góc phải; game tự dừng khi chuyển ứng dụng. Trên máy tính dùng Space hoặc mũi tên lên.

## Chạy tại máy

Mở `index.html`, hoặc chạy `python3 -m http.server 8000` tại thư mục repository rồi mở trang qua cổng 8000.

## GitHub Pages

Trong **Settings → Pages → Build and deployment**, chọn **Deploy from a branch**, nhánh **main**, thư mục **/(root)**, rồi Save. Chờ deployment Pages thành công trong Actions trước khi tải lại trang:

https://hacnguyet.github.io/ai-development-platform/

Workflow `ci.yml` hiện tại chỉ kiểm tra repository, không triển khai Pages. Nếu Pages đang chọn **GitHub Actions** làm nguồn, chuyển sang **Deploy from a branch** như trên; không cần thêm workflow.

Các đường dẫn CSS/JS tương đối hỗ trợ đường dẫn con của GitHub Pages. Nếu vẫn thấy giao diện cũ sau khi deployment thành công, tải lại trang hoặc mở tab riêng tư. JavaScript phải được bật. Kỷ lục lưu trong localStorage nếu trình duyệt cho phép; chặn lưu trữ không ngăn chơi game.
