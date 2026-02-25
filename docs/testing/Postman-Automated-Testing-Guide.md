# 📘 คู่มือการใช้ Postman Scripts สำหรับ Automated Testing

## สารบัญ
1. [บทนำ](#บทนำ)
2. [การตั้งค่า Postman](#การตั้งค่า-postman)
3. [Postman Scripts เบื้องต้น](#postman-scripts-เบื้องต้น)
4. [Pre-request Scripts](#pre-request-scripts)
5. [Test Scripts](#test-scripts)
6. [การใช้ Variables](#การใช้-variables)
7. [Collection Runner](#collection-runner)
8. [Newman (CLI)](#newman-cli)
9. [ตัวอย่าง Use Cases](#ตัวอย่าง-use-cases)
10. [การ Integrate กับ CI/CD](#การ-integrate-กับ-cicd)

---

## บทนำ

Postman ไม่ได้เป็นเพียงเครื่องมือทดสอบ API ด้วยตนเอง แต่ยังมีความสามารถในการทำ **Automated Testing** ผ่านการเขียน Scripts ซึ่งช่วยให้สามารถ:

- ✅ ทดสอบ API อัตโนมัติ
- ✅ ตรวจสอบ Response แบบ Dynamic
- ✅ สร้าง Test Data อัตโนมัติ
- ✅ Chain Requests (เรียก API ต่อเนื่องกัน)
- ✅ Integrate กับ CI/CD Pipeline

---

## การตั้งค่า Postman

### 1. ติดตั้ง Postman
```bash
# ดาวน์โหลดจาก https://www.postman.com/downloads/
# หรือใช้ Web Version
```

### 2. สร้าง Workspace
```
File → New → Workspace → ตั้งชื่อ (เช่น "Automated Testing")
```

### 3. สร้าง Collection
```
Collections → New Collection → ตั้งชื่อ (เช่น "API Test Suite")
```

---

## Postman Scripts เบื้องต้น

Postman ใช้ **JavaScript** สำหรับเขียน Scripts มี 2 จุดหลักที่สามารถเขียน Script ได้:

### 📍 Pre-request Script
- ทำงาน **ก่อน**ส่ง Request
- ใช้สำหรับ: เตรียมข้อมูล, สร้าง Token, ตั้งค่า Variables

### 📍 Tests Script
- ทำงาน **หลัง**ได้รับ Response
- ใช้สำหรับ: ตรวจสอบ Response, Assert ค่า, บันทึกข้อมูล

---

## Pre-request Scripts

### ตัวอย่างที่ 1: สร้าง Timestamp
```javascript
// สร้าง timestamp ปัจจุบัน
const timestamp = new Date().toISOString();
pm.environment.set("current_timestamp", timestamp);
```

### ตัวอย่างที่ 2: สร้าง Random Data
```javascript
// สร้างอีเมลแบบสุ่ม
const random = Math.random().toString(36).substring(7);
const email = `test_${random}@example.com`;
pm.environment.set("random_email", email);

// สร้าง UUID
const uuid = require('uuid');
pm.environment.set("user_id", uuid.v4());
```

### ตัวอย่างที่ 3: คำนวนค่า HMAC
```javascript
// สร้าง signature สำหรับ API ที่ต้องการ authentication
const crypto = require('crypto-js');

const secret = pm.environment.get("api_secret");
const timestamp = new Date().toISOString();
const data = `GET/api/v1/users${timestamp}`;

const signature = crypto.HmacSHA256(data, secret).toString();
pm.environment.set("signature", signature);
pm.environment.set("timestamp", timestamp);
```

### ตัวอย่างที่ 4: ตั้งค่า Dynamic Headers
```javascript
// ตั้งค่า Headers อัตโนมัติ
pm.request.headers.add({
    key: 'X-Request-ID',
    value: pm.variables.replaceIn('{{$guid}}')
});

pm.request.headers.add({
    key: 'X-Timestamp',
    value: new Date().toISOString()
});
```

---

## Test Scripts

### 📌 Basic Assertions

```javascript
// 1. ตรวจสอบ Status Code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 2. ตรวจสอบ Response Time
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// 3. ตรวจสอบ Content-Type
pm.test("Content-Type is JSON", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

### 📌 JSON Response Validation

```javascript
const responseJson = pm.response.json();

// ตรวจสอบโครงสร้าง JSON
pm.test("Validate response structure", function () {
    pm.expect(responseJson).to.have.property("id");
    pm.expect(responseJson).to.have.property("name");
    pm.expect(responseJson).to.have.property("email");
    pm.expect(responseJson).to.have.property("status");
});

// ตรวจสอบค่าข้อมูล
pm.test("Validate user data", function () {
    pm.expect(responseJson.name).to.be.a('string');
    pm.expect(responseJson.name).to.have.lengthOf.above(0);
    pm.expect(responseJson.email).to.include('@');
    pm.expect(responseJson.status).to.be.oneOf(['active', 'inactive', 'pending']);
});

// ตรวจสอบ Array
pm.test("Validate users array", function () {
    pm.expect(responseJson.users).to.be.an('array');
    pm.expect(responseJson.users).to.have.lengthOf.at.least(1);
    
    // ตรวจสอบแต่ละ item ใน array
    responseJson.users.forEach(user => {
        pm.expect(user).to.have.property('id');
        pm.expect(user).to.have.property('name');
    });
});
```

### 📌 Schema Validation

```javascript
// กำหนด JSON Schema
const schema = {
    "type": "object",
    "required": ["id", "name", "email", "status"],
    "properties": {
        "id": { "type": "number" },
        "name": { "type": "string", "minLength": 1 },
        "email": { "type": "string", "format": "email" },
        "status": { 
            "type": "string", 
            "enum": ["active", "inactive", "pending"] 
        },
        "metadata": {
            "type": "object",
            "properties": {
                "created_at": { "type": "string" },
                "updated_at": { "type": "string" }
            }
        }
    }
};

// ตรวจสอบ Schema
pm.test("Validate JSON Schema", function () {
    pm.response.to.have.jsonSchema(schema);
});
```

### 📌 Chaining Requests (ส่งค่าไป Request ถัดไป)

```javascript
// บันทึกค่าจาก Response เพื่อใช้ใน Request ถัดไป
const responseJson = pm.response.json();

// บันทึก Token
pm.environment.set("auth_token", responseJson.token);

// บันทึก User ID
pm.environment.set("user_id", responseJson.user.id);

// บันทึก Refresh Token
pm.environment.set("refresh_token", responseJson.refresh_token);
```

---

## การใช้ Variables

### Variable Scopes
```
1. Global    : ใช้ได้ทุกที่ ทุก Collection  ({{$global}})
2. Collection: ใช้ได้เฉพาะ Collection นั้น  ({{$collection}})
3. Environment: ใช้ได้เมื่อเลือก Environment นั้น ({{base_url}})
4. Data      : จาก Data File ตอนรัน Collection ({{username}})
5. Local     : ใช้ได้เฉพาะ Request นั้น
```

### การเข้าถึง Variables

```javascript
// อ่านค่า Variable
const baseUrl = pm.environment.get("base_url");
const token = pm.globals.get("auth_token");
const localVar = pm.variables.get("local_var"); // หา variable จากทุก scope

// ตั้งค่า Variable
pm.environment.set("user_id", "12345");
pm.globals.set("api_key", "secret_key");

// ลบ Variable
pm.environment.unset("temp_var");

// ล้างทั้งหมดใน Environment
pm.environment.clear();
```

### Dynamic Variables

```javascript
// GUID (UUID v4)
{{$guid}}           // e.g., "611c2e81-2ccb-42d8-9ddc-2d0bfa65c1b4"

// Timestamp
{{$timestamp}}      // Unix timestamp
{{$isoTimestamp}}   // ISO 8601 format

// Random
{{$randomInt}}      // Random integer 0-1000
{{$randomUUID}}     // Random UUID

// ข้อมูลส่วนตัว (Fake Data)
{{$randomFirstName}}
{{$randomLastName}}
{{$randomEmail}}
{{$randomPhoneNumber}}
{{$randomCity}}
{{$randomCountry}}
{{$randomCompanyName}}
```

---

## Collection Runner

### การรัน Collection

```
1. เปิด Collection
2. คลิก "Run" (รูป play button)
3. เลือก Environment
4. เลือก Data File (ถ้ามี)
5. ตั้งค่า Iterations และ Delay
6. กด "Run"
```

### Iterations และ Data File

สร้างไฟล์ `test-data.json`:
```json
[
    {
        "username": "user1@test.com",
        "password": "pass123",
        "expected_status": "active"
    },
    {
        "username": "user2@test.com",
        "password": "pass456",
        "expected_status": "inactive"
    },
    {
        "username": "user3@test.com",
        "password": "pass789",
        "expected_status": "pending"
    }
]
```

ใช้ใน Pre-request Script:
```javascript
const username = pm.iterationData.get("username");
const password = pm.iterationData.get("password");
pm.environment.set("current_username", username);
```

ใช้ใน Tests:
```javascript
const expectedStatus = pm.iterationData.get("expected_status");
const responseJson = pm.response.json();

pm.test(`Status should be ${expectedStatus}`, function () {
    pm.expect(responseJson.status).to.eql(expectedStatus);
});
```

---

## Newman (CLI)

Newman เป็น command-line collection runner สำหรับ Postman

### ติดตั้ง Newman
```bash
# ติดตั้งผ่าน npm
npm install -g newman

# ติดตั้ง Reporter เพิ่มเติม
npm install -g newman-reporter-htmlextra
npm install -g newman-reporter-json
```

### รัน Collection ด้วย Newman
```bash
# รันแบบพื้นฐาน
newman run collection.json

# รันพร้อม Environment
newman run collection.json -e environment.json

# รันพร้อม Data File
newman run collection.json -d test-data.json

# รันพร้อม Global Variables
newman run collection.json -g globals.json

# รันหลาย Iterations
newman run collection.json -n 5

# ตั้งค่า Delay
newman run collection.json --delay-request 100
```

### ตัวอย่าง Command แบบเต็ม
```bash
newman run API-Test-Suite.json \
    -e Production.json \
    -d users-test-data.json \
    -r cli,htmlextra,json \
    --reporter-htmlextra-export ./reports/report.html \
    --reporter-json-export ./reports/report.json \
    -n 3 \
    --delay-request 200
```

### การ Export Collection และ Environment

```
# Export Collection
Collection → ... (three dots) → Export → Collection v2.1

# Export Environment
Environments → คลิก Environment ที่ต้องการ → ... → Export
```

---

## ตัวอย่าง Use Cases

### 📝 Use Case 1: User Registration Flow

```javascript
// Pre-request Script - Create Test Data
const timestamp = new Date().getTime();
const email = `test.user.${timestamp}@example.com`;
const password = "Test@123456";

pm.environment.set("test_email", email);
pm.environment.set("test_password", password);

console.log("Creating user with email:", email);
```

```javascript
// Tests - Validate Registration
pm.test("User registered successfully", function () {
    pm.response.to.have.status(201);
    
    const json = pm.response.json();
    pm.expect(json.message).to.eql("User created successfully");
    pm.expect(json.user).to.have.property("id");
    pm.expect(json.user.email).to.eql(pm.environment.get("test_email"));
});

// บันทึกค่าไว้ใช้ต่อ
const json = pm.response.json();
pm.environment.set("new_user_id", json.user.id);
```

---

### 📝 Use Case 2: Login และใช้ Token

**Request 1: Login**
```javascript
// Tests
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    
    const json = pm.response.json();
    pm.expect(json).to.have.property("token");
    pm.expect(json).to.have.property("refresh_token");
});

// บันทึก Token
const json = pm.response.json();
pm.environment.set("auth_token", json.token);
pm.environment.set("refresh_token", json.refresh_token);
```

**Request 2: Get User Profile (ใช้ Token)**
```javascript
// Pre-request Script - Set Authorization Header
const token = pm.environment.get("auth_token");
pm.request.headers.add({
    key: 'Authorization',
    value: `Bearer ${token}`
});
```

```javascript
// Tests
pm.test("Get profile successful", function () {
    pm.response.to.have.status(200);
});
```

---

### 📝 Use Case 3: API with Pagination

```javascript
// Tests - Validate Pagination
const json = pm.response.json();

pm.test("Response has pagination", function () {
    pm.expect(json).to.have.property("data");
    pm.expect(json).to.have.property("pagination");
    pm.expect(json.pagination).to.have.property("current_page");
    pm.expect(json.pagination).to.have.property("total_pages");
    pm.expect(json.pagination).to.have.property("total_items");
});

pm.test("Data is array", function () {
    pm.expect(json.data).to.be.an('array');
});

// ถ้ามีหน้าถัดไป ให้บันทึกไว้
if (json.pagination.current_page < json.pagination.total_pages) {
    const nextPage = json.pagination.current_page + 1;
    pm.environment.set("next_page", nextPage);
    console.log("Next page available:", nextPage);
}
```

---

### 📝 Use Case 4: Error Handling Test

```javascript
// Tests - Validate Error Response
pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
});

pm.test("Error response structure", function () {
    const json = pm.response.json();
    pm.expect(json).to.have.property("error");
    pm.expect(json).to.have.property("message");
    pm.expect(json).to.have.property("code");
});

pm.test("Error code is correct", function () {
    const json = pm.response.json();
    pm.expect(json.code).to.eql("INVALID_INPUT");
});
```

---

## การ Integrate กับ CI/CD

### GitHub Actions

สร้างไฟล์ `.github/workflows/postman-tests.yml`:

```yaml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    # รันทุกวันเวลา 9:00 AM
    - cron: '0 9 * * *'

jobs:
  postman-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Newman
      run: |
        npm install -g newman
        npm install -g newman-reporter-htmlextra
    
    - name: Run API Tests
      run: |
        newman run collections/API-Tests.json \
          -e environments/${{ github.ref_name }}.json \
          -r cli,htmlextra,json \
          --reporter-htmlextra-export reports/report.html \
          --reporter-json-export reports/report.json \
          --delay-request 100
    
    - name: Upload Test Results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-reports
        path: |
          reports/report.html
          reports/report.json
    
    - name: Post Results to Slack
      if: failure()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'API Tests Failed!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### GitLab CI

สร้างไฟล์ `.gitlab-ci.yml`:

```yaml
stages:
  - test

api_tests:
  stage: test
  image: postman/newman:alpine
  script:
    - newman run collections/API-Tests.json
        -e environments/$CI_ENVIRONMENT_NAME.json
        -r cli,junit,html
        --reporter-junit-export results.xml
        --reporter-html-export report.html
  artifacts:
    when: always
    reports:
      junit: results.xml
    paths:
      - report.html
  only:
    - merge_requests
    - main
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        NEWMAN_PATH = '/usr/local/bin/newman'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Newman') {
            steps {
                sh 'npm install -g newman newman-reporter-htmlextra'
            }
        }
        
        stage('Run API Tests') {
            steps {
                sh '''
                    ${NEWMAN_PATH} run collections/API-Tests.json \
                        -e environments/staging.json \
                        -r cli,htmlextra,junit \
                        --reporter-htmlextra-export newman/report.html \
                        --reporter-junit-export newman/results.xml
                '''
            }
        }
    }
    
    post {
        always {
            publishTestResults testResultsPattern: 'newman/results.xml'
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'newman',
                reportFiles: 'report.html',
                reportName: 'API Test Report'
            ])
        }
        failure {
            slackSend channel: '#devops', 
                     color: 'danger', 
                     message: "API Tests Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        }
    }
}
```

---

## Best Practices

### ✅ ควรทำ

1. **ใช้ Environment Variables** สำหรับค่าที่เปลี่ยนแปลง (URL, Keys)
2. **ตั้งชื่อ Test ให้ชัดเจน** - บอกว่ากำลังทดสอบอะไร
3. **ใช้ console.log()** เพื่อ Debug
4. **ตรวจสอบ Response Time** ไม่ใช่แค่ Status Code
5. **ใช้ Schema Validation** เพื่อตรวจสอบโครงสร้างข้อมูล
6. **จัดกลุ่ม Tests** ตาม Feature หรือ Module
7. **ใช้ Data Files** สำหรับ Data-driven testing

### ❌ ไม่ควรทำ

1. **Hard-code sensitive data** (passwords, tokens)
2. **ขึ้นอยู่กับลำดับ Request มากเกินไป**
3. **ไม่มี Error Handling**
4. **Test ซ้ำซ้อน** ในหลาย Request
5. **ใช้ Global Variables** มากเกินไป

---

## ตัวอย่าง Collection สมบูรณ์

ดูตัวอย่าง Collection ได้ที่: `collections/example-api-tests.json`

โครงสร้าง Collection ที่แนะนำ:
```
API Test Suite/
├── 🔐 Auth/
│   ├── POST Login
│   ├── POST Refresh Token
│   └── POST Logout
├── 👤 Users/
│   ├── GET List Users
│   ├── GET User Detail
│   ├── POST Create User
│   ├── PUT Update User
│   └── DELETE Delete User
├── 📦 Products/
│   ├── GET List Products
│   ├── GET Product Detail
│   ├── POST Create Product
│   ├── PUT Update Product
│   └── DELETE Delete Product
└── 📊 Reports/
    ├── GET Sales Report
    └── GET User Analytics
```

---

## แหล่งข้อมูลเพิ่มเติม

- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Postman Sandbox API Reference](https://learning.postman.com/docs/writing-scripts/script-references/postman-sandbox-api-reference/)
- [Chai Assertion Library](https://www.chaijs.com/api/bdd/)

---

**จัดทำโดย**: QA Team  
**อัพเดทล่าสุด**: 2026-02-25
