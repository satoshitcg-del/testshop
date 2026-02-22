# คู่มือเรียนรู้: จาก Test Case ถึง Automated Test ด้วย Postman
## Learning Guide: TestShop E-Commerce API Testing

---

## 🎯 เป้าหมาย

หลังอ่านจบจะทำได้:
1. ✅ เขียน Test Case แบบมืออาชีพ
2. ✅ สร้าง Postman Collection
3. ✅ ใส่ Test Script ตรวจสอบผล
4. ✅ รันอัตโนมัติด้วย Newman
5. ✅ เชื่อม CI/CD (GitHub Actions)

---

## 📝 Phase 1: เขียน Test Case (ก่อนใช้ Postman)

### Step 1.1: วิเคราะห์ Requirement

**ตัวอย่าง: Feature Login**
```
Requirement:
- ผู้ใช้ต้องสามารถ login ด้วย email/password ได้
- ถ้า credentials ถูกต้อง → return token
- ถ้า credentials ผิด → return error 401
- response time ต้อง < 2 วินาที
```

### Step 1.2: เขียน Test Case ด้วยรูปแบบ Gherkin

```gherkin
Feature: User Login

Scenario: Login with valid credentials
  Given user has registered with email "customer@test.com" and password "password123"
  When user sends POST request to "/api/auth/login" with valid credentials
  Then response status should be 200
  And response should contain "accessToken"
  And response should contain user info (id, email, fullName, role)
  And response time should be less than 2000ms

Scenario: Login with invalid password
  Given user has registered with email "customer@test.com"
  When user sends POST request with wrong password
  Then response status should be 401
  And response should contain error message "Invalid email or password"
```

### Step 1.3: แปลงเป็น Test Case Table

| Test Case ID | Scenario | Input | Expected Output | Priority |
|--------------|----------|-------|-----------------|----------|
| AUTH-001 | Login success | email: customer@test.com<br>password: password123 | Status: 200<br>Has: token, user data | High |
| AUTH-002 | Login wrong password | email: customer@test.com<br>password: wrongpass | Status: 401<br>Error: Invalid credentials | High |
| AUTH-003 | Login user not found | email: notexist@test.com<br>password: password123 | Status: 401<br>Error: Invalid credentials | Medium |
| AUTH-004 | Login missing email | email: (empty)<br>password: password123 | Status: 400<br>Error: Missing credentials | Medium |

---

## 🛠️ Phase 2: สร้าง Postman Collection

### Step 2.1: สร้าง Collection ใหม่

```
1. เปิด Postman → Click "New" → "Collection"
2. ตั้งชื่อ: "TestShop API - Automated Tests"
3. ใส่ Description:
   "E-Commerce API Testing for TestShop MVP
   Base URL: http://localhost:3000
   Last Updated: 2026-02-23"
4. Save
```

### Step 2.2: สร้าง Folder Structure

```
📁 TestShop API - Automated Tests
├── 📁 01 - Auth
│   └── (จะใส่ Request ต่อไป)
├── 📁 02 - Products
├── 📁 03 - Cart
├── 📁 04 - Orders
└── 📁 05 - Cleanup
```

### Step 2.3: สร้าง Environment

```
1. Click "Environments" (sidebar ขวา)
2. Click "Create Environment"
3. ตั้งชื่อ: "TestShop - Local"
4. Add Variables:

   Variable          | Initial Value        | Current Value
   ------------------|----------------------|------------------
   base_url          | http://localhost:3000 | http://localhost:3000
   api_version       | v1                   | v1
   auth_token        | (empty)              | (empty)
   test_email        | customer@test.com    | customer@test.com
   test_password     | password123          | password123
   product_id        | (empty)              | (empty)
   order_id          | (empty)              | (empty)
   
5. Click "Save"
6. เปลี่ยน Environment ด้านขวาบนเป็น "TestShop - Local"
```

---

## 🔧 Phase 3: สร้าง Request พร้อม Test Script

### Step 3.1: Create Login Request

```
📍 สร้างใน Folder: 01 - Auth

Request Name: "01-01 Login Success"
Method: POST
URL: {{base_url}}/api/auth/login

Headers:
  Content-Type: application/json

Body (raw - JSON):
{
  "email": "{{test_email}}",
  "password": "{{test_password}}"
}
```

### Step 3.2: เพิ่ม Test Script (Tests Tab)

