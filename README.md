# SpendWise · Frontend Simulation

**Đây là ứng dụng mô phỏng phía trình duyệt. Không có giao dịch tiền thật, không kết nối Backend, SQL, SMTP, Gemini hoặc SePay. Không nhập mật khẩu, mã PIN, chứng từ hay thông tin ngân hàng thật.**

## Chạy ngay

Đã kiểm tra bằng Node.js 24 và Chrome. Tại thư mục dự án:

```sh
npm install
npm run dev
```

- User Mobile: <http://localhost:5173/app>
- Admin CRM: <http://localhost:5173/admin>

Login đã điền sẵn thông tin. User phát animation chữ S gốc rồi vào Dashboard; Admin dùng card kính và trạng thái loading của button, không yêu cầu PIN ở bước login demo. PIN vẫn bắt buộc trong các thao tác tài chính mô phỏng. Trên desktop, User nằm trong khung điện thoại khoảng 390 × 844; trên màn hình hẹp, viền giả lập tự bỏ. Modal, bottom sheet, kết quả, scroll và navbar đều ở bên trong điện thoại. Admin sử dụng toàn bộ màn hình desktop.

## Tài khoản giả lập

| Vai trò | Email | Mật khẩu Demo | PIN Demo |
|---|---|---|---|
| User A — Minh Anh | `a@spendwise.demo` | `Demo@12345` | `123456` |
| User B — Gia Bảo | `b@spendwise.demo` | `Demo@12345` | `123456` |
| Admin | `admin@spendwise.demo` | `Demo@12345` | `123456` |

OTP đăng ký/khôi phục Demo: `12345678`. Người dùng mới thiết lập PIN 6 số của riêng bản mô phỏng. Các giá trị này công khai, chỉ dành cho Demo. Nếu đổi mật khẩu/PIN bằng giao diện thì giá trị mới được lưu trong trình duyệt đó.

User và Admin có hai phiên độc lập. User A/B chuyển được trong **Cá nhân → Chuyển User A/B**. Dữ liệu chung lưu bằng localStorage, đồng bộ giữa tab cùng origin. Web Locks tuần tự hóa các cập nhật tài chính trong Chrome. Nếu trình duyệt không hỗ trợ Web Locks, chỉ sử dụng một tab cho thao tác tài chính.

## Màn hình đang có

- Auth gốc được tái sử dụng: notebook Login/Register có lật trang; User khôi phục mật khẩu/PIN; Admin Login card kính riêng; OTP/PIN mô phỏng; loading chữ S nguyên bản.
- User: Home, ví, lịch sử & chi tiết giao dịch, chuyển tiền, chuyển nội bộ, ghi thu/chi, bạn bè, nhóm Fixed/Free, thành viên, lời mời, góp quỹ, yêu cầu chi/rút, báo cáo tranh chấp, lịch sử quỹ, chuyển chủ, rời/hoàn/giải tán.
- Kế hoạch: CRUD ngân sách, mục tiêu và phân bổ/rút, giao dịch định kỳ, danh mục, danh sách quy tắc.
- Ngân hàng Demo: liên kết/hủy, nạp, giữ tiền khi rút Pending, đối soát bằng Admin theo ticket.
- Thông báo, ticket, trao đổi và mô tả chứng từ Demo, báo cáo/xuất CSV, trợ lý kịch bản cục bộ, hồ sơ, đổi mật khẩu/PIN, phiên, Light/Dark/System và VI/EN.
- Admin ADM-01–05: tổng quan, tìm kiếm/lọc/phân trang người dùng, hạn chế/khóa/mở khóa theo ticket được phân công, hàng đợi hỗ trợ/tranh chấp, phản hồi/kết luận, Broadcast nháp/xem trước/phát hành, lịch bảo trì/chặn tài chính/mở lại và nhật ký kiểm toán.

Loading sau đăng nhập dùng skeleton riêng theo bố cục từng route với độ trễ mô phỏng 180ms. Loading Auth dùng component chữ S gốc, không dùng nó cho các trang nghiệp vụ. Kết quả nghiệp vụ có tick/X/đồng hồ riêng.

## Kiểm tra và build

```sh
npm test
npm run typecheck
npm run test:browser
node scripts/test-social-auth.cjs
npm run test:ui
npm run test:admin
npm run test:feedback
npm run build
npm run preview
```

