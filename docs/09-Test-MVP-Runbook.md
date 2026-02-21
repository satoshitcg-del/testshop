# ✅ 9. Test/MVP Runbook (แนวทางติดตั้ง/ทดสอบเว็บทดสอบ)

## 9.1 เป้าหมาย
ทำให้เว็บทดสอบ “รันได้จริง” ในเวลาสั้นที่สุด โดยเน้นฟีเจอร์หลักเท่านั้น

---

## 9.2 ข้อกำหนดระบบขั้นต่ำ (Test/MVP)
- สมัคร/เข้าสู่ระบบด้วยอีเมล
- ดูสินค้า + รายละเอียดสินค้า
- ตะกร้าสินค้า
- Checkout แบบทดสอบ (Mock หรือ Stripe Test Mode)
- ดูคำสั่งซื้อของตัวเอง

---

## 9.3 โครงสร้างข้อมูลขั้นต่ำ (Test Schema)
> อ้างอิง `docs/03-Database-Design.md` (Test/MVP Prisma Schema)

ตารางหลักที่ต้องมี:
- `users`
- `products`
- `carts`
- `cart_items`
- `orders`
- `order_items`

---

## 9.4 ชุดข้อมูลจำลองขั้นต่ำ (Seed Data)
- ผู้ใช้ 2 คน
  - `customer@test.com` / `password123`
  - `admin@test.com` / `password123`
- สินค้า 20 รายการ
  - กลุ่มอิเล็กทรอนิกส์ 10 รายการ
  - กลุ่มแฟชั่น 10 รายการ
- คำสั่งซื้อ 5 รายการ
  - สถานะ `PENDING` 2 รายการ
  - สถานะ `PAID` 3 รายการ

---

## 9.5 Environment Variables (ตัวอย่างสำหรับทดสอบ)
ใช้ค่า test เท่านั้น ห้ามใส่ live keys

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Auth
JWT_SECRET=dev-secret
JWT_REFRESH_SECRET=dev-refresh-secret

# Database
DATABASE_URL="file:./dev.db"

# Payment (Stripe Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

---

## 9.6 Quick Start (Local)
```bash
cd frontend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

ถ้า `npm install` ติด permission ให้ลอง:
```bash
setx npm_config_cache "%cd%\\.npm-cache"
```
เปิดเทอร์มินัลใหม่แล้วรัน `npm install` อีกครั้ง

---

## 9.7 Smoke Test (เช็คเร็ว)
1. สมัคร/เข้าสู่ระบบได้
2. เปิดหน้า `/products` ได้
3. เพิ่มสินค้าเข้าตะกร้าได้
4. Checkout แบบทดสอบได้
5. ดูคำสั่งซื้อของตัวเองได้

---

## 9.8 Manual Test Checklist (ละเอียดขึ้น)
1. Auth
1. Login ด้วย user ที่ seed
1. Login ผิดรหัสแล้วเห็น error ที่เข้าใจได้
1. Product
1. หน้า `/products` แสดงสินค้า 20 รายการ
1. หน้า `/products/:slug` แสดงรายละเอียดครบ
1. Cart
1. เพิ่มสินค้าได้อย่างน้อย 2 ชิ้น
1. แก้จำนวนได้
1. ลบสินค้าได้
1. Order
1. สร้างคำสั่งซื้อได้
1. ดู order history ได้

---

## 9.9 เกณฑ์ผ่านเว็บทดสอบ
- ฟีเจอร์หลักทั้งหมดทำงานตาม Smoke Test
- ไม่มี error ที่บล็อก flow การซื้อ
- ข้อมูล seed ใช้งานได้จริง
