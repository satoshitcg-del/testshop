# Postman Automated Testing Guide
## คู่มือทำ Auto Test ด้วย Postman แบบมืออาชีพ

---

## 📋 สารบัญ

1. [โครงสร้าง Collection ที่ดี](#1-collection-structure)
2. [Environment Variables](#2-environment-variables)
3. [Pre-request Scripts](#3-pre-request-scripts)
4. [Tests & Assertions](#4-tests--assertions)
5. [Data Driven Testing](#5-data-driven-testing)
6. [Newman (CLI Runner)](#6-newman-cli-runner)
7. [CI/CD Integration](#7-cicd-integration)
8. [Best Practices](#8-best-practices)

---

## 1. Collection Structure

### 1.1 โครงสร้างแบบมืออาชีพ

```
TestShop API (Collection)
├── 📁 01 - Auth
│   ├── 01-01 Login
│   ├── 01-02 Register
│   └── 01-03 Logout
├── 📁 02 - Products
│   ├── 02-01 Get All Products
│   └── 02-02 Get Product by ID
├── 📁 03 - Cart
│   ├── 03-01 Get Cart
│   ├── 03-02 Add to Cart
│   └── 03-03 Remove from Cart
├── 📁 04 - Orders
│   ├── 04-01 Create Order
│   └── 04-02 Get Orders
└── 📁 99 - Cleanup (Run Last)
    └── 99-01 Cleanup Test Data
```

### 1.2 Naming Convention

| ส่วน | รูปแบบ | ตัวอย่าง |
|------|--------|---------|
| Folder | `XX - Feature Name` | `01 - Authentication` |
| Request | `XX-YY Action` | `01-01 Login Success` |
| Test Case | `[Feature]-[Scenario]` | `AUTH-001: Login with valid credentials` |

---

## 2. Environment Variables

### 2.1 Environment ที่ควรมี

| Environment | ใช้สำหรับ |
|-------------|----------|
| `Local` | http://localhost:3000 |
| `Dev` | https://dev-api.testshop.com |
| `Staging` | https://staging-api.testshop.com |
| `Production` | https://api.testshop.com |

### 2.2 Variables ที่ต้องมี

```javascript
// Base Configuration
base_url: http://localhost:3000
api_version: v1
timeout: 30000

// Auth Variables (Dynamic)
auth_token: {{generated_after_login}}
refresh_token: {{generated_after_login}}
user_id: {{generated_after_login}}

// Test Data (Static)
test_email: customer@test.com
test_password: password123
test_product_slug: gadget-1

// Dynamic IDs (Runtime)
product_id: {{saved_from_product_list}}
order_id: {{saved_from_create_order}}
cart_item_id: {{saved_from_add_cart}}
```

### 2.3 การใช้ Variables

```javascript
// ใน URL
GET {{base_url}}/api/products/{{product_id}}

// ใน Headers
Authorization: Bearer {{auth_token}}

// ใน Body
{
  "email": "{{test_email}}",
  "password": "{{test_password}}"
}
```

---

## 3. Pre-request Scripts

### 3.1 ใช้ทำอะไรได้บ้าง

- สร้าง dynamic data (timestamp, random string)
- คำนวณค่าก่อนส่ง
- เก็บค่าจาก environment
- ตรวจสอบ condition

### 3.2 ตัวอย่างที่ควรมี

```javascript
// 1. Generate Timestamp
pm.environment.set("timestamp", new Date().toISOString());

// 2. Generate Random Email
const random = Math.random().toString(36).substring(7);
pm.environment.set("random_email", `test_${random}@example.com`);

// 3. Set Unique Product Name
pm.environment.set("product_name", `Test Product ${Date.now()}`);

// 4. Dynamic Authorization (ถ้ามี token อยู่แล้ว)
const token = pm.environment.get("auth_token");
if (token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: `Bearer ${token}`
    });
}

// 5. Conditional Logic
const shouldSkip = pm.environment.get("skip_auth");
if (shouldSkip === "true") {
    pm.request.headers.add({
        key: 'x-skip-auth',
        value: 'true'
    });
}
```

---

## 4. Tests & Assertions

### 4.1 Basic Assertions (ทุก Request ต้องมี)

```javascript
// 1. Status Code Check
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 2. Response Time
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// 3. Content-Type
pm.test("Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

### 4.2 JSON Schema Validation

```javascript
// ตรวจสอบโครงสร้าง Response
pm.test("Response has correct structure", function () {
    const jsonData = pm.response.json();
    
    pm.expect(jsonData).to.have.property("success");
    pm.expect(jsonData).to.have.property("data");
    pm.expect(jsonData.success).to.be.true;
});

// ตรวจสอบ User Object
pm.test("User object has required fields", function () {
    const user = pm.response.json().data.user;
    
    pm.expect(user).to.have.all.keys("id", "email", "fullName", "role");
    pm.expect(user.email).to.be.a("string");
    pm.expect(user.id).to.match(/^[0-9a-f-]{36}$/); // UUID format
});
```

### 4.3 Dynamic Data Testing

```javascript
// สำหรับ API ที่ข้อมูลเปลี่ยนไปเรื่อยๆ
pm.test("Products array is not empty", function () {
    const products = pm.response.json().data.items;
    pm.expect(products).to.be.an("array").that.is.not.empty;
});

pm.test("Each product has valid price", function () {
    const products = pm.response.json().data.items;
    
    products.forEach(product => {
        pm.expect(product.price).to.be.a("number");
        pm.expect(product.price).to.be.above(0);
    });
});
```

### 4.4 Save Data for Next Request

```javascript
// เก็บ Token หลัง Login
pm.test("Save auth token", function () {
    const jsonData = pm.response.json();
    
    if (jsonData.data && jsonData.data.accessToken) {
        pm.environment.set("auth_token", jsonData.data.accessToken);
        pm.environment.set("user_id", jsonData.data.user.id);
        pm.environment.set("user_email", jsonData.data.user.email);
    }
});

// เก็บ Product ID สำหรับใช้ต่อ
pm.test("Save first product ID", function () {
    const products = pm.response.json().data.items;
    
    if (products && products.length > 0) {
        pm.environment.set("product_id", products[0].id);
        pm.environment.set("product_slug", products[0].slug);
        pm.environment.set("product_price", products[0].price);
    }
});

// เก็บ Order ID หลังสร้าง
pm.test("Save order ID", function () {
    const order = pm.response.json().data.order;
    
    if (order && order.id) {
        pm.environment.set("order_id", order.id);
        pm.environment.set("order_status", order.status);
    }
});
```

---

## 5. Data Driven Testing

### 5.1 CSV Data File

```csv
email,password,expected_status,description
customer@test.com,password123,200,Valid credentials
admin@test.com,password123,200,Admin login
invalid@test.com,wrongpass,401,Invalid password
notfound@test.com,password123,401,User not found
```

### 5.2 การใช้ใน Postman

```javascript
// Pre-request Script
pm.environment.set("test_email", pm.iterationData.get("email"));
pm.environment.set("test_password", pm.iterationData.get("password"));

// Request Body
{
  "email": "{{test_email}}",
  "password": "{{test_password}}"
}

// Tests
pm.test("Status matches expected", function () {
    const expectedStatus = parseInt(pm.iterationData.get("expected_status"));
    pm.response.to.have.status(expectedStatus);
});

pm.test("Test description: " + pm.iterationData.get("description"));
```

### 5.3 Runner Configuration

- Iterations: 4 (ตามจำนวน row ใน CSV)
- Delay: 100ms
- Data: เลือกไฟล์ CSV

---

## 6. Newman (CLI Runner)

### 6.1 ติดตั้ง Newman

```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

### 6.2 Export Collection & Environment

จาก Postman:
1. Collection → Export → Collection v2.1
2. Environment → Export

### 6.3 รันด้วย Newman

```bash
# Basic Run
newman run TestShop-API-Collection.json \
  -e environment.json

# With Reports
newman run TestShop-API-Collection.json \
  -e environment.json \
  -r cli,json,htmlextra \
  --reporter-json-export report.json \
  --reporter-htmlextra-export report.html

# With Data File
newman run TestShop-API-Collection.json \
  -e environment.json \
  -d test-data.csv \
  -n 4

# With Delay & Timeout
newman run TestShop-API-Collection.json \
  -e environment.json \
  --delay-request 100 \
  --timeout 30000
```

### 6.4 Newman + Docker

```bash
docker run -v $(pwd):/etc/newman postman/newman \
  run TestShop-API-Collection.json \
  -e environment.json
```

---

## 7. CI/CD Integration

### 7.1 GitHub Actions

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Newman
        run: npm install -g newman newman-reporter-htmlextra
      
      - name: Start Test Server
        run: |
          cd frontend
          npm install
          npx prisma migrate deploy
          npx prisma db seed
          npm run dev &
          sleep 10
      
      - name: Run API Tests
        run: |
          newman run TestShop-API-Collection.json \
            -e environment-local.json \
            -r cli,htmlextra,junit \
            --reporter-htmlextra-export test-results/report.html \
            --reporter-junit-export test-results/junit.xml
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

### 7.2 GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test

api_tests:
  stage: test
  image: postman/newman_alpine33
  script:
    - newman run TestShop-API-Collection.json
        -e environment.json
        -r cli,junit
        --reporter-junit-export results.xml
  artifacts:
    reports:
      junit: results.xml
    when: always
```

---

## 8. Best Practices

### 8.1 Collection Organization ✅

- [ ] ใช้ Folder จัดกลุ่มตาม Feature
- [ ] ตั้งชื่อ Request ให้สื่อความหมาย
- [ ] มี Request Description อธิบายว่าทำอะไร
- [ ] ใช้ Tags หรือ Prefix จำแนกประเภท

### 8.2 Test Coverage ✅

- [ ] Test Happy Path (กรณีปกติ)
- [ ] Test Error Cases (400, 401, 404, 500)
- [ ] Test Edge Cases (empty, null, special chars)
- [ ] Test Boundary Values (min/max)
- [ ] Test Performance (response time)

### 8.3 Documentation ✅

- [ ] แต่ละ Request มี Description
- [ ] บอกว่าต้องการ Permission อะไร
- [ ] ตัวอย่าง Request/Response
- [ ] อธิบาย Error Cases

### 8.4 Maintenance ✅

- [ ] ใช้ Variables ไม่ hard-code
- [ ] เก็บ Sensitive Data ใน Environment
- [ ] Version Control บน Git
- [ ] รีวิวและอัปเดตเมื่อ API เปลี่ยน

### 8.5 Reporting ✅

- [ ] ใช้ Newman สร้าง Report อัตโนมัติ
- [ ] เก็บประวัติ Test Results
- [ ] แจ้งเตือนเมื่อ Test Failed
- [ ] วิเคราะห์ Test Coverage

---

## 🎯 Quick Start Checklist

สำหรับ TestShop:

- [ ] Import Collection (`TestShop-API-Collection.json`)
- [ ] สร้าง Environment `Local` ด้วย `base_url: http://localhost:3000`
- [ ] รัน Login Request → เก็บ Token
- [ ] รัน Products Request → เก็บ Product ID
- [ ] รัน Cart/Orders Tests → ตรวจสอบผล
- [ ] Export Collection + Environment เก็บไว้
- [ ] Setup Newman สำหรับ Run อัตโนมัติ
- [ ] เชื่อม CI/CD (GitHub Actions/GitLab CI)

---

## 📚 Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://github.com/postmanlabs/newman)
- [Postman API Testing Best Practices](https://blog.postman.com/api-testing-tips/)

---

*สร้างโดย: เสี่ยวทู่ + ทีม (Codex & Gemini)*
*สำหรับ: TestShop E-Commerce MVP*
