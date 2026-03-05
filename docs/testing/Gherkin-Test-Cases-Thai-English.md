# TestShop Gherkin Test Cases
## เอกสาร Test Case ภาษาไทย และ English (Gherkin Format)

---

## 📝 โครงสร้างเอกสาร

แต่ละ Feature จะมี 2 ภาษา:
- 🇹🇭 **ภาษาไทย** (Thai)
- 🇬🇧 **English** (English)

---

# 1️⃣ Feature: Authentication (ระบบเข้าสู่ระบบ)

---

## 🇹🇭 ภาษาไทย

```gherkin
Feature: ระบบเข้าสู่ระบบ (Login)
  ในฐานะผู้ใช้งานระบบ
  ฉันต้องการเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
  เพื่อใช้งานฟีเจอร์ต่าง ๆ ที่ต้องการสิทธิ์ผู้ใช้

  Background:
    Given มีผู้ใช้ลงทะเบียนอยู่ในระบบดังนี้:
      | email               | password      | fullName      | role      |
      | customer@test.com   | password123   | Test Customer | CUSTOMER  |
      | admin@test.com      | password123   | Test Admin    | ADMIN     |

  # ----------------------------------------
  # Test Case: AUTH-001
  # ----------------------------------------
  Scenario: เข้าสู่ระบบสำเร็จด้วยข้อมูลถูกต้อง (Valid Login)
    Given ฉันมีข้อมูลเข้าสู่ระบบดังนี้:
      | field    | value               |
      | email    | customer@test.com   |
      | password | password123         |
    When ฉันส่งคำขอ POST ไปที่ "/api/auth/login" พร้อมข้อมูลเข้าสู่ระบบ
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And โครงสร้าง JSON ตอบกลับต้องมีฟิลด์ "success" เป็น true
      And ต้องมีฟิลด์ "data.accessToken" ที่ไม่เป็นค่าว่าง
      And ต้องมีฟิลด์ "data.user" ที่ประกอบด้วย:
        | field    | expectedValue       |
        | id       | (UUID format)       |
        | email    | customer@test.com   |
        | fullName | Test Customer       |
        | role     | CUSTOMER            |
      And เวลาตอบกลับต้องน้อยกว่า 2000 มิลลิวินาที

  # ----------------------------------------
  # Test Case: AUTH-002
  # ----------------------------------------
  Scenario: เข้าสู่ระบบไม่สำเร็จเนื่องจากรหัสผ่านผิด (Invalid Password)
    Given ฉันมีข้อมูลเข้าสู่ระบบดังนี้:
      | field    | value               |
      | email    | customer@test.com   |
      | password | wrongpassword       |
    When ฉันส่งคำขอ POST ไปที่ "/api/auth/login" พร้อมข้อมูลเข้าสู่ระบบ
    Then ระบบตอบกลับด้วยสถานะ 401 (Unauthorized)
      And โครงสร้าง JSON ตอบกลับต้องมีฟิลด์ "success" เป็น false
      And ต้องมีข้อความแสดงข้อผิดพลาด "Invalid email or password"
      And ต้องไม่มีฟิลด์ "data.accessToken"

  # ----------------------------------------
  # Test Case: AUTH-003
  # ----------------------------------------
  Scenario: เข้าสู่ระบบไม่สำเร็จเนื่องจากไม่มีผู้ใช้ในระบบ (User Not Found)
    Given ฉันมีข้อมูลเข้าสู่ระบบดังนี้:
      | field    | value                 |
      | email    | notexist@test.com     |
      | password | password123           |
    When ฉันส่งคำขอ POST ไปที่ "/api/auth/login" พร้อมข้อมูลเข้าสู่ระบบ
    Then ระบบตอบกลับด้วยสถานะ 401 (Unauthorized)
      And ต้องมีข้อความแสดงข้อผิดพลาด "Invalid email or password"

  # ----------------------------------------
  # Test Case: AUTH-004
  # ----------------------------------------
  Scenario: เข้าสู่ระบบไม่สำเร็จเนื่องจากไม่ระบุอีเมล (Missing Email)
    Given ฉันมีข้อมูลเข้าสู่ระบบดังนี้:
      | field    | value               |
      | email    | (ว่าง)              |
      | password | password123         |
    When ฉันส่งคำขอ POST ไปที่ "/api/auth/login" พร้อมข้อมูลเข้าสู่ระบบ
    Then ระบบตอบกลับด้วยสถานะ 400 (Bad Request)
      And ต้องมีข้อความแสดงข้อผิดพลาด "Missing credentials"

  # ----------------------------------------
  # Test Case: AUTH-005
  # ----------------------------------------
  Scenario: ลงทะเบียนผู้ใช้ใหม่สำเร็จ (Register Success)
    Given ฉันมีข้อมูลลงทะเบียนดังนี้:
      | field     | value                 |
      | email     | newuser@test.com      |
      | password  | newpassword123        |
      | fullName  | New Test User         |
    And อีเมล "newuser@test.com" ยังไม่มีในระบบ
    When ฉันส่งคำขอ POST ไปที่ "/api/auth/register"
    Then ระบบตอบกลับด้วยสถานะ 201 (Created)
      And โครงสร้าง JSON ต้องมี "success" เป็น true
      And ต้องมีข้อมูลผู้ใช้ที่สร้างใหม่ใน "data.user"
      And อีเมลต้องเป็น "newuser@test.com"
      And บทบาทต้องเป็น "CUSTOMER" โดยค่าเริ่มต้น

  # ----------------------------------------
  # Test Case: AUTH-006
  # ----------------------------------------
  Scenario: ลงทะเบียนไม่สำเร็จเนื่องจากอีเมลซ้ำ (Duplicate Email)
    Given ฉันมีข้อมูลลงทะเบียนดังนี้:
      | field     | value               |
      | email     | customer@test.com   |
      | password  | password123         |
      | fullName  | Duplicate User      |
    And อีเมล "customer@test.com" มีอยู่ในระบบแล้ว
    When ฉันส่งคำขอ POST ไปที่ "/api/auth/register"
    Then ระบบตอบกลับด้วยสถานะ 409 (Conflict)
      Or สถานะ 400 (Bad Request)
      And ต้องมีข้อความแสดงข้อผิดพลาดเกี่ยวกับอีเมลซ้ำ

  # ----------------------------------------
  # Test Case: AUTH-007
  # ----------------------------------------
  Scenario: ออกจากระบบสำเร็จ (Logout Success)
    Given ฉันเข้าสู่ระบบแล้วด้วย token ที่ถูกต้อง
    When ฉันส่งคำขอ POST ไปที่ "/api/auth/logout" พร้อม Authorization header
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And ต้องมีข้อความ "Logged out successfully"
      And token ต้องถูกยกเลิก (invalidate) ในระบบ
```

