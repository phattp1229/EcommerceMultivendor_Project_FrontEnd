# 🛍️ Ecommerce Multi Vendor Project

Một dự án website thương mại điện tử được xây dựng với **React 19**, **TypeScript** và **Vite**.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)

---

## 🚀 Công nghệ sử dụng

- ⚛️ **React 19**
- 🧠 **TypeScript**
- ⚡ **Vite 7** – công cụ build siêu nhanh
- 🎨 **Tailwind CSS**
- 🧰 **Redux Toolkit** – quản lý state , giao tiếp BE & FE
- 📦 **react-slick** – Carousel/Slider
- 🔗 **React Router** – Routing cho SPA
- 📡 **Axios** – Gửi HTTP request

---

## 📁 Cấu trúc thư mục

```bash
src/
├── components/      # Các component dùng chung
├── pages/           # Các trang chính (Home, Product, etc.)
├── redux/           # Redux store, slices
├── types/           # TypeScript type definitions
├── assets/          # Ảnh, icon, font
├── App.tsx
└── main.tsx
```

| Thư mục         | Vai trò chính                                                               |
| --------------- | --------------------------------------------------------------------------- |
| `Config`        | Chứa cấu hình API, route, constants (ví dụ `api.ts`, `env.ts`, `routes.ts`) |
| `Redux Toolkit` | Chứa store, slices, thunks, selectors                                       |
| `Theme`         | Chứa custom theme cho MUI hoặc Tailwind                                     |
| `Types`         | Chứa các interface, type (VD: `User`, `Product`, `Seller`, `Report`, etc.)  |
| `assets`        | Ảnh, icon, font, logo,...                                                   |
| `admin`         | Code giao diện & logic cho người quản trị                                   |
| `customer`      | Code cho phía khách hàng                                                    |
| `seller`        | Code cho người bán                                                          |