```javascript
// 1. Status Code Check
pm.test("[AUTH-001] Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 2. Response Time Check
pm.test("[AUTH-001] Response time is under 2 seconds", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// 3. Content-Type Check
pm.test("[AUTH-001] Content-Type is JSON", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// 4. JSON Structure Check
pm.test("[AUTH-001] Response has success=true", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.exist;
});

// 5. Token Existence Check
pm.test("[AUTH-001] Response contains accessToken", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.accessToken).to.exist;
    pm.expect(jsonData.data.accessToken).to.be.a("string");
});

// 6. User Data Check
pm.test("[AUTH-001] Response contains user data", function () {
    const user = pm.response.json().data.user;
    pm.expect(user).to.have.all.keys("id", "email", "fullName", "role");
    pm.expect(user.email).to.equal("customer@test.com");
});

// 7. SAVE TOKEN FOR NEXT REQUESTS (สำคัญ!)
pm.test("[AUTH-001] Save auth token to environment", function () {
    const jsonData = pm.response.json();
    const token = jsonData.data.accessToken;
    
    if (token) {
        pm.environment.set("auth_token", token);
        pm.environment.set("user_id", jsonData.data.user.id);
        console.log("✅ Token saved successfully");
    } else {
        console.error("❌ Token not found in response");
    }
});
```

### Step 3.3: ทดสอบรัน Request

```
1. กด "Send"
2. ดูผลลัพธ์:
   ✓ Response: 200 OK
   ✓ Body: {"success": true, "data": {...}}
   ✓ Test Results (ข้างล่าง): 7/7 passed
   ✓ Token ถูก save ลง Environment (ดูตรง Environment ด้านขวา)
```

---

## 🔗 Phase 4: สร้าง Request ที่ต้องใช้ Token

### Step 4.1: Create Get Cart Request

```
📍 สร้างใน Folder: 03 - Cart

Request Name: "03-01 Get Cart Items"
Method: GET
URL: {{base_url}}/api/cart/items

Headers:
  Authorization: Bearer {{auth_token}}
  Content-Type: application/json

⚠️ หมายเหตุ: ต้องรัน Login ก่อน เพื่อให้มี token
```

### Step 4.2: Test Script สำหรับ Cart

```javascript
// Check Authorization
pm.test("[CART-001] Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("[CART-001] Response contains cart data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property("items");
    pm.expect(jsonData.data).to.have.property("subtotal");
});

// Save cart ID if exists
pm.test("[CART-001] Save cart ID if available", function () {
    const jsonData = pm.response.json();
    if (jsonData.data.id) {
        pm.environment.set("cart_id", jsonData.data.id);
    }
});
```

### Step 4.3: Create Test for Unauthorized Access

```
Request Name: "03-02 Get Cart Without Auth"
Method: GET
URL: {{base_url}}/api/cart/items

// ไม่ใส่ Authorization Header

Tests:
pm.test("[CART-004] Should return 401 without token", function () {
    pm.response.to.have.status(401);
});
```

---

## 🔄 Phase 5: Collection Runner (Run Multiple Tests)

### Step 5.1: เตรียม Collection ให้พร้อม

```
ตรวจสอบลำดับ:
1. 01-01 Login Success (ต้องรันก่อน)
2. 02-01 Get Products
3. 03-01 Get Cart Items (ใช้ token จากข้อ 1)
4. 04-01 Create Order

⚠️ ลำดับสำคัญ! เพราะข้อหลังใช้ข้อมูลจากข้อก่อน
```

### Step 5.2: รันด้วย Collection Runner

```
1. Click "Runner" (บน collection)
2. เลือก Environment: "TestShop - Local"
3. Iterations: 1
4. Delay: 100 ms
5. Save responses: ✓ (สำหรับ debug)
6. Run Order: Drag & Drop จัดลำดับให้ถูก
7. Click "Run TestShop API..."
```

### Step 5.3: ดูผลลัพธ์

```
Runner Results:
├── 01 - Auth
│   └── 01-01 Login Success: ✓ (7/7 tests passed)
├── 02 - Products
│   └── 02-01 Get All Products: ✓ (5/5 tests passed)
├── 03 - Cart
│   └── 03-01 Get Cart Items: ✓ (3/3 tests passed)
└── 04 - Orders
    └── 04-01 Create Order: ✓ (4/4 tests passed)

Summary: 4/4 requests passed, 19/19 tests passed
```

---

## 📊 Phase 6: Data Driven Testing