---

## 🇬🇧 English

```gherkin
Feature: User Authentication (Login System)
  As a registered user
  I want to log in with my email and password
  So that I can access features that require user authentication

  Background:
    Given the following users exist in the system:
      | email               | password      | fullName      | role      |
      | customer@test.com   | password123   | Test Customer | CUSTOMER  |
      | admin@test.com      | password123   | Test Admin    | ADMIN     |

  # ----------------------------------------
  # Test Case: AUTH-001
  # ----------------------------------------
  Scenario: Successful login with valid credentials
    Given I have the following login credentials:
      | field    | value               |
      | email    | customer@test.com   |
      | password | password123         |
    When I send a POST request to "/api/auth/login" with the credentials
    Then the system responds with status 200 (OK)
      And the JSON response should have "success" field set to true
      And the response should contain "data.accessToken" that is not empty
      And the response should contain "data.user" with the following fields:
        | field    | expectedValue       |
        | id       | (UUID format)       |
        | email    | customer@test.com   |
        | fullName | Test Customer       |
        | role     | CUSTOMER            |
      And the response time should be less than 2000 milliseconds

  # ----------------------------------------
  # Test Case: AUTH-002
  # ----------------------------------------
  Scenario: Login fails with invalid password
    Given I have the following login credentials:
      | field    | value               |
      | email    | customer@test.com   |
      | password | wrongpassword       |
    When I send a POST request to "/api/auth/login" with the credentials
    Then the system responds with status 401 (Unauthorized)
      And the JSON response should have "success" field set to false
      And the error message should be "Invalid email or password"
      And the response should not contain "data.accessToken"

  # ----------------------------------------
  # Test Case: AUTH-003
  # ----------------------------------------
  Scenario: Login fails when user does not exist
    Given I have the following login credentials:
      | field    | value                 |
      | email    | notexist@test.com     |
      | password | password123           |
    When I send a POST request to "/api/auth/login" with the credentials
    Then the system responds with status 401 (Unauthorized)
      And the error message should be "Invalid email or password"

  # ----------------------------------------
  # Test Case: AUTH-004
  # ----------------------------------------
  Scenario: Login fails with missing email
    Given I have the following login credentials:
      | field    | value               |
      | email    | (empty)             |
      | password | password123         |
    When I send a POST request to "/api/auth/login" with the credentials
    Then the system responds with status 400 (Bad Request)
      And the error message should be "Missing credentials"

  # ----------------------------------------
  # Test Case: AUTH-005
  # ----------------------------------------
  Scenario: Successful user registration
    Given I have the following registration data:
      | field     | value                 |
      | email     | newuser@test.com      |
      | password  | newpassword123        |
      | fullName  | New Test User         |
    And the email "newuser@test.com" does not exist in the system
    When I send a POST request to "/api/auth/register"
    Then the system responds with status 201 (Created)
      And the JSON response should have "success" field set to true
      And the response should contain "data.user" with the new user details
      And the email should be "newuser@test.com"
      And the role should be "CUSTOMER" by default

  # ----------------------------------------
  # Test Case: AUTH-006
  # ----------------------------------------
  Scenario: Registration fails with duplicate email
    Given I have the following registration data:
      | field     | value               |
      | email     | customer@test.com   |
      | password  | password123         |
      | fullName  | Duplicate User      |
    And the email "customer@test.com" already exists in the system
    When I send a POST request to "/api/auth/register"
    Then the system responds with status 409 (Conflict) or 400 (Bad Request)
      And the error message should indicate email already exists

  # ----------------------------------------
  # Test Case: AUTH-007
  # ----------------------------------------
  Scenario: Successful logout
    Given I am logged in with a valid authentication token
    When I send a POST request to "/api/auth/logout" with Authorization header
    Then the system responds with status 200 (OK)
      And the message should be "Logged out successfully"
      And the token should be invalidated in the system
```

