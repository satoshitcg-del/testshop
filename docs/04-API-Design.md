# 🔌 4. API Design (ออกแบบ API)

## 4.1 API หลัก (Main API Endpoints)

### 📝 Base URL Structure
```
https://api.yourshop.com/v1
```

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | สมัครสมาชิก | Public |
| POST | `/auth/login` | เข้าสู่ระบบ | Public |
| POST | `/auth/logout` | ออกจากระบบ | Required |
| POST | `/auth/refresh` | Refresh Token | Public (Cookie) |
| POST | `/auth/forgot-password` | ขอรีเซ็ตรหัสผ่าน | Public |
| POST | `/auth/reset-password` | รีเซ็ตรหัสผ่าน | Public |
| POST | `/auth/verify-email` | ยืนยันอีเมล | Public |
| POST | `/auth/social/google` | เข้าสู่ระบบด้วย Google | Public |
| POST | `/auth/social/line` | เข้าสู่ระบบด้วย Line | Public |

**Request/Response Examples:**

```typescript
// POST /auth/login
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response 200
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "CUSTOMER",
      "avatarUrl": "https://..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600 // seconds
  }
}
// Refresh Token จะถูกส่งผ่าน httpOnly cookie
```

---

## 4.1.1 Minimal API for Test/MVP

### ใช้จริงในเว็บทดสอบ
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /products`
- `GET /products/:slug`
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:id`
- `DELETE /cart/items/:id`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `POST /payments/intent` (Test mode เท่านั้น)

### ตัดออกก่อน
- Social login (`/auth/social/*`)
- WebSocket events
- Coupon endpoints
- Admin/Seller APIs เต็มรูปแบบ

---

### 👤 User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | ดูข้อมูลตัวเอง | Required |
| PATCH | `/users/me` | แก้ไขข้อมูลตัวเอง | Required |
| POST | `/users/me/avatar` | อัปโหลดรูปโปรไฟล์ | Required |
| GET | `/users/me/addresses` | ดูที่อยู่ทั้งหมด | Required |
| POST | `/users/me/addresses` | เพิ่มที่อยู่ใหม่ | Required |
| PATCH | `/users/me/addresses/:id` | แก้ไขที่อยู่ | Required |
| DELETE | `/users/me/addresses/:id` | ลบที่อยู่ | Required |
| GET | `/users/me/wishlist` | ดูรายการโปรด | Required |
| POST | `/users/me/wishlist` | เพิ่มในรายการโปรด | Required |
| DELETE | `/users/me/wishlist/:productId` | ลบออกจากรายการโปรด | Required |

---

### 🏪 Shop Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/shops` | รายการร้านค้า (Public) | Public |
| GET | `/shops/:slug` | ดูร้านค้า | Public |
| GET | `/shops/:slug/products` | สินค้าในร้าน | Public |
| GET | `/shops/:slug/reviews` | รีวิวร้านค้า | Public |

---

### 📦 Product Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | รายการสินค้า | Public |
| GET | `/products/featured` | สินค้าแนะนำ | Public |
| GET | `/products/new-arrivals` | สินค้ามาใหม่ | Public |
| GET | `/products/best-sellers` | สินค้าขายดี | Public |
| GET | `/products/search` | ค้นหาสินค้า | Public |
| GET | `/products/:slug` | ดูรายละเอียดสินค้า | Public |
| GET | `/products/:slug/related` | สินค้าที่เกี่ยวข้อง | Public |
| GET | `/products/:slug/reviews` | รีวิวสินค้า | Public |

**Query Parameters for `/products`:**
```
GET /products?
  page=1&                    // Page number
  limit=20&                  // Items per page
  category=electronics&      // Filter by category
  shop=shop-slug&            // Filter by shop
  minPrice=100&              // Min price
  maxPrice=1000&             // Max price
  rating=4&                  // Min rating
  sortBy=price&              // Sort field
  sortOrder=asc&             // asc | desc
  search=iphone&             // Search keyword
  inStock=true               // Only in stock
```

**Response Format:**
```typescript
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 🛒 Cart Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | ดูตะกร้าสินค้า | Optional |
| POST | `/cart/items` | เพิ่มสินค้าในตะกร้า | Optional |
| PATCH | `/cart/items/:id` | อัปเดตจำนวน | Required |
| DELETE | `/cart/items/:id` | ลบสินค้าออก | Required |
| DELETE | `/cart` | ล้างตะกร้า | Required |
| POST | `/cart/apply-coupon` | ใช้คูปอง | Required |
| DELETE | `/cart/coupon` | ยกเลิกคูปอง | Required |

---

### 📋 Order Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | สร้างคำสั่งซื้อ | Required |
| GET | `/orders` | รายการคำสั่งซื้อ | Required |
| GET | `/orders/:id` | ดูรายละเอียดคำสั่งซื้อ | Required |
| POST | `/orders/:id/cancel` | ยกเลิกคำสั่งซื้อ | Required |
| POST | `/orders/:id/pay` | ชำระเงิน | Required |
| GET | `/orders/:id/tracking` | ติดตามสถานะ | Required |

---

### ⭐ Review Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/reviews` | สร้างรีวิว | Required |
| PATCH | `/reviews/:id` | แก้ไขรีวิว | Required |
| DELETE | `/reviews/:id` | ลบรีวิว | Required |

---

### 💳 Payment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payments/intent` | สร้าง Payment Intent | Required |
| POST | `/payments/confirm` | ยืนยันการชำระเงิน | Required |
| POST | `/payments/webhook` | Webhook จาก Payment Gateway | Public |