### Step 6.1: สร้าง CSV File

```csv
email,password,expected_status,expected_error,test_case
 customer@test.com,password123,200,,AUTH-001-Valid
 customer@test.com,wrongpass,401,Invalid email or password,AUTH-002-WrongPass
 notfound@test.com,password123,401,Invalid email or password,AUTH-003-NotFound
 ,password123,400,Missing credentials,AUTH-004-EmptyEmail
```

Save เป็น: `login-test-data.csv`

### Step 6.2: แก้ไข Login Request

```javascript
// Pre-request Script (สำคัญ!)
pm.environment.set("test_email", pm.iterationData.get("email") || "customer@test.com");
pm.environment.set("test_password", pm.iterationData.get("password") || "password123");

// Tests (แก้ให้ใช้ dynamic data)
pm.test("[" + pm.iterationData.get("test_case") + "] Status is " + pm.iterationData.get("expected_status"), function () {
    const expectedStatus = parseInt(pm.iterationData.get("expected_status"));
    pm.response.to.have.status(expectedStatus);
});

if (pm.iterationData.get("expected_error")) {
    pm.test("[" + pm.iterationData.get("test_case") + "] Error message matches", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.error).to.include(pm.iterationData.get("expected_error"));
    });
}
```

### Step 6.3: รันด้วย Data File

```
Runner Configuration:
- Iterations: 4 (ตามจำนวน row ใน CSV)
- Data: เลือกไฟล์ login-test-data.csv
- Run!

ผลลัพธ์: จะรัน Login Test 4 ครั้ง ด้วยข้อมูลต่างกัน
```

---

## ⚡ Phase 7: Automated Test ด้วย Newman (CLI)

### Step 7.1: ติดตั้ง Newman

```bash
# ติดตั้ง Newman globally
npm install -g newman

# ติดตั้ง reporter สำหรับสร้าง HTML report
npm install -g newman-reporter-htmlextra

# ตรวจสอบว่าติดตั้งสำเร็จ
newman --version
```

### Step 7.2: Export Collection จาก Postman

```
1. ใน Postman → คลิก Collection (3 จุด) → Export
2. เลือก "Collection v2.1"
3. Save เป็น: TestShop-API-Collection.json

4. Export Environment ด้วย:
   → Environments → TestShop - Local → Export
   → Save เป็น: TestShop-Environment.json
```

### Step 7.3: รันด้วย Newman (Basic)

```bash
# Basic run
newman run TestShop-API-Collection.json \
  -e TestShop-Environment.json
```

### Step 7.4: รันพร้อม Report

```bash
# รันพร้อมสร้าง HTML Report
newman run TestShop-API-Collection.json \
  -e TestShop-Environment.json \
  -r cli,json,htmlextra \
  --reporter-json-export newman-report.json \
  --reporter-htmlextra-export newman-report.html \
  --delay-request 100

# ผลลัพธ์:
# - newman-report.json: ผลลัพธ์แบบ machine-readable
# - newman-report.html: รายงานสวยงาม ดูใน browser ได้
```

### Step 7.5: รันด้วย Data File (Data Driven)

```bash
newman run TestShop-API-Collection.json \
  -e TestShop-Environment.json \
  -d login-test-data.csv \
  -n 4 \
  -r cli,htmlextra
```

### Step 7.6: ดู HTML Report

```bash
# เปิด report ใน browser
start newman-report.html  # Windows
open newman-report.html   # Mac
xdg-open newman-report.html # Linux
```

---

## 🚀 Phase 8: CI/CD Integration (GitHub Actions)

### Step 8.1: สร้าง GitHub Actions Workflow