---

# 2️⃣ Feature: Product Management (ระบบจัดการสินค้า)

---

## 🇹🇭 ภาษาไทย

```gherkin
Feature: ระบบจัดการสินค้า (Product Management)
  ในฐานะลูกค้า
  ฉันต้องการดูรายการสินค้าและรายละเอียดสินค้า
  เพื่อตัดสินใจเลือกซื้อสินค้า

  Background:
    Given มีสินค้าในระบบดังนี้:
      | name       | slug        | description                  | price  | stock |
      | Gadget 1   | gadget-1    | อุปกรณ์อิเล็กทรอนิกส์รุ่น 1   | 1040   | 20    |
      | Gadget 2   | gadget-2    | อุปกรณ์อิเล็กทรอนิกส์รุ่น 2   | 1090   | 15    |
      | Fashion 1  | fashion-1   | สินค้าแฟชั่นรุ่น 1           | 420    | 30    |

  # ----------------------------------------
  # Test Case: PROD-001
  # ----------------------------------------
  Scenario: ดูรายการสินค้าทั้งหมด (Get All Products)
    Given ฉันเป็นผู้ใช้ทั่วไป (ไม่ต้อง login)
    When ฉันส่งคำขอ GET ไปที่ "/api/products"
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And โครงสร้าง JSON ต้องมี "success" เป็น true
      And ต้องมี "data.items" ที่เป็น array
      And จำนวนสินค้าต้องมากกว่า 0
      And แต่ละสินค้าต้องมีฟิลด์: id, name, slug, description, price, stockQuantity
      And ต้องมี "data.total" ที่แสดงจำนวนรายการทั้งหมด

  # ----------------------------------------
  # Test Case: PROD-002
  # ----------------------------------------
  Scenario: ดูรายละเอียดสินค้าด้วย slug (Get Product by Slug)
    Given มีสินค้าชื่อ "Gadget 1" ที่มี slug เป็น "gadget-1"
    When ฉันส่งคำขอ GET ไปที่ "/api/products/gadget-1"
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And ข้อมูลสินค้าต้องมี:
        | field         | expectedValue                |
        | name          | Gadget 1                     |
        | slug          | gadget-1                     |
        | description   | อุปกรณ์อิเล็กทรอนิกส์รุ่น 1  |
        | price         | 1040                         |
        | stockQuantity | 20                           |

  # ----------------------------------------
  # Test Case: PROD-003
  # ----------------------------------------
  Scenario: ดูรายละเอียดสินค้าที่ไม่มีในระบบ (Product Not Found)
    Given ไม่มีสินค้าที่มี slug เป็น "not-exist"
    When ฉันส่งคำขอ GET ไปที่ "/api/products/not-exist"
    Then ระบบตอบกลับด้วยสถานะ 404 (Not Found)
      And ต้องมีข้อความแสดงข้อผิดพลาด "Product not found"

  # ----------------------------------------
  # Test Case: PROD-004
  # ----------------------------------------
  Scenario: ตรวจสอบราคาสินค้าต้องเป็นตัวเลขบวก (Product Price Validation)
    Given ฉันได้รับรายการสินค้าทั้งหมด
    When ฉันตรวจสอบแต่ละสินค้าในรายการ
    Then ราคา (price) ของทุกสินค้าต้องเป็นตัวเลข
      And ราคาต้องมากกว่า 0
      And จำนวนสินค้าในสต็อก (stockQuantity) ต้องเป็นจำนวนเต็มที่ไม่ติดลบ
```