---

### 📬 Notification Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications` | รายการแจ้งเตือน | Required |
| PATCH | `/notifications/:id/read` | อ่านแจ้งเตือน | Required |
| PATCH | `/notifications/read-all` | อ่านทั้งหมด | Required |
| DELETE | `/notifications/:id` | ลบแจ้งเตือน | Required |
| GET | `/notifications/unread-count` | จำนวนที่ยังไม่อ่าน | Required |

---

### 🔔 WebSocket Events (Real-time)

```typescript
// Client -> Server
{
  "auth": "jwt_token",
  "events": [
    "order:subscribe",      // Subscribe ออเดอร์
    "notification:subscribe", // Subscribe แจ้งเตือน
    "chat:subscribe"        // Subscribe แชท
  ]
}

// Server -> Client
{
  "event": "order:updated",
  "data": {
    "orderId": "uuid",
    "status": "SHIPPED",
    "trackingNumber": "TH123456789"
  }
}

{
  "event": "notification:new",
  "data": {
    "id": "uuid",
    "type": "ORDER",
    "title": "คำสั่งซื้อได้รับการยืนยัน",
    "message": "คำสั่งซื้อ #12345 ได้รับการยืนยันแล้ว"
  }
}
```

---

## 4.2 Seller API Endpoints

### 🏪 Shop Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/seller/apply` | สมัครเปิดร้านค้า |
| GET | `/seller/shop` | ข้อมูลร้านค้า |
| PATCH | `/seller/shop` | แก้ไขข้อมูลร้านค้า |
| POST | `/seller/shop/logo` | อัปโหลดโลโก้ |
| POST | `/seller/shop/banner` | อัปโหลดแบนเนอร์ |

### 📦 Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/seller/products` | รายการสินค้า |
| POST | `/seller/products` | สร้างสินค้า |
| GET | `/seller/products/:id` | ดูสินค้า |
| PATCH | `/seller/products/:id` | แก้ไขสินค้า |
| DELETE | `/seller/products/:id` | ลบสินค้า |
| POST | `/seller/products/bulk` | สร้างหลายรายการ |
| PATCH | `/seller/products/:id/stock` | อัปเดตสต็อก |

**Create Product Request:**
```typescript
{
  "name": "iPhone 15 Pro",
  "categoryId": "uuid",
  "description": "...",
  "price": 42900,
  "comparePrice": 45900,
  "sku": "IP15P-001",
  "stockQuantity": 50,
  "weight": 187,
  "status": "ACTIVE",
  "images": [
    { "url": "https://...", "isPrimary": true },
    { "url": "https://...", "isPrimary": false }
  ],
  "variants": [
    {
      "variantName": "Natural Titanium - 128GB",
      "sku": "IP15P-NT-128",
      "priceAdjust": 0,
      "stockQuantity": 20
    }
  ]
}
```

### 📋 Order Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/seller/orders` | รายการคำสั่งซื้อ |
| GET | `/seller/orders/:id` | ดูคำสั่งซื้อ |
| PATCH | `/seller/orders/:id/confirm` | ยืนยันคำสั่งซื้อ |
| PATCH | `/seller/orders/:id/ship` | จัดส่ง |
| POST | `/seller/orders/:id/cancel` | ยกเลิก |

### 📊 Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/seller/reports/sales` | รายงานยอดขาย |
| GET | `/seller/reports/products` | รายงานสินค้า |
| GET | `/seller/reports/dashboard` | ข้อมูล Dashboard |

---

## 4.3 Admin API Endpoints

### 👥 User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | รายการผู้ใช้ |
| GET | `/admin/users/:id` | ดูผู้ใช้ |
| PATCH | `/admin/users/:id/ban` | Ban/Unban |
| DELETE | `/admin/users/:id` | ลบผู้ใช้ |

### 🏪 Seller Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/sellers` | รายการผู้ขาย |
| POST | `/admin/sellers/:id/approve` | อนุมัติ |
| POST | `/admin/sellers/:id/reject` | ปฏิเสธ |
| PATCH | `/admin/sellers/:id/suspend` | Suspend |

### 📦 Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/products` | รายการสินค้าทั้งหมด |
| PATCH | `/admin/products/:id/approve` | อนุมัติ |
| PATCH | `/admin/products/:id/reject` | ปฏิเสธ |
| DELETE | `/admin/products/:id` | ลบสินค้า |

### 📊 System Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Dashboard ภาพรวม |
| GET | `/admin/reports/sales` | รายงานยอดขาย |
| GET | `/admin/reports/users` | รายงานผู้ใช้ |
| GET | `/admin/audit-logs` | Audit Logs |

---

## 4.4 Error Response Format

```typescript
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ข้อมูลไม่ถูกต้อง",
    "details": [
      { "field": "email", "message": "อีเมลไม่ถูกต้อง" },
      { "field": "password", "message": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" }
    ]
  }
}

// 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "กรุณาเข้าสู่ระบบ"
  }
}

// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "คุณไม่มีสิทธิ์เข้าถึง"
  }
}

// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "ไม่พบข้อมูลที่ต้องการ"
  }
}

// 500 Server Error
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
  }
}
```

---

## 4.5 API Rate Limiting

| Endpoint Type | Limit |
|--------------|-------|
| Public APIs | 100 requests/minute |
| Authenticated APIs | 1000 requests/minute |
| Upload APIs | 10 requests/minute |
| Webhook | 1000 requests/minute |
