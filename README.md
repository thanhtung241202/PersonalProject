# 📈 StockTracker - Microservices Stock Analysis Platform

**StockTracker** là một nền tảng theo dõi và phân tích dữ liệu chứng khoán thời gian thực. Dự án được xây dựng trên kiến trúc **Microservices** hiện đại, giúp hệ thống hoạt động ổn định, dễ dàng mở rộng và bảo mật cao.

---

## 🏗️ Kiến trúc Hệ thống (Architecture)

Dự án sử dụng mô hình Microservices với **API Gateway** làm trung tâm điều phối:

1.  **Frontend (React + Vite):** Giao diện người dùng tối giản, mượt mà (Theme Dark mode).
2.  **API Gateway (Node.js/Express):** Cổng kết nối duy nhất, xử lý Proxy, CORS và quản lý HttpOnly Cookie.
3.  **Auth Service (Node.js/Express + MongoDB):** Chuyên trách xác thực, quản lý User, JWT.
4.  **Stock Service (Python/FastAPI):** Xử lý dữ liệu chứng khoán lịch sử và tính toán chỉ số.

---

## 🚀 Tính năng chính

- 🔐 **Xác thực bảo mật:** Đăng ký, Đăng nhập với cơ chế **JWT** lưu trữ trong **HttpOnly Cookie** (chống XSS).
- 📊 **Biểu đồ trực quan:** Hiển thị diễn biến giá cổ phiếu 30 phiên gần nhất bằng **Chart.js**.
- 🔍 **Tìm kiếm thông minh:** Tra cứu nhanh mã cổ phiếu trên sàn (VD: VIC, VNM, FPT).
- 👤 **Trang cá nhân (Profile):** Hiển thị thông tin tài khoản và gói dịch vụ (Basic/Premium).
- 🛡️ **Bảo vệ dữ liệu:** Quản lý cấu hình qua môi trường (`.env`) và ngăn chặn lỗi truy cập chéo nguồn (CORS).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Lucide Icons, Chart.js |
| **Gateway** | Node.js, Express, Axios, Cookie-parser |
| **Auth Service** | Node.js, MongoDB (Mongoose), JWT, Bcrypt |
| **Stock Service** | Python, FastAPI, Uvicorn |

---

## 📦 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Local hoặc MongoDB Atlas)

### 2. Clone dự án
```bash
git clone [https://github.com/your-username/PersonalProject.git](https://github.com/your-username/PersonalProject.git)
cd PersonalProject