---

## 🇬🇧 English

```gherkin
Feature: Product Management
  As a customer
  I want to view product listings and details
  So that I can make informed purchasing decisions

  Background:
    Given the following products exist in the system:
      | name       | slug        | description                  | price  | stock |
      | Gadget 1   | gadget-1    | Electronic device model 1    | 1040   | 20    |
      | Gadget 2   | gadget-2    | Electronic device model 2    | 1090   | 15    |
      | Fashion 1  | fashion-1   | Fashion item model 1         | 420    | 30    |

  # ----------------------------------------
  # Test Case: PROD-001
  # ----------------------------------------
  Scenario: Get all products list
    Given I am a general user (no login required)
    When I send a GET request to "/api/products"
    Then the system responds with status 200 (OK)
      And the JSON response should have "success" set to true
      And the response should contain "data.items" as an array
      And the number of products should be greater than 0
      And each product should have fields: id, name, slug, description, price, stockQuantity
      And the response should contain "data.total" showing total count

  # ----------------------------------------
  # Test Case: PROD-002
  # ----------------------------------------
  Scenario: Get product details by slug
    Given a product named "Gadget 1" with slug "gadget-1" exists
    When I send a GET request to "/api/products/gadget-1"
    Then the system responds with status 200 (OK)
      And the product data should contain:
        | field         | expectedValue                |
        | name          | Gadget 1                     |
        | slug          | gadget-1                     |
        | description   | Electronic device model 1    |
        | price         | 1040                         |
        | stockQuantity | 20                           |

  # ----------------------------------------
  # Test Case: PROD-003
  # ----------------------------------------
  Scenario: Get non-existent product
    Given no product exists with slug "not-exist"
    When I send a GET request to "/api/products/not-exist"
    Then the system responds with status 404 (Not Found)
      And the error message should be "Product not found"

  # ----------------------------------------
  # Test Case: PROD-004
  # ----------------------------------------
  Scenario: Product price validation
    Given I have received the product list
    When I check each product in the list
    Then the price of every product should be a number
      And the price should be greater than 0
      And the stock quantity should be a non-negative integer
```

---

# 3️⃣ Feature: Shopping Cart (ระบบตะกร้าสินค้า)

---

## 🇹🇭 ภาษาไทย