Kiểm thử trình duyệt dùng Chrome được cài trên máy và Playwright có sẵn trong dependencies. Mỗi lượt tạo context riêng, không thay dữ liệu trong các tab Demo đang mở. Ảnh browser thật nằm ở `img/`, được commit cùng nhóm chức năng tương ứng. Không tạo ảnh tổng hợp. Kết quả và giới hạn chi tiết: [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Cấu hình hosting tham khảo (không deploy)

Chọn root của dự án, framework Vite, build `npm run build`, output `apps/admin-crm/dist`. `vercel.json` có SPA rewrite để mở/refresh trực tiếp `/app/*` và `/admin/*`. Không cần biến môi trường hoặc server. `.vercelignore` loại source tham chiếu, bản Expo trước đính chính và thư mục kiểm thử ảnh. Chưa deploy lên tài khoản Vercel trong lượt này.

ANestland được đọc để tham khảo mô hình static frontend, assets và state phía trình duyệt. SpendWise dùng Vite để đóng gói hai khu vực, không sao chép giao diện ANestland.

## Source và phạm vi

Bản demo hiện chạy là **một ứng dụng Vite** trong `apps/admin-crm/`, chứa cả `/app` và `/admin` theo bản đính chính. `apps/user-mobile/` là bản Expo sao chép trước đính chính, không nằm trong workspace npm đang chạy và không cần để build/deploy demo. Không sửa source Backend tham chiếu.

- `apps/admin-crm/src/demo/model.ts`: lệnh nghiệp vụ mô phỏng, kiểm tra số dư/PIN/quyền/idempotency và bảo toàn tiền.
- `apps/admin-crm/src/demo/store.ts`: mock transport, phiên và lưu dữ liệu.
- `apps/admin-crm/src/demo/{UserPages,AdminPages,DemoApp,ui}.tsx`: UI và routing.
- `apps/admin-crm/src/features/auth/`: Auth được tái sử dụng.
- `apps/admin-crm/src/components/ui/SpendWiseSLoading.tsx`: component nguyên bản.

Source tham chiếu SpendWise: commit `6e6f66059d8d61944047b1f2cb5bcc3975b5ec85`. Hai TikTok reference không đọc được: `VIDEO_REFERENCE_UNAVAILABLE`.

**Giới hạn cần biết:** đây chưa phải triển khai đầy đủ mọi nhánh nghiệp vụ V1.0. Bầu cử đang có quy trình mô phỏng rút gọn, chưa có toàn bộ tie-break/confirmation và settlement nhiều kỳ Fixed Fund. Quy tắc phân loại hiện chỉ có CRUD/trạng thái, chưa tự phân loại giao dịch. Giao dịch định kỳ ghi thủ công từng kỳ, không có tiến trình chạy nền. AI là trợ lý kịch bản, chứng từ là mô tả Demo, không upload dữ liệu thật. Các giới hạn được liệt kê trong [API-COVERAGE.md](docs/API-COVERAGE.md); không tuyên bố tương đương Backend hay hoàn thiện 100% V1.0.

## Ảnh kiểm tra giao diện

Ảnh PNG thực tế được lưu tại [img/](img/). Ảnh không có hậu tố `-skeleton` là giao diện đã tải xong; ảnh loading được lưu riêng để so sánh. Mỗi nhóm hoàn tất được kiểm tra và commit/push cùng ảnh, không chờ toàn bộ dự án.

| Nhóm | Ảnh loaded | Ảnh loading |
|---|---|---|
| User Dashboard | [Dashboard](img/user-dashboard.png) | [Skeleton](img/user-dashboard-skeleton.png) |
| Wallet | [Ví](img/user-wallet.png) | [Skeleton](img/user-wallet-skeleton.png) |
| Fixed / Free | [Fixed](img/user-fixed-fund.png), [Free](img/user-free-fund.png) | [Fixed](img/user-fixed-fund-skeleton.png), [Free](img/user-free-fund-skeleton.png) |
| Admin Users | [Bảng dữ liệu](img/admin-users.png) | [Skeleton 5 cột](img/admin-users-skeleton.png) |
| Admin Support | [Ticket / hội thoại / thao tác](img/admin-support.png) | [Skeleton](img/admin-support-skeleton.png) |
| Admin Notifications | [KPI / bảng thông báo](img/admin-notifications.png) | [Skeleton](img/admin-notifications-skeleton.png) |
| Admin Maintenance | [Bảo trì](img/admin-maintenance.png) | [Skeleton](img/admin-maintenance-skeleton.png) |

[Admin Login](img/admin-login.png) · [Thành công](img/user-transfer-success.png) · [Thất bại](img/user-transfer-failure.png).

Ảnh trạng thái bổ sung: [Auth S](img/user-auth-s-loading.png), [OTP lỗi](img/user-otp-error.png), [đăng ký hoàn tất](img/user-registration-complete.png), [Pending](img/user-withdraw-pending.png), [AI hội thoại](img/user-ai-conversation.png), [Admin Login Dark](img/admin-login-dark.png).
