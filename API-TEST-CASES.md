# TestShop API Test Cases

## ข้อมูลการทดสอบ

| รายการ | ค่า |
|--------|-----|
| **Base URL** | `http://localhost:3000` |
| **Test User** | customer@test.com / password123 |
| **Admin User** | admin@test.com / password123 |

---

## 1. Authentication (Auth)

### TC-AUTH-01: Login สำเร็จ
```
Method: POST
Endpoint: /api/auth/login
Request Body:
{
  "email": "customer@test.com",
  "password": "password123"
}
Expected: 200 OK
Response: { "success": true, "data": { "user": {...}, "accessToken": "..." } }
```

### TC-AUTH-02: Login รหัสผิด
```
Method: POST
Endpoint: /api/auth/login
Request Body:
{
  "email": "customer@test.com",
  "password": "wrongpassword"
}
Expected: 401 Unauthorized
Response: { "success": false, "error": "Invalid email or password" }
```

### TC-AUTH-03: Register สำเร็จ
```
Method: POST
Endpoint: /api/auth/register
Request Body:
{
  "email": "newuser@test.com",
  "password": "password123",
  "fullName": "New User"
}
Expected: 201 Created
Response: { "success": true, "data": { "user": {...} } }
```

### TC-AUTH-04: Logout
```
Method: POST
Endpoint: /api/auth/logout
Headers: Authorization: Bearer <token>
Expected: 200 OK
Response: { "success": true, "message": "Logged out successfully" }
```

---

## 2. Products

### TC-PROD-01: ดูสินค้าทั้งหมด
```
Method: GET
Endpoint: /api/products
Expected: 200 OK
Response: { "success": true, "data": { "items": [...], "total": 20 } }
```

### TC-PROD-02: ดูสินค้าตาม slug
```
Method: GET
Endpoint: /api/products/gadget-1
Expected: 200 OK
Response: { "success": true, "data": { "id": "...", "name": "Gadget 1", ... } }
```

### TC-PROD-03: ดูสินค้าที่ไม่มี (404)
```
Method: GET
Endpoint: /api/products/not-exist
Expected: 404 Not Found
Response: { "success": false, "error": "Product not found" }
```

---

## 3. Cart

### TC-CART-01: ดูตะกร้า (ต้อง Login)
```
Method: GET
Endpoint: /api/cart/items
Headers: Authorization: Bearer <token>
Expected: 200 OK
Response: { "success": true, "data": { "items": [...], "subtotal": 0 } }
```

### TC-CART-02: เพิ่มสินค้าในตะกร้า
```
Method: POST
Endpoint: /api/cart/items
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
Request Body:
{
  "productId": "<product_id>",
  "quantity": 2
}
Expected: 201 Created
Response: { "success": true, "message": "Item added to cart" }
```

### TC-CART-03: ลบสินค้าออกจากตะกร้า
```
Method: DELETE
Endpoint: /api/cart/items
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
Request Body:
{
  "productId": "<product_id>"
}
Expected: 200 OK
Response: { "success": true, "message": "Item removed from cart" }
```

### TC-CART-04: ดูตะกร้าโดยไม่ Login (401)
```
Method: GET
Endpoint: /api/cart/items
Expected: 401 Unauthorized
Response: { "success": false, "error": "Unauthorized" }
```

---

## 4. Orders

### TC-ORD-01: สร้างคำสั่งซื้อ
```
Method: POST
Endpoint: /api/orders
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
Request Body:
{
  "shippingAddress": "123 Bangkok, Thailand",
  "paymentMethod": "credit_card"
}
Expected: 201 Created
Response: { "success": true, "data": { "order": { "id": "...", "status": "PENDING" } } }
```

### TC-ORD-02: ดูคำสั่งซื้อทั้งหมด
```
Method: GET
Endpoint: /api/orders
Headers: Authorization: Bearer <token>
Expected: 200 OK
Response: { "success": true, "data": { "orders": [...] } }
```

### TC-ORD-03: ดูคำสั่งซื้อตาม ID
```
Method: GET
Endpoint: /api/orders/<order_id>
Headers: Authorization: Bearer <token>
Expected: 200 OK
Response: { "success": true, "data": { "id": "...", "items": [...], "totalAmount": ... } }
```

---

## 5. Payments

### TC-PAY-01: สร้าง Payment Intent
```
Method: POST
Endpoint: /api/payments/intent
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
Request Body:
{
  "orderId": "<order_id>"
}
Expected: 200 OK
Response: { "success": true, "data": { "clientSecret": "..." } }
```

---

## วิธีใช้ Postman Collection

1. เปิด Postman
2. Import → Upload Files → เลือก `TestShop-API-Collection.json`
3. ตั้งค่า Environment Variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (เว้นว่าง จะได้จาก Login)
4. เรียก API ตามลำดับ:
   1. Login → เก็บ token ใส่ใน environment
   2. ทดสอบ Products (ไม่ต้อง Login)
   3. ทดสอบ Cart/Orders (ต้องมี token)

---

## Test Data ที่มีอยู่

### Users (Seed Data)
| Email | Password | Role |
|-------|----------|------|
| customer@test.com | password123 | CUSTOMER |
| admin@test.com | password123 | ADMIN |

### Products (Seed Data)
| กลุ่ม | จำนวน | ราคา |
|-------|--------|------|
| Gadget (อิเล็กทรอนิกส์) | 10 รายการ | 1,040 - 1,490 บาท |
| Fashion (แฟชั่น) | 10 รายการ | 420 - 690 บาท |

---

## Quick Test Checklist

- [ ] Login ได้
- [ ] Register ได้
- [ ] ดูสินค้าทั้งหมดได้
- [ ] ดูรายละเอียดสินค้าได้
- [ ] เพิ่มสินค้าในตะกร้าได้
- [ ] ดูตะกร้าได้
- [ ] ลบสินค้าออกจากตะกร้าได้
- [ ] สร้างคำสั่งซื้อได้
- [ ] ดูคำสั่งซื้อของตัวเองได้