```gherkin
Feature: ระบบตะกร้าสินค้า (Shopping Cart)
  ในฐานะลูกค้าที่เข้าสู่ระบบแล้ว
  ฉันต้องการเพิ่ม แก้ไข และลบสินค้าในตะกร้า
  เพื่อเตรียมสินค้าสำหรับการสั่งซื้อ

  Background:
    Given ฉันเข้าสู่ระบบด้วย "customer@test.com"
    And มีสินค้า "Gadget 1" ราคา 1040 บาท ในสต็อก 20 ชิ้น
    And มีสินค้า "Fashion 1" ราคา 420 บาท ในสต็อก 30 ชิ้น

  # ----------------------------------------
  # Test Case: CART-001
  # ----------------------------------------
  Scenario: ดูตะกร้าสินค้า (Get Cart Items)
    Given ฉันมีตะกร้าสินค้าที่มีสินค้าอยู่แล้ว
    When ฉันส่งคำขอ GET ไปที่ "/api/cart/items" พร้อม Authorization token
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And ต้องมี "data.items" ที่เป็น array
      And ต้องมี "success" เป็น true

  # ----------------------------------------
  # Test Case: CART-002
  # ----------------------------------------
  Scenario: เพิ่มสินค้าลงตะกร้าสำเร็จ (Add Item to Cart)
    Given ฉันมี ID ของสินค้า "Gadget 1"
    When ฉันส่งคำขอ POST ไปที่ "/api/cart/items" พร้อม:
      | field      | value              |
      | productId  | (Gadget 1 ID)      |
      | quantity   | 2                  |
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And ตะกร้าต้องมีสินค้า "Gadget 1" จำนวน 2 ชิ้น
      And ใน response ต้องมี "data.items" ที่มี productId ตรงกับสินค้า

  # ----------------------------------------
  # Test Case: CART-003
  # ----------------------------------------
  Scenario: เพิ่มสินค้าที่มีอยู่แล้วในตะกร้า (Add Duplicate Item)
    Given ฉันมี "Gadget 1" จำนวน 1 ชิ้นอยู่ในตะกร้าแล้ว
    When ฉันเพิ่ม "Gadget 1" อีก 2 ชิ้น
    Then จำนวน "Gadget 1" ในตะกร้าต้องเป็น 3 ชิ้น
      And ยอดรวมต้องอัปเดตเป็น 3120 บาท

  # ----------------------------------------
  # Test Case: CART-004
  # ----------------------------------------
  Scenario: แก้ไขจำนวนสินค้าในตะกร้า (Update Cart Quantity)
    Given ฉันมี "itemId" ของสินค้า "Gadget 1" ในตะกร้า
    When ฉันส่งคำขอ PATCH ไปที่ "/api/cart/items" พร้อม:
      | field    | value            |
      | itemId   | (cart item id)   |
      | quantity | 1                |
    Then จำนวน "Gadget 1" ในตะกร้าต้องเป็น 1 ชิ้น
      And ระบบตอบกลับด้วยสถานะ 200 (OK)

  # ----------------------------------------
  # Test Case: CART-005
  # ----------------------------------------
  Scenario: ลบสินค้าออกจากตะกร้า (Remove Item from Cart)
    Given ฉันมี "itemId" ของสินค้า "Gadget 1" ในตะกร้า
    When ฉันส่งคำขอ DELETE ไปที่ "/api/cart/items" พร้อม itemId ของ "Gadget 1"
    Then สินค้า "Gadget 1" ต้องถูกลบออกจากตะกร้า
      And ระบบตอบกลับด้วยสถานะ 200 (OK)
      And response ต้องมี "data.items"

  # ----------------------------------------
  # Test Case: CART-006
  # ----------------------------------------
  Scenario: เพิ่มสินค้าเกินจำนวนสต็อก (Add Item Exceeding Stock)
    Given สินค้า "Gadget 1" มีในสต็อกแค่ 20 ชิ้น
    When ฉันพยายามเพิ่ม "Gadget 1" จำนวน 25 ชิ้น
    Then ระบบตอบกลับด้วยสถานะ 400 (Bad Request)
      And ข้อความแสดงข้อผิดพลาดต้องบอกว่าเกินจำนวนสต็อก

  # ----------------------------------------
  # Test Case: CART-007
  # ----------------------------------------
  Scenario: เข้าถึงตะกร้าโดยไม่ได้เข้าสู่ระบบ (Access Cart Without Auth)
    Given ฉันไม่ได้ส่ง Authorization token
    When ฉันส่งคำขอ GET ไปที่ "/api/cart/items"
    Then ระบบตอบกลับด้วยสถานะ 401 (Unauthorized)
      And ข้อความแสดงข้อผิดพลาดเกี่ยวกับการไม่ได้รับอนุญาต
```

---

## 🇬🇧 English

```gherkin
Feature: Shopping Cart Management
  As a logged-in customer
  I want to add, update, and remove items from my cart
  So that I can prepare items for checkout

  Background:
    Given I am logged in as "customer@test.com"
    And product "Gadget 1" exists with price 1040 and stock 20
    And product "Fashion 1" exists with price 420 and stock 30

  # ----------------------------------------
  # Test Case: CART-001
  # ----------------------------------------
  Scenario: View cart items
    Given I have items in my cart
    When I send a GET request to "/api/cart/items" with Authorization token
    Then the system responds with status 200 (OK)
      And the response should contain "data.items" as an array
      And the response should contain "success" as true

  # ----------------------------------------
  # Test Case: CART-002
  # ----------------------------------------
  Scenario: Add item to cart successfully
    Given I have the ID of product "Gadget 1"
    When I send a POST request to "/api/cart/items" with:
      | field      | value              |
      | productId  | (Gadget 1 ID)      |
      | quantity   | 2                  |
    Then the system responds with status 200 (OK)
      And the cart should contain "Gadget 1" with quantity 2
      And the response should contain "data.items" with matching productId

  # ----------------------------------------
  # Test Case: CART-003
  # ----------------------------------------
  Scenario: Add duplicate item to cart
    Given I already have "Gadget 1" with quantity 1 in my cart
    When I add "Gadget 1" with quantity 2 more
    Then the cart should show "Gadget 1" with total quantity 3
      And the subtotal should update to 3120

  # ----------------------------------------
  # Test Case: CART-004
  # ----------------------------------------
  Scenario: Update cart item quantity
    Given I have "itemId" for "Gadget 1" in my cart
    When I send a PATCH request to "/api/cart/items" with:
      | field    | value            |
      | itemId   | (cart item id)   |
      | quantity | 1                |
    Then the cart should show "Gadget 1" with quantity 1
      And the system responds with status 200 (OK)

  # ----------------------------------------
  # Test Case: CART-005
  # ----------------------------------------
  Scenario: Remove item from cart
    Given I have "itemId" for "Gadget 1" in my cart
    When I send a DELETE request to "/api/cart/items" with itemId of "Gadget 1"
    Then "Gadget 1" should be removed from the cart
      And the system responds with status 200 (OK)
      And the response should contain "data.items"

  # ----------------------------------------
  # Test Case: CART-006
  # ----------------------------------------
  Scenario: Add item exceeding stock
    Given product "Gadget 1" has only 20 items in stock
    When I try to add "Gadget 1" with quantity 25
    Then the system responds with status 400 (Bad Request)
      And the error message should indicate exceeding stock limit

  # ----------------------------------------
  # Test Case: CART-007
  # ----------------------------------------
  Scenario: Access cart without authentication
    Given I do not provide an Authorization token
    When I send a GET request to "/api/cart/items"
    Then the system responds with status 401 (Unauthorized)
      And the error message should indicate authentication required
```

