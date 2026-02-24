# TestShop - คู่มือใช้งานฉบับสมบูรณ์

## สรุป: เว็บนี้ทำอะไรได้?

TestShop คือ **ระบบร้านค้าออนไลน์ (E-Commerce)** แบบครบวงจร:
- หน้าร้านให้ลูกค้าซื้อของ
- ระบบหลังบ้านให้แอดมินจัดการ
- API ครบถ้วนสำหรับเชื่อมต่อแอปอื่น

---

## ผู้ใช้งาน 2 ประเภท

### 1. ลูกค้า (Customer)
สมัครสมาชิก / เข้าสู่ระบบ / ดูสินค้า / เพิ่มลงตะกร้า / สั่งซื้อ / ยกเลิกคำสั่งซื้อ

### 2. แอดมิน (Admin)
ทำทุกอย่างที่ลูกค้าทำได้ + จัดการสินค้า / จัดการคำสั่งซื้อ / ดูสถิติ

---

## ลิงก์ใช้งาน

- **เว็บไซต์**: https://testshop-lr30.onrender.com
- **API เอกสาร**: https://testshop-lr30.onrender.com/api/docs

---

## เริ่มต้นใช้งาน (สำหรับลูกค้า)

### ขั้นตอนที่ 1: สมัครสมาชิก
```bash
POST /api/auth/register
{
  "email": "your@email.com",
  "password": "yourpassword",
  "fullName": "ชื่อ นามสกุล"
}
```

### ขั้นตอนที่ 2: เข้าสู่ระบบ
```bash
POST /api/auth/login
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```
**ผลลัพธ์:** จะได้ `accessToken` กลับมา

### ขั้นตอนที่ 3: นำ Token ไปใช้
```bash
Authorization: Bearer {accessToken}
```
ใส่ใน Header ทุกครั้งที่เรียก API ที่ต้อง Login

### ขั้นตอนที่ 4: ดูสินค้า
```bash
GET /api/products
```

### ขั้นตอนที่ 5: เพิ่มลงตะกร้า
```bash
POST /api/cart/items
Authorization: Bearer {accessToken}
{
  "productId": "ไอดีสินค้า",
  "quantity": 2
}
```

### ขั้นตอนที่ 6: สั่งซื้อ
```bash
POST /api/orders
Authorization: Bearer {accessToken}
```

---

## เริ่มต้นใช้งาน (สำหรับแอดมิน)

### สร้างสินค้าใหม่
```bash
POST /api/admin/products
Authorization: Bearer {adminToken}
{
  "name": "iPhone 15",
  "slug": "iphone-15",
  "description": "มือถือรุ่นใหม่",
  "price": 39900,
  "stockQuantity": 50
}
```

### ดูสถิติร้านค้า
```bash
GET /api/admin/stats
Authorization: Bearer {adminToken}
```

### อัพเดทสถานะคำสั่งซื้อ
```bash
PATCH /api/admin/orders/{orderId}
Authorization: Bearer {adminToken}
{
  "status": "SHIPPED"
}
```

---

## API ทั้งหมด

### ระบบยืนยันตัวตน (ไม่ต้อง Login)
| API | ใช้ทำอะไร |
|-----|----------|
| POST /api/auth/register | สมัครสมาชิก |
| POST /api/auth/login | เข้าสู่ระบบ |
| GET /api/products | ดูสินค้า |
| GET /api/products/{slug} | ดูรายละเอียดสินค้า |

### ต้อง Login (ลูกค้า)
| API | ใช้ทำอะไร |
|-----|----------|
| GET /api/user/profile | ดูโปรไฟล์ |
| PATCH /api/user/profile | แก้ไขโปรไฟล์ |
| GET /api/cart/items | ดูตะกร้า |
| POST /api/cart/items | เพิ่มสินค้า |
| PATCH /api/cart/items | แก้ไขจำนวน |
| DELETE /api/cart/items | ลบสินค้า |
| GET /api/orders | ดูคำสั่งซื้อ |
| POST /api/orders | สร้างคำสั่งซื้อ |
| POST /api/orders/{id}/cancel | ยกเลิกคำสั่งซื้อ |

### ต้องเป็น Admin
| API | ใช้ทำอะไร |
|-----|----------|
| GET/POST /api/admin/products | จัดการสินค้า |
| PUT/DELETE /api/admin/products/{id} | แก้ไข/ลบสินค้า |
| GET /api/admin/orders | ดูคำสั่งซื้อทั้งหมด |
| PATCH /api/admin/orders/{id} | เปลี่ยนสถานะ |
| GET /api/admin/stats | ดูสถิติ |

---

## สถานะคำสั่งซื้อ (Order Status)

```
PENDING     = รอดำเนินการ (ลูกค้าสั่งแล้ว รอแอดมินยืนยัน)
PROCESSING  = กำลังจัดเตรียมสินค้า
SHIPPED     = จัดส่งแล้ว
DELIVERED   = ลูกค้าได้รับสินค้า
CANCELLED   = ยกเลิก
```

---

## การทดสอบ (Testing)

### วิธีที่ 1: Swagger UI (ง่ายสุด)
1. ไปที่ https://testshop-lr30.onrender.com/api/docs
2. กด "Try it out" แล้วกรอกข้อมูล
3. ดูผลลัพธ์ทันที

### วิธีที่ 2: Postman
1. ดาวน์โหลด Postman Collection จาก GitHub
2. Import เข้า Postman
3. เริ่มใช้งาน

### วิธีที่ 3: curl
```bash
# ดูสินค้า
curl https://testshop-lr30.onrender.com/api/products

# เข้าสู่ระบบ
curl -X POST https://testshop-lr30.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password123"}'
```

---

## สรุปฟีเจอร์หลัก

- ระบบสมาชิก (JWT)
- สินค้า (ดู, ค้นหา)
- ตะกร้า (เพิ่ม/ลด/ลบ, ตรวจสอบสต็อก)
- คำสั่งซื้อ (สร้าง, ยกเลิก, ติดตาม)
- ชำระเงิน
- แอดมิน (CRUD สินค้า, จัดการออเดอร์)
- สถิติ (Dashboard)
- API เอกสาร (Swagger)
- Test Cases (71 cases)
- CI/CD (Jenkins)

---

## แก้ปัญหาเบื้องต้น

| ปัญหา | สาเหตุ | แก้ไข |
|-------|--------|--------|
| "Unauthorized" | ไม่ส่ง Token หรือ Token หมดอายุ | เข้าสู่ระบบใหม่ |
| "Insufficient stock" | สินค้าไม่พอ | ลดจำนวนหรือรอเติมสต็อก |
| "Admin access required" | ไม่ใช่แอดมิน | Login ด้วยบัญชี Admin |

---

เริ่มต้นใช้งานได้เลย!
