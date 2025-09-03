# 🛍️ Ecommerce Multi Vendor Project

Website Multi Vendor Ecommerce **React 19**, **TypeScript** và **Vite**.

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
└── Store.ts        #Cấu hình và khởi tạo Redux Store để quản lý toàn bộ state toàn cục (global state) trong ứng dụng React.
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

Redux Toolkit:
-slice được sử dụng để quản lý tất cả các trạng thái và tương tác API

# Ecommerce Multivendor Project

## 1.Giao diện cho Customer

## 1.1. Trang chủ

![Trang chủ 1](docs/images/img.png)
![Trang chủ 2](docs/images/img_1.png)
![Trang chủ 3](docs/images/img_2.png)
![Trang chủ 4](docs/images/img_3.png)

## 1.2. Xem thông tin sản phẩm

![Chi tiết 1](docs/images/img_4.png)
![Chi tiết 2](docs/images/img_5.png)

## 1.3. Giỏ hàng, đặt hàng , thanh toán

![Giỏ hàng 1](docs/images/img_6.png)
![Giỏ hàng 2](docs/images/img_7.png)
![Giỏ hàng 2](docs/images/img_8.png)

## 1.4. Xem đơn hàng

![Đơn hàng 1](docs/images/img_9.png)
![Đơn hàng 2](docs/images/img_10.png)
![Đơn hàng 3](docs/images/img_11.png)
![Đơn hàng 4](docs/images/img_12.png)

## 1.5. Đăng ký làm KOC

![koc](docs/images/img_13.png)

## 2.Giao diện cho Seller

## 2.1.Đăng ký làm Seller

![Trang chủ 1](docs/images/img_14.png)

## 2.2.Trang chủ Seller

![Trang chủ 2](docs/images/img_15.png)

## 2.3.Xem đơn hàng , thêm sản phẩm , giao dịch của Seller

![Campaign 1](docs/images/img_16.png)
![Campaign 2](docs/images/img_17.png)
![Campaign 3](docs/images/img_18.png)
![Campaign 4](docs/images/img_19.png)

## 2.3.Xem xóa sửa chiến dịch của Seller

![Campaign 5](docs/images/img_20.png)
![Campaign 6](docs/images/img_21.png)
![Campaign 7](docs/images/img_22.png)

## 2.4.Duyệt KOC tham gia chiến dịch của Seller

![Campaign 8](docs/images/img_23.png)

## 3.Giao diện cho Manager

## 3.1.Giao diện quản lý Seller

![Trang chủ 1](docs/images/img_24.png)
![Trang chủ 1](docs/images/img_25.png)

## 3.2.Giao diện quản lý Koc

![Trang chủ 1](docs/images/img_26.png)

## 3.3.Giao diện quản lý các mã coupon

![Trang chủ 1](docs/images/img_27.png)
![Trang chủ 1](docs/images/img_28.png)

## 4.Giao diện cho Koc

## 4.1.Giao diện trang chủ của Koc

![Trang chủ 1](docs/images/img_32.png)

## 4.2.Giao diện xem các chiến dịch cua Koc

![Trang chủ 1](docs/images/img_33.png)
![Trang chủ 1](docs/images/img_34.png)
![Trang chủ 1](docs/images/img_35.png)

## 4.3.Giao diện xem các link sản phẩm khi Koc được duyệt vô chiến dịch

![Trang chủ 1](docs/images/img_36.png)