---

# 4️⃣ Feature: Order Management (ระบบจัดการคำสั่งซื้อ)

---

## 🇹🇭 ภาษาไทย

```gherkin
Feature: ระบบจัดการคำสั่งซื้อ (Order Management)
  ในฐานะลูกค้าที่เข้าสู่ระบบแล้ว
  ฉันต้องการสร้างคำสั่งซื้อและดูประวัติการสั่งซื้อ
  เพื่อติดตามสถานะการสั่งซื้อของฉัน

  Background:
    Given ฉันเข้าสู่ระบบด้วย "customer@test.com"
    And ฉันมีสินค้าในตะกร้าดังนี้:
      | สินค้า      | จำนวน | ราคาต่อชิ้น |
      | Gadget 1   | 2     | 1040        |
      | Fashion 1  | 1     | 420         |
    And ยอดรวมในตะกร้าเป็น 2500 บาท

  # ----------------------------------------
  # Test Case: ORD-001
  # ----------------------------------------
  Scenario: สร้างคำสั่งซื้อสำเร็จ (Create Order Success)
    Given ฉันมีสินค้าในตะกร้า
    When ฉันส่งคำขอ POST ไปที่ "/api/orders" พร้อม:
      | field            | value                      |
      | shippingAddress  | 123 ถนนสุขุมวิท กรุงเทพฯ   |
      | paymentMethod    | credit_card                |
    Then ระบบตอบกลับด้วยสถานะ 201 (Created)
      And สร้างคำสั่งซื้อใหม่สำเร็จ
      And คำสั่งซื้อมีสถานะ "PENDING"
      And คำสั่งซื้อมีรายการสินค้าครบถ้วน
      And ยอดรวมคำสั่งซื้อเป็น 2500 บาท
      And ตะกร้าสินค้าถูกล้างหรืออัปเดต

  # ----------------------------------------
  # Test Case: ORD-002
  # ----------------------------------------
  Scenario: สร้างคำสั่งซื้อโดยไม่มีสินค้าในตะกร้า (Create Order with Empty Cart)
    Given ตะกร้าของฉันว่างเปล่า
    When ฉันส่งคำขอ POST ไปที่ "/api/orders"
    Then ระบบตอบกลับด้วยสถานะ 400 (Bad Request)
      And ข้อความแสดงข้อผิดพลาดบอกว่าตะกร้าว่างเปล่า

  # ----------------------------------------
  # Test Case: ORD-003
  # ----------------------------------------
  Scenario: ดูรายการคำสั่งซื้อทั้งหมด (Get My Orders)
    Given ฉันมีคำสั่งซื้อในระบบอย่างน้อย 1 รายการ
    When ฉันส่งคำขอ GET ไปที่ "/api/orders"
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And ต้องมี "data.orders" ที่เป็น array
      And แต่ละคำสั่งซื้อต้องมี: id, status, totalAmount, createdAt, items
      And แสดงเฉพาะคำสั่งซื้อของฉันเท่านั้น

  # ----------------------------------------
  # Test Case: ORD-004
  # ----------------------------------------
  Scenario: ดูรายละเอียดคำสั่งซื้อ (Get Order by ID)
    Given ฉันมีคำสั่งซื้อที่มี ID "order-123"
    When ฉันส่งคำขอ GET ไปที่ "/api/orders/order-123"
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And ข้อมูลคำสั่งซื้อต้องมีรายละเอียดครบถ้วน:
        | field         | ต้องมี |
        | id            | ✓     |
        | status        | ✓     |
        | paymentStatus | ✓     |
        | subtotal      | ✓     |
        | totalAmount   | ✓     |
        | items         | ✓     |
        | createdAt     | ✓     |

  # ----------------------------------------
  # Test Case: ORD-005
  # ----------------------------------------
  Scenario: ดูคำสั่งซื้อของผู้ใช้อื่น (Access Other User's Order)
    Given มีคำสั่งซื้อของผู้ใช้อีเมล "other@test.com"
    And ฉันเข้าสู่ระบบด้วย "customer@test.com"
    When ฉันพยายามดูคำสั่งซื้อของ "other@test.com"
    Then ระบบตอบกลับด้วยสถานะ 403 (Forbidden)
      Or สถานะ 404 (Not Found)
      And ฉันไม่สามารถเห็นข้อมูลคำสั่งซื้อของผู้อื่น
```