```yaml
# .github/workflows/api-tests.yml
name: 🧪 API Automated Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    # รันทุกวันเวลา 9:00 AM
    - cron: '0 9 * * *'

jobs:
  api-tests:
    name: Run Postman API Tests
    runs-on: ubuntu-latest
    
    steps:
      # Step 1: Checkout code
      - name: 📥 Checkout Repository
        uses: actions/checkout@v3
      
      # Step 2: Setup Node.js
      - name: ⚙️ Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Step 3: Install Newman
      - name: 📦 Install Newman
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra
      
      # Step 4: Setup Test Server
      - name: 🖥️ Start Test Server
        run: |
          cd frontend
          npm install
          npx prisma generate
          npx prisma migrate deploy
          npx prisma db seed
          npm run dev &
          sleep 10  # รอให้ server start
        env:
          DATABASE_URL: "file:./dev.db"
          JWT_SECRET: "test-secret"
      
      # Step 5: Run API Tests
      - name: 🧪 Run API Tests with Newman
        run: |
          newman run TestShop-API-Collection.json \
            -e TestShop-Environment.json \
            -r cli,htmlextra,junit \
            --reporter-htmlextra-export test-results/report.html \
            --reporter-junit-export test-results/junit.xml \
            --delay-request 100 \
            --timeout 30000
      
      # Step 6: Upload Test Results
      - name: 📊 Upload Test Results
        uses: actions/upload-artifact@v3
        if: always()  # อัปโหลดแม้ test fail
        with:
          name: api-test-results
          path: |
            test-results/
            newman/
      
      # Step 7: Comment PR with results
      - name: 💬 Comment PR
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('test-results/report.html', 'utf8');
            // สร้าง comment บน PR ด้วยผล test
```

### Step 8.2: Push ขึ้น GitHub

```bash
git add .github/workflows/api-tests.yml
git add TestShop-API-Collection.json
git add TestShop-Environment.json
git commit -m "Add automated API tests with GitHub Actions"
git push
```

### Step 8.3: ดูผลใน GitHub

```
1. ไปที่ Repository → Actions tab
2. เลือก workflow "🧪 API Automated Tests"
3. ดูผลการรันล่าสุด
4. Download Artifacts → ดู HTML Report
```

---

## ✅ Checklist: จาก 0 ถึง Automated Test

### Phase 1: Planning
- [ ] วิเคราะห์ Requirements
- [ ] เขียน Test Cases (Gherkin format)
- [ ] สร้าง Test Data

### Phase 2: Postman Setup
- [ ] สร้าง Collection
- [ ] สร้าง Folders ตาม Feature
- [ ] สร้าง Environment Variables

### Phase 3: Request Creation
- [ ] สร้าง Login Request
- [ ] เพิ่ม Test Scripts (Assertions)
- [ ] สร้าง Request ที่ต้องใช้ Token
- [ ] ใส่ Script Save Token

### Phase 4: Testing
- [ ] รัน Single Request ทดสอบ
- [ ] รัน Collection Runner
- [ ] ตรวจสอบ Test Results

### Phase 5: Data Driven
- [ ] สร้าง CSV Test Data
- [ ] แก้ Request ให้ใช้ Iteration Data
- [ ] รันด้วย Data File

### Phase 6: Newman CLI
- [ ] ติดตั้ง Newman
- [ ] Export Collection & Environment
- [ ] รันด้วย Newman
- [ ] สร้าง HTML Report

### Phase 7: CI/CD
- [ ] สร้าง GitHub Actions Workflow
- [ ] Push ขึ้น Repository
- [ ] ตรวจสอบ Actions Run
- [ ] Download Test Results

---

## 🎓 Learning Path Summary

```
เริ่มต้น
    ↓
เขียน Test Case (กระดาษ/Notion) 
    ↓
สร้าง Postman Collection
    ↓
ใส่ Test Scripts → รันเดี่ยว
    ↓
Collection Runner → รันเป็นชุด
    ↓
Data Driven Testing → CSV
    ↓
Newman CLI → Command Line
    ↓
GitHub Actions → Automated CI/CD
    ↓
🏆 API Testing Automation Complete!
```

---

## 💡 Tips & Tricks

### 1. Debug ง่าย ๆ
```javascript
// Console log ดูค่า
console.log("Token:", pm.environment.get("auth_token"));
console.log("Response:", pm.response.json());
```

### 2. Conditional Testing
```javascript
// ถ้า status 200 ถึงตรวจสอบ data
if (pm.response.code === 200) {
    pm.test("Has user data", function () {
        pm.expect(pm.response.json().data.user).to.exist;
    });
}
```

### 3. Retry Mechanism
```javascript
// ถ้า fail ให้ retry (ใน Pre-request Script)
let retryCount = pm.environment.get("retry_count") || 0;
if (retryCount < 3) {
    pm.environment.set("retry_count", parseInt(retryCount) + 1);
}
```

---

## 📚 Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://github.com/postmanlabs/newman)
- [GitHub Actions for Newman](https://github.com/marketplace/actions/newman-action)

---

*สร้างโดย: เสี่ยวทู่ 🐰*
*สำหรับ: TestShop E-Commerce MVP*
*Version: 1.0 | 2026-02-23*
