# 📚 TestShop API Documentation

> E-Commerce API Documentation - MVP Version

---

## 🚀 Quick Start

```bash
# Base URL (Local Development)
http://localhost:3000/api

# Test Credentials
Email:    customer@test.com
Password: password123
```

---

## 📖 Documentation Files

| ไฟล์ | รายละเอียด |
|------|-----------|
| [04-API-Design.md](./04-API-Design.md) | API Design ฉบับเต็ม (Endpoints, Request/Response, Error Format) |
| [API-TEST-CASES.md](../API-TEST-CASES.md) | Test Cases สำหรับทดสอบ API |
| [TestShop-API-Collection.json](../TestShop-API-Collection.json) | Postman Collection (Import ได้เลย) |
| [Postman-Automated-Testing-Guide.md](../Postman-Automated-Testing-Guide.md) | คู่มือทดสอบอัตโนมัติด้วย Postman |

---

## 🔌 API Endpoints Overview

### 🔐 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/login` | เข้าสู่ระบบ | Public |
| `POST` | `/auth/register` | สมัครสมาชิก | Public |
| `POST` | `/auth/logout` | ออกจากระบบ | Required |

### 📦 Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | รายการสินค้าทั้งหมด | Public |
| `GET` | `/products/:slug` | รายละเอียดสินค้า | Public |

**Query Parameters:**
```
GET /products?page=1&limit=20&category=electronics&minPrice=100&maxPrice=1000&sortBy=price&sortOrder=asc
```

### 🛒 Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/cart/items` | ดูตะกร้าสินค้า | Required |
| `POST` | `/cart/items` | เพิ่มสินค้าในตะกร้า | Required |
| `DELETE` | `/cart/items` | ลบสินค้าออกจากตะกร้า | Required |

### 📋 Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/orders` | รายการคำสั่งซื้อ | Required |
| `GET` | `/orders/:id` | รายละเอียดคำสั่งซื้อ | Required |
| `POST` | `/orders` | สร้างคำสั่งซื้อ | Required |

### 💳 Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/payments/intent` | สร้าง Payment Intent | Required |

---

## 📡 Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // ... response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ข้อมูลไม่ถูกต้อง",
    "details": [
      { "field": "email", "message": "อีเมลไม่ถูกต้อง" }
    ]
  }
}
```

---

## 🔑 Authentication

ใช้ **Bearer Token** ใน Header:

```http
Authorization: Bearer <your_access_token>
```

Token ได้จาก:
1. `POST /auth/login` - รับ token กลับมา
2. ใส่ใน Header ของ request ที่ต้องการ auth

---

## 🧪 Testing with Postman

### 1. Import Collection
```
File → Import → Upload Files → เลือก TestShop-API-Collection.json
```

### 2. Set Environment Variables
```
base_url = http://localhost:3000
token    = (เว้นว่างไว้ จะได้จาก Login)
order_id = (เว้นว่างไว้ จะได้จาก Create Order)
```

### 3. Test Flow
```
1. Login → Copy accessToken → Paste in `token` variable
2. Get Products (ไม่ต้อง Login)
3. Add to Cart (ต้องมี token)
4. Create Order (ต้องมี token)
5. Create Payment Intent (ต้องมี token)
```

---

## 📝 Test Data (Seed)

### Users
| Email | Password | Role |
|-------|----------|------|
| customer@test.com | password123 | CUSTOMER |
| admin@test.com | password123 | ADMIN |

### Products
- **Gadget Group**: 10 items (฿1,040 - ฿1,490)
- **Fashion Group**: 10 items (฿420 - ฿690)

---

## ⚠️ HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - สำเร็จ |
| 201 | Created - สร้างสำเร็จ |
| 400 | Bad Request - ข้อมูลไม่ถูกต้อง |
| 401 | Unauthorized - ต้อง Login |
| 403 | Forbidden - ไม่มีสิทธิ์ |
| 404 | Not Found - ไม่พบข้อมูล |
| 500 | Internal Server Error |

---

## 🛡️ Rate Limiting

| Endpoint Type | Limit |
|--------------|-------|
| Public APIs | 100 requests/minute |
| Authenticated APIs | 1000 requests/minute |
| Upload APIs | 10 requests/minute |

---

## 🔗 Related Documentation

- [01-Requirements-Analysis.md](./01-Requirements-Analysis.md) - วิเคราะห์ความต้องการ
- [02-System-Architecture.md](./02-System-Architecture.md) - สถาปัตยกรรมระบบ
- [03-Database-Design.md](./03-Database-Design.md) - ออกแบบฐานข้อมูล
- [05-Frontend-Design.md](./05-Frontend-Design.md) - ออกแบบหน้าบ้าน
- [06-Backend-Design.md](./06-Backend-Design.md) - ออกแบบหลังบ้าน

---

*Last Updated: 2026-02-23*