---

## 🇬🇧 English

```gherkin
Feature: Order Management
  As a logged-in customer
  I want to create orders and view my order history
  So that I can track my purchase status

  Background:
    Given I am logged in as "customer@test.com"
    And I have the following items in my cart:
      | product    | quantity | unitPrice |
      | Gadget 1   | 2        | 1040      |
      | Fashion 1  | 1        | 420       |
    And the cart subtotal is 2500

  # ----------------------------------------
  # Test Case: ORD-001
  # ----------------------------------------
  Scenario: Create order successfully
    Given I have items in my cart
    When I send a POST request to "/api/orders" with:
      | field            | value                      |
      | shippingAddress  | 123 Sukhumvit, Bangkok     |
      | paymentMethod    | credit_card                |
    Then the system responds with status 201 (Created)
      And a new order should be created
      And the order status should be "PENDING"
      And the order should contain all cart items
      And the order total should be 2500
      And the cart should be cleared or updated

  # ----------------------------------------
  # Test Case: ORD-002
  # ----------------------------------------
  Scenario: Create order with empty cart
    Given my cart is empty
    When I send a POST request to "/api/orders"
    Then the system responds with status 400 (Bad Request)
      And the error message should indicate cart is empty

  # ----------------------------------------
  # Test Case: ORD-003
  # ----------------------------------------
  Scenario: Get my order list
    Given I have at least 1 order in the system
    When I send a GET request to "/api/orders"
    Then the system responds with status 200 (OK)
      And the response should contain "data.orders" as an array
      And each order should have: id, status, totalAmount, createdAt, items
      And only my orders should be displayed

  # ----------------------------------------
  # Test Case: ORD-004
  # ----------------------------------------
  Scenario: Get order details by ID
    Given I have an order with ID "order-123"
    When I send a GET request to "/api/orders/order-123"
    Then the system responds with status 200 (OK)
      And the order data should contain complete details:
        | field         | required |
        | id            | ✓       |
        | status        | ✓       |
        | paymentStatus | ✓       |
        | subtotal      | ✓       |
        | totalAmount   | ✓       |
        | items         | ✓       |
        | createdAt     | ✓       |

  # ----------------------------------------
  # Test Case: ORD-005
  # ----------------------------------------
  Scenario: Access another user's order
    Given there is an order belonging to "other@test.com"
    And I am logged in as "customer@test.com"
    When I try to view the order of "other@test.com"
    Then the system responds with status 403 (Forbidden)
      Or status 404 (Not Found)
      And I should not be able to see other users' order details
```

---

# 5️⃣ Feature: Payment (ระบบชำระเงิน)

---

## 🇹🇭 ภาษาไทย

