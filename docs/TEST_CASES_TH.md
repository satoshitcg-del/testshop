# TestShop - ชุด Test Cases ภาษาไทย

## 📋 สารบัญ

1. [Authentication](#1-authentication)
2. [User Profile](#2-user-profile)
3. [Products](#3-products)
4. [Cart](#4-cart)
5. [Orders](#5-orders)
6. [Payments](#6-payments)
7. [Admin Products](#7-admin-products)
8. [Admin Orders](#8-admin-orders)
9. [Admin Dashboard](#9-admin-dashboard)
10. [Integration Tests](#10-integration-tests)

---

## 1. Authentication

### TC-AUTH-001: สมัครสมาชิกสำเร็จ
- **Precondition**: ไม่มี
- **Steps**: POST /api/auth/register ด้วย email, password, fullName
- **Expected Result**: Status 200, ได้ accessToken และ user object
- **Priority**: High

### TC-AUTH-002: สมัครสมาชิกด้วยอีเมลซ้ำ
- **Precondition**: มี User ที่ใช้อีเมลนี้อยู่แล้ว
- **Steps**: POST /api/auth/register ด้วยอีเมลที่มีอยู่
- **Expected Result**: Status 409, error: Email already exists
- **Priority**: High

### TC-AUTH-003: สมัครสมาชิกโดยไม่กรอกข้อมูลที่จำเป็น
- **Precondition**: ไม่มี
- **Steps**: POST /api/auth/register ด้วยข้อมูลว่าง
- **Expected Result**: Status 400, error: Missing fields
- **Priority**: Medium

### TC-AUTH-004: สมัครสมาชิกด้วยรหัสผ่านสั้นเกินไป
- **Precondition**: ไม่มี
- **Steps**: POST /api/auth/register ด้วย password สั้นกว่า 6 ตัว
- **Expected Result**: Status 400
- **Priority**: Medium

### TC-AUTH-005: เข้าสู่ระบบสำเร็จ
- **Precondition**: มี User ในระบบ
- **Steps**: POST /api/auth/login ด้วย email และ password ถูกต้อง
- **Expected Result**: Status 200, ได้ accessToken
- **Priority**: High

### TC-AUTH-006: เข้าสู่ระบบด้วยรหัสผ่านผิด
- **Precondition**: มี User ในระบบ
- **Steps**: POST /api/auth/login ด้วย password ผิด
- **Expected Result**: Status 401, error: Invalid credentials
- **Priority**: High

### TC-AUTH-007: เข้าสู่ระบบด้วยอีเมลที่ไม่มีในระบบ
- **Precondition**: ไม่มี
- **Steps**: POST /api/auth/login ด้วยอีเมลที่ไม่มี
- **Expected Result**: Status 401
- **Priority**: High

### TC-AUTH-008: ออกจากระบบ
- **Precondition**: User ล็อกอินอยู่
- **Steps**: POST /api/auth/logout พร้อม Token
- **Expected Result**: Status 200
- **Priority**: Medium

### TC-AUTH-009: เข้าถึง API ที่ต้องล็อกอินโดยไม่มี Token
- **Precondition**: ไม่มี
- **Steps**: เรียก API ที่ต้อง auth โดยไม่ส่ง Token
- **Expected Result**: Status 401, error: Unauthorized
- **Priority**: High

### TC-AUTH-010: เข้าถึง API ด้วย Token หมดอายุ
- **Precondition**: มี Token ที่หมดอายุ
- **Steps**: เรียก API ด้วย Token หมดอายุ
- **Expected Result**: Status 401
- **Priority**: Medium

---

## 2. User Profile

### TC-USER-001: ดูข้อมูลโปรไฟล์ตัวเอง
- **Precondition**: User ล็อกอินอยู่
- **Steps**: GET /api/user/profile
- **Expected Result**: Status 200, ได้ข้อมูล user
- **Priority**: High

### TC-USER-002: แก้ไขชื่อผู้ใช้
- **Precondition**: User ล็อกอินอยู่
- **Steps**: PATCH /api/user/profile ด้วย fullName ใหม่
- **Expected Result**: Status 200, ชื่อถูกอัพเดท
- **Priority**: Medium

### TC-USER-003: เปลี่ยนรหัสผ่านสำเร็จ
- **Precondition**: User ล็อกอินอยู่
- **Steps**: PATCH /api/user/profile ด้วย currentPassword และ newPassword
- **Expected Result**: Status 200, รหัสผ่านเปลี่ยนแล้ว
- **Priority**: High

### TC-USER-004: เปลี่ยนรหัสผ่านด้วยรหัสปัจจุบันผิด
- **Precondition**: User ล็อกอินอยู่
- **Steps**: PATCH ด้วย currentPassword ผิด
- **Expected Result**: Status 400, error: Current password is incorrect
- **Priority**: High

### TC-USER-005: เปลี่ยนรหัสผ่านใหม่สั้นเกินไป
- **Precondition**: User ล็อกอินอยู่
- **Steps**: PATCH ด้วย newPassword สั้นกว่า 6 ตัว
- **Expected Result**: Status 400
- **Priority**: Medium

---

## 3. Products

### TC-PROD-001: ดูรายการสินค้าทั้งหมด
- **Precondition**: มีสินค้าในฐานข้อมูล
- **Steps**: GET /api/products
- **Expected Result**: Status 200, ได้ array ของ products
- **Priority**: High

### TC-PROD-002: ค้นหาสินค้า
- **Precondition**: มีสินค้า
- **Steps**: GET /api/products?search=keyword
- **Expected Result**: Status 200, ได้สินค้าที่ตรงกับคำค้นหา
- **Priority**: Medium

### TC-PROD-003: ค้นหาสินค้าที่ไม่มี
- **Precondition**: ไม่มี
- **Steps**: GET /api/products?search=ไม่มีสินค้านี้
- **Expected Result**: Status 200, items: []
- **Priority**: Low

### TC-PROD-004: ดูรายละเอียดสินค้าด้วย Slug
- **Precondition**: มีสินค้า
- **Steps**: GET /api/products/{slug}
- **Expected Result**: Status 200, ได้รายละเอียดสินค้า
- **Priority**: High

### TC-PROD-005: ดูรายละเอียดสินค้าที่ไม่มี
- **Precondition**: ไม่มี
- **Steps**: GET /api/products/ไม่มี-slug
- **Expected Result**: Status 404
- **Priority**: Medium

---

## 4. Cart

### TC-CART-001: ดูตะกร้าสินค้าว่าง
- **Precondition**: User ล็อกอิน, ตะกร้าว่าง
- **Steps**: GET /api/cart/items
- **Expected Result**: Status 200, items: []
- **Priority**: Medium

### TC-CART-002: เพิ่มสินค้าในตะกร้าสำเร็จ
- **Precondition**: User ล็อกอิน, มีสินค้า stock พอ
- **Steps**: POST /api/cart/items ด้วย productId และ quantity
- **Expected Result**: Status 200, สินค้าอยู่ในตะกร้า
- **Priority**: High

### TC-CART-003: เพิ่มสินค้าที่มีอยู่แล้วในตะกร้า
- **Precondition**: User ล็อกอิน, ตะกร้ามีสินค้านี้อยู่, stock พอ
- **Steps**: POST /api/cart/items ด้วยสินค้าเดิม
- **Expected Result**: Status 200, จำนวนรวมกัน
- **Priority**: High

### TC-CART-004: เพิ่มสินค้าที่สต็อกไม่พอ
- **Precondition**: User ล็อกอิน, stock ไม่พอ
- **Steps**: POST /api/cart/items ด้วย quantity มากกว่า stock
- **Expected Result**: Status 400, error: Insufficient stock
- **Priority**: High

### TC-CART-005: เพิ่มสินค้าในตะกร้าเกินสต็อกรวม
- **Precondition**: User ล็อกอิน, ตะกร้ามีสินค้าอยู่แล้ว
- **Steps**: POST ด้วย quantity ที่รวมแล้วเกิน stock
- **Expected Result**: Status 400, แจ้ง stock ไม่พอ
- **Priority**: High

### TC-CART-006: เพิ่มสินค้าที่ไม่มีอยู่จริง
- **Precondition**: User ล็อกอิน
- **Steps**: POST ด้วย productId ที่ไม่มี
- **Expected Result**: Status 404
- **Priority**: Medium

### TC-CART-007: แก้ไขจำนวนสินค้าในตะกร้า
- **Precondition**: User ล็อกอิน, มี cart item
- **Steps**: PATCH /api/cart/items ด้วย itemId และ quantity ใหม่
- **Expected Result**: Status 200, จำนวนอัพเดท
- **Priority**: High

### TC-CART-008: แก้ไขจำนวนเกินสต็อก
- **Precondition**: User ล็อกอิน, มี cart item
- **Steps**: PATCH ด้วย quantity เกิน stock
- **Expected Result**: Status 400
- **Priority**: High

### TC-CART-009: แก้ไข cart item ที่ไม่มีอยู่
- **Precondition**: User ล็อกอิน
- **Steps**: PATCH ด้วย itemId ที่ไม่มี
- **Expected Result**: Status 404
- **Priority**: Medium

### TC-CART-010: ลบสินค้าออกจากตะกร้า
- **Precondition**: User ล็อกอิน, มี cart item
- **Steps**: DELETE /api/cart/items ด้วย itemId
- **Expected Result**: Status 200, item ถูกลบ
- **Priority**: High

### TC-CART-011: ดูตะกร้าของ user อื่น
- **Precondition**: User A ล็อกอิน
- **Steps**: User A พยายามเข้าถึง cart คนอื่น
- **Expected Result**: User A เห็นแค่ cart ตัวเอง
- **Priority**: High

---

## 5. Orders

### TC-ORDER-001: สร้างคำสั่งซื้อสำเร็จ
- **Precondition**: User ล็อกอิน, ตะกร้ามีสินค้า, stock พอ
- **Steps**: POST /api/orders
- **Expected Result**: Status 200, Order สร้างสำเร็จ, stock ลด, ตะกร้าล้าง
- **Priority**: High

### TC-ORDER-002: สร้างคำสั่งซื้อเมื่อตะกร้าว่าง
- **Precondition**: User ล็อกอิน, ตะกร้าว่าง
- **Steps**: POST /api/orders
- **Expected Result**: Status 400, error: Cart is empty
- **Priority**: High

### TC-ORDER-003: สร้างคำสั่งซื้อเมื่อสต็อกไม่พอ
- **Precondition**: User ล็อกอิน, ตะกร้ามีสินค้า, stock ไม่พอ
- **Steps**: POST /api/orders
- **Expected Result**: Status 400, แจ้งสินค้าที่ stock ไม่พอ
- **Priority**: High

### TC-ORDER-004: ดูรายการคำสั่งซื้อของตัวเอง
- **Precondition**: User ล็อกอิน, มี orders
- **Steps**: GET /api/orders
- **Expected Result**: Status 200, ได้ orders ของตัวเอง
- **Priority**: High

### TC-ORDER-005: ดูรายละเอียดคำสั่งซื้อ
- **Precondition**: User ล็อกอิน, มี order
- **Steps**: GET /api/orders/{id}
- **Expected Result**: Status 200, ได้รายละเอียด order
- **Priority**: High

### TC-ORDER-006: ดูคำสั่งซื้อของคนอื่น
- **Precondition**: User A ล็อกอิน
- **Steps**: User A ดู order ของ User B
- **Expected Result**: Status 404
- **Priority**: High

### TC-ORDER-007: ยกเลิกคำสั่งซื้อสำเร็จ
- **Precondition**: User ล็อกอิน, มี order PENDING, ยังไม่จ่าย
- **Steps**: POST /api/orders/{id}/cancel
- **Expected Result**: Status 200, Order CANCELLED, stock คืน
- **Priority**: High

### TC-ORDER-008: ยกเลิกคำสั่งซื้อที่ชำระเงินแล้ว
- **Precondition**: User ล็อกอิน, มี order ที่จ่ายแล้ว
- **Steps**: POST /api/orders/{id}/cancel
- **Expected Result**: Status 400, แจ้งว่าไม่สามารถยกเลิกได้
- **Priority**: High

### TC-ORDER-009: ยกเลิกคำสั่งซื้อที่กำลังจัดส่ง
- **Precondition**: User ล็อกอิน, มี order SHIPPED
- **Steps**: POST /api/orders/{id}/cancel
- **Expected Result**: Status 400
- **Priority**: High

### TC-ORDER-010: ยกเลิกคำสั่งซื้อของคนอื่น
- **Precondition**: User A ล็อกอิน
- **Steps**: User A ยกเลิก order ของ User B
- **Expected Result**: Status 404
- **Priority**: High

---

## 6. Payments

### TC-PAY-001: สร้าง payment intent สำเร็จ
- **Precondition**: User ล็อกอิน, มี order ของตัวเอง
- **Steps**: POST /api/payments/intent ด้วย orderId
- **Expected Result**: Status 200, ได้ clientSecret
- **Priority**: Medium

### TC-PAY-002: สร้าง payment intent กับ order ที่ไม่มี
- **Precondition**: User ล็อกอิน
- **Steps**: POST ด้วย orderId ที่ไม่มี
- **Expected Result**: Status 404
- **Priority**: Medium

### TC-PAY-003: สร้าง payment intent กับ order ของคนอื่น
- **Precondition**: User A ล็อกอิน
- **Steps**: POST ด้วย orderId ของ User B
- **Expected Result**: Status 404
- **Priority**: High

---

## 7. Admin Products

### TC-ADMIN-PROD-001: Admin ดูรายการสินค้าทั้งหมด
- **Precondition**: Admin ล็อกอิน
- **Steps**: GET /api/admin/products
- **Expected Result**: Status 200, ได้รายการสินค้า
- **Priority**: High

### TC-ADMIN-PROD-002: User ธรรมดาพยายามเข้าถึง Admin API
- **Precondition**: User ธรรมดา ล็อกอิน
- **Steps**: GET /api/admin/products
- **Expected Result**: Status 403, error: Admin access required
- **Priority**: High

### TC-ADMIN-PROD-003: Admin สร้างสินค้าใหม่สำเร็จ
- **Precondition**: Admin ล็อกอิน
- **Steps**: POST /api/admin/products ด้วยข้อมูลสินค้า
- **Expected Result**: Status 200, สินค้าถูกสร้าง
- **Priority**: High

### TC-ADMIN-PROD-004: Admin สร้างสินค้าด้วย slug ซ้ำ
- **Precondition**: Admin ล็อกอิน, มีสินค้า slug นี้อยู่
- **Steps**: POST ด้วย slug ที่ซ้ำ
- **Expected Result**: Status 409, แจ้ง slug ซ้ำ
- **Priority**: High

### TC-ADMIN-PROD-005: Admin สร้างสินค้าด้วย slug ไม่ถูกต้อง
- **Precondition**: Admin ล็อกอิน
- **Steps**: POST ด้วย slug มีตัวพิมพ์ใหญ่หรืออักขระพิเศษ
- **Expected Result**: Status 400
- **Priority**: Medium

### TC-ADMIN-PROD-006: Admin อัพเดทสินค้า
- **Precondition**: Admin ล็อกอิน, มีสินค้า
- **Steps**: PUT /api/admin/products/{id} ด้วยข้อมูลใหม่
- **Expected Result**: Status 200, สินค้าอัพเดท
- **Priority**: High

### TC-ADMIN-PROD-007: Admin อัพเดท slug เป็นค่าที่ซ้ำ
- **Precondition**: Admin ล็อกอิน, มีสินค้า 2 รายการ
- **Steps**: PUT เปลี่ยน slug เป็นค่าที่มีอยู่แล้ว
- **Expected Result**: Status 409
- **Priority**: High

### TC-ADMIN-PROD-008: Admin ลบสินค้าที่ไม่มีในออเดอร์
- **Precondition**: Admin ล็อกอิน, มีสินค้าที่ไม่มีใน order
- **Steps**: DELETE /api/admin/products/{id}
- **Expected Result**: Status 200, สินค้าถูกลบ
- **Priority**: High

### TC-ADMIN-PROD-009: Admin ลบสินค้าที่มีในออเดอร์
- **Precondition**: Admin ล็อกอิน, มีสินค้าใน order
- **Steps**: DELETE /api/admin/products/{id}
- **Expected Result**: Status 400, แจ้งว่าไม่สามารถลบได้
- **Priority**: High

### TC-ADMIN-PROD-010: Admin อัพเดทสินค้าที่ไม่มี
- **Precondition**: Admin ล็อกอิน
- **Steps**: PUT /api/admin/products/ไม่มี
- **Expected Result**: Status 404
- **Priority**: Medium

---

## 8. Admin Orders

### TC-ADMIN-ORDER-001: Admin ดูรายการคำสั่งซื้อทั้งหมด
- **Precondition**: Admin ล็อกอิน, มี orders
- **Steps**: GET /api/admin/orders
- **Expected Result**: Status 200, ได้ orders ทั้งหมดพร้อม user info
- **Priority**: High

### TC-ADMIN-ORDER-002: Admin กรองคำสั่งซื้อตามสถานะ
- **Precondition**: Admin ล็อกอิน, มี orders หลายสถานะ
- **Steps**: GET /api/admin/orders?status=PENDING
- **Expected Result**: Status 200, ได้เฉพาะ PENDING
- **Priority**: Medium

### TC-ADMIN-ORDER-003: Admin ดูรายละเอียดคำสั่งซื้อ
- **Precondition**: Admin ล็อกอิน, มี order
- **Steps**: GET /api/admin/orders/{id}
- **Expected Result**: Status 200, ได้รายละเอียดพร้อม user info
- **Priority**: High

### TC-ADMIN-ORDER-004: Admin อัพเดทสถานะคำสั่งซื้อ
- **Precondition**: Admin ล็อกอิน, มี order PENDING
- **Steps**: PATCH /api/admin/orders/{id} ด้วย status: PROCESSING
- **Expected Result**: Status 200, status เปลี่ยน
- **Priority**: High

### TC-ADMIN-ORDER-005: Admin อัพเดทสถานะการชำระเงิน
- **Precondition**: Admin ล็อกอิน, มี order
- **Steps**: PATCH ด้วย paymentStatus: PAID
- **Expected Result**: Status 200
- **Priority**: High

### TC-ADMIN-ORDER-006: Admin อัพเดทสถานะที่ไม่มีอยู่จริง
- **Precondition**: Admin ล็อกอิน
- **Steps**: PATCH ด้วย status ที่ไม่ valid
- **Expected Result**: Status 400
- **Priority**: Medium

### TC-ADMIN-ORDER-007: Admin ดูคำสั่งซื้อแบบแบ่งหน้า
- **Precondition**: Admin ล็อกอิน, มี orders มากกว่า 20
- **Steps**: GET /api/admin/orders?page=1&limit=10
- **Expected Result**: Status 200, ได้ 10 orders พร้อม pagination
- **Priority**: Medium

---

## 9. Admin Dashboard

### TC-ADMIN-DASH-001: Admin ดูสถิติ Dashboard
- **Precondition**: Admin ล็อกอิน, มีข้อมูลในระบบ
- **Steps**: GET /api/admin/stats
- **Expected Result**: Status 200, มี totalUsers, totalProducts, totalOrders, totalRevenue, ordersByStatus, recentOrders
- **Priority**: Medium

### TC-ADMIN-DASH-002: Admin ดูสถิติย้อนหลัง 7 วัน
- **Precondition**: Admin ล็อกอิน
- **Steps**: GET /api/admin/stats?period=7d
- **Expected Result**: Status 200, ข้อมูลตามช่วง 7 วัน
- **Priority**: Low

### TC-ADMIN-DASH-003: User ธรรมดาพยายามดู Dashboard
- **Precondition**: User ธรรมดา ล็อกอิน
- **Steps**: GET /api/admin/stats
- **Expected Result**: Status 403
- **Priority**: High

---

## 10. Integration Tests

### TC-INT-001: Flow สมบูรณ์ - สมัครถึงซื้อสินค้า
- **Steps**: 
  1. สมัครสมาชิก
  2. ล็อกอิน
  3. ดูสินค้า
  4. เพิ่มลงตะกร้า
  5. สร้าง order
  6. ชำระเงิน
- **Expected Result**: ทุกขั้นตอนสำเร็จ, order สร้างสำเร็จ, stock ลด
- **Priority**: High

### TC-INT-002: Flow ยกเลิกคำสั่งซื้อ - Stock คืน
- **Precondition**: มีสินค้า stock 10
- **Steps**: 
  1. เพิ่มสินค้า 5 ชิ้นลงตะกร้า
  2. สร้าง order (stock เหลือ 5)
  3. ยกเลิก order
- **Expected Result**: Order CANCELLED, stock กลับเป็น 10
- **Priority**: High

### TC-INT-003: Concurrent Cart Updates
- **Precondition**: User ล็อกอิน, stock 10
- **Steps**: 
  1. เปิด 2 tabs
  2. Tab A: เพิ่ม 5 ชิ้น
  3. Tab B: เพิ่ม 6 ชิ้น
- **Expected Result**: Tab A สำเร็จ, Tab B ต้องเช็ค stock ล่าสุด
- **Priority**: Medium

### TC-INT-004: Race Condition - สินค้าเหลือ 1 ชิ้น
- **Precondition**: stock 1 ชิ้น, User A และ B ล็อกอิน
- **Steps**: 
  1. A และ B เพิ่มสินค้าลงตะกร้าพร้อมกัน
  2. A สร้าง order
  3. B สร้าง order
- **Expected Result**: A สำเร็จ, B ไม่สำเร็จ (stock ไม่พอ)
- **Priority**: High

### TC-INT-005: Admin จัดการสินค้าขณะมีคนเลือกในตะกร้า
- **Precondition**: User มีสินค้าในตะกร้า, stock พอดี
- **Steps**: 
  1. Admin ลด stock เป็น 0
  2. User พยายามสร้าง order
- **Expected Result**: User สร้าง order ไม่ได้
- **Priority**: High

---

## 🏷️ Priority Legend

| Priority | ความหมาย |
|----------|----------|
| **High** | ฟีเจอร์หลัก ต้องทำงานได้ 100% |
| **Medium** | ฟีเจอร์รอง ควรทำงานได้ |
| **Low** | ฟีเจอร์เสริม หรือ edge cases |

---

*สร้างเมื่อ: 2026-02-24*
*สำหรับ: TestShop E-Commerce API*
*รวมทั้งหมด: 71 Test Cases*