```gherkin
Feature: ระบบชำระเงิน (Payment Processing)
  ในฐานะลูกค้าที่สร้างคำสั่งซื้อแล้ว
  ฉันต้องการชำระเงินสำหรับคำสั่งซื้อ
  เพื่อให้คำสั่งซื้อได้รับการดำเนินการ

  Background:
    Given ฉันเข้าสู่ระบบแล้ว
    And ฉันมีคำสั่งซื้อที่มีสถานะ "PENDING" และยอด 2500 บาท

  # ----------------------------------------
  # Test Case: PAY-001
  # ----------------------------------------
  Scenario: สร้าง Payment Intent สำเร็จ (Create Payment Intent)
    Given ฉันมีคำสั่งซื้อที่รอการชำระเงิน
    When ฉันส่งคำขอ POST ไปที่ "/api/payments/intent" พร้อม orderId
    Then ระบบตอบกลับด้วยสถานะ 200 (OK)
      And ต้องมี "data.clientSecret" สำหรับใช้กับ Stripe
      And clientSecret ต้องไม่เป็นค่าว่าง

  # ----------------------------------------
  # Test Case: PAY-002
  # ----------------------------------------
  Scenario: ชำระเงินสำเร็จ (Payment Success Webhook)
    Given ฉันได้สร้าง Payment Intent แล้ว
    When Stripe ส่ง webhook แจ้งว่าการชำระเงินสำเร็จ
    Then สถานะคำสั่งซื้อต้องเปลี่ยนเป็น "PAID"
      And paymentStatus ต้องเป็น "COMPLETED"
      And ส่งอีเมลยืนยันการชำระเงินให้ลูกค้า

  # ----------------------------------------
  # Test Case: PAY-003
  # ----------------------------------------
  Scenario: ชำระเงินล้มเหลว (Payment Failed)
    Given ฉันได้สร้าง Payment Intent แล้ว
    When Stripe ส่ง webhook แจ้งว่าการชำระเงินล้มเหลว
    Then สถานะคำสั่งซื้อต้องยังคงเป็น "PENDING"
      And ต้องมีบันทึกเหตุผลที่ชำระเงินล้มเหลว
      And ลูกค้าสามารถลองชำระเงินใหม่ได้
```

---

## 🇬🇧 English

```gherkin
Feature: Payment Processing
  As a customer who created an order
  I want to pay for my order
  So that my order can be processed

  Background:
    Given I am logged in
    And I have an order with status "PENDING" and amount 2500

  # ----------------------------------------
  # Test Case: PAY-001
  # ----------------------------------------
  Scenario: Create payment intent successfully
    Given I have an order awaiting payment
    When I send a POST request to "/api/payments/intent" with orderId
    Then the system responds with status 200 (OK)
      And the response should contain "data.clientSecret" for Stripe
      And the clientSecret should not be empty

  # ----------------------------------------
  # Test Case: PAY-002
  # ----------------------------------------
  Scenario: Payment success webhook
    Given I have created a payment intent
    When Stripe sends a webhook notifying payment success
    Then the order status should change to "PAID"
      And the paymentStatus should be "COMPLETED"
      And a payment confirmation email should be sent to the customer

  # ----------------------------------------
  # Test Case: PAY-003
  # ----------------------------------------
  Scenario: Payment failed webhook
    Given I have created a payment intent
    When Stripe sends a webhook notifying payment failure
    Then the order status should remain "PENDING"
      And the failure reason should be recorded
      And the customer should be able to retry payment
```

---

# 📊 Summary: Test Case Coverage

## จำนวน Test Cases ทั้งหมด

| Feature | จำนวน TC (ไทย) | จำนวน TC (EN) | รวม |
|---------|----------------|---------------|-----|
| Authentication | 7 | 7 | 14 |
| Products | 4 | 4 | 8 |
| Cart | 7 | 7 | 14 |
| Orders | 5 | 5 | 10 |
| Payment | 3 | 3 | 6 |
| **รวมทั้งหมด** | **26** | **26** | **52** |

---

## 🎯 Priority Distribution

| Priority | จำนวน | Test Cases |
|----------|-------|------------|
| **High** | 18 | AUTH-001~007, CART-001~007, ORD-001~005 |
| **Medium** | 12 | PROD-001~004, PAY-001~003 |

---

## 🔄 การใช้งาน

### 1. สำหรับ Manual Testing
- พิมพ์ออกมาเป็น Checklist
- ทดสอบตามลำดับ Feature
- ติ๊ก ✓ เมื่อผ่าน

### 2. สำหรับ Automated Testing (Postman)
- แปลงเป็น Test Script ตาม Learning Guide
- ใช้ Scenario เป็น Test Name
- ใช้ Then เป็น Assertions

### 3. สำหรับ Documentation
- แสดงให้ลูกค้าดู Scope การทดสอบ
- ใช้อ้างอิง Requirement
- ใช้ Training ทีม QA

---

*สร้างโดย: เสี่ยวทู่ 🐰*
*สำหรับ: TestShop E-Commerce MVP*
*รวม: 52 Test Cases (ไทย 26 + English 26)*
*Version: 1.0 | 2026-02-23*
