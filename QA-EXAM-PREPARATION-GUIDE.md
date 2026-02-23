# 📚 บทเรียน QA Engineer - เตรียมสอบ (จาก roadmap.sh)

> สรุปเนื้อหาสำคัญสำหรับสอบ QA/Tester ตามแผนการเรียนรู้ roadmap.sh

---

## 🎯 สารบัญ

1. [พื้นฐานการทดสอบ (Testing Basics)](#1-พื้นฐานการทดสอบ)
2. [การทดสอบด้วยมือ (Manual Testing)](#2-การทดสอบด้วยมือ)
3. [การทดสอบอัตโนมัติ (Automation Testing)](#3-การทดสอบอัตโนมัติ)
4. [API Testing](#4-api-testing)
5. [Performance Testing](#5-performance-testing)
6. [Security Testing](#6-security-testing)
7. [CI/CD & DevOps](#7-cicd--devops)
8. [แบบฝึกหัดเตรียมสอบ](#8-แบบฝึกหัดเตรียมสอบ)

---

## 1. พื้นฐานการทดสอบ

### 1.1 ความหมายของ QA vs QC vs Testing

| คำศัพท์ | ความหมาย | เน้นที่ |
|---------|----------|---------|
| **QA (Quality Assurance)** | กระบวนการป้องกันข้อบกพร่อง | Process-focused |
| **QC (Quality Control)** | การตรวจสอบผลิตภัณฑ์ | Product-focused |
| **Testing** | กิจกรรมหาข้อบกพร่อง | Activity |

### 1.2 ประเภทของ Testing

```
Testing Types
├── Functional Testing
│   ├── Unit Testing
│   ├── Integration Testing
│   ├── System Testing
│   └── Acceptance Testing (UAT)
│
├── Non-Functional Testing
│   ├── Performance Testing
│   ├── Security Testing
│   ├── Usability Testing
│   └── Compatibility Testing
│
└── Testing Levels
    ├── Unit (Developer)
    ├── Integration
    ├── System
    └── Acceptance
```

### 1.3 SDLC vs STLC

**SDLC (Software Development Life Cycle):**
```
Requirements → Design → Development → Testing → Deployment → Maintenance
```

**STLC (Software Testing Life Cycle):**
```
Test Planning → Test Analysis → Test Design → Test Implementation → Test Execution → Test Closure
```

### 1.4 Test Artifacts (เอกสารการทดสอบ)

| เอกสาร | ใช้ทำอะไร |
|--------|-----------|
| **Test Plan** | แผนการทดสอบโดยรวม |
| **Test Case** | ขั้นตอนการทดสอบแต่ละ case |
| **Test Script** | สคริปต์สำหรับ automation |
| **Test Data** | ข้อมูลสำหรับทดสอบ |
| **Bug Report** | รายงานข้อบกพร่อง |
| **Test Summary Report** | สรุปผลการทดสอบ |

### 1.5 Test Case เขียนยังไง?

**Template:**
```
Test Case ID: TC001
Title: Login with valid credentials
Precondition: User has registered account
Steps:
  1. Open login page
  2. Enter valid username
  3. Enter valid password
  4. Click Login button
Expected Result: User redirected to dashboard
Actual Result: (to be filled)
Status: Pass/Fail
Priority: High/Medium/Low
```

---

## 2. การทดสอบด้วยมือ

### 2.1 Functional Testing

**คืออะไร:** ทดสอบว่าฟีเจอร์ทำงานตาม requirement หรือไม่

**ตัวอย่าง:**
- Login form ทำงานถูกต้อง
- Add to cart เพิ่มสินค้าได้
- Checkout process สมบูรณ์

### 2.2 Exploratory Testing

**คืออะไร:** ทดสอบแบบสำรวจ ไม่ต้องเขียน test case ล่วงหน้า

**เทคนิค:**
- ลองใช้งานเหมือน user จริง
- ลองทำในสิ่งที่ user ไม่ควรทำ
- ลองหาวิธีแปลกๆ ให้ระบบพัง

### 2.3 Regression Testing

**คืออะไร:** ทดสอบว่าการแก้ไขใหม่ไม่ทำให้ของเก่าพัง

**วิธีทำ:**
- รัน test case เก่าทั้งหมด
- Focus บนส่วนที่เกี่ยวข้องกับการแก้ไข
- Automated regression ถ้ามี

### 2.4 Bug Life Cycle

```
New → Assigned → Open → Fixed → Retest → Verified → Closed
         ↑                              ↓
       Rejected                    Reopen
```

| Status | ความหมาย |
|--------|----------|
| **New** | เพิ่งพบ bug |
| **Assigned** | มอบหมายให้ dev |
| **Open** | Dev กำลังแก้ |
| **Fixed** | แก้แล้ว รอ test |
| **Retest** | QA กำลังเทส |
| **Verified** | ยืนยันว่าถูกต้อง |
| **Closed** | ปิด case |

---

## 3. การทดสอบอัตโนมัติ

### 3.1 เครื่องมือยอดนิยม

| เครื่องมือ | ใช้สำหรับ | ภาษา |
|-----------|----------|------|
| **Selenium** | Web Automation | Java, Python, C# |
| **Cypress** | Modern Web Testing | JavaScript |
| **Playwright** | Cross-browser | JavaScript, Python |
| **Appium** | Mobile Testing | Multiple |
| **TestNG/JUnit** | Unit Testing | Java |
| **PyTest** | Python Testing | Python |

### 3.2 Selenium WebDriver

**Basic Script (Python):**
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

# Open browser
driver = webdriver.Chrome()
driver.get("https://example.com")

# Find element and interact
element = driver.find_element(By.ID, "username")
element.send_keys("testuser")

# Click button
driver.find_element(By.ID, "login-btn").click()

# Verify
title = driver.title
assert "Dashboard" in title

# Close
driver.quit()
```

**Locators:**
- `By.ID` - หาโดย ID (ดีที่สุด)
- `By.NAME` - หาโดย name
- `By.CLASS_NAME` - หาโดย class
- `By.TAG_NAME` - หาโดย tag
- `By.XPATH` - ใช้ XPath
- `By.CSS_SELECTOR` - ใช้ CSS

### 3.3 Page Object Model (POM)

**แนวคิด:** แยก UI elements ออกจาก test logic

```python
# Page Object
class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.username = (By.ID, "username")
        self.password = (By.ID, "password")
        self.login_btn = (By.ID, "login")
    
    def login(self, user, pwd):
        self.driver.find_element(*self.username).send_keys(user)
        self.driver.find_element(*self.password).send_keys(pwd)
        self.driver.find_element(*self.login_btn).click()

# Test
class TestLogin:
    def test_valid_login(self):
        login_page = LoginPage(driver)
        login_page.login("user", "pass")
        assert "Dashboard" in driver.title
```

---

## 4. API Testing

### 4.1 REST API Basics

**HTTP Methods:**
- **GET** - อ่านข้อมูล
- **POST** - สร้างข้อมูลใหม่
- **PUT** - อัปเดตข้อมูล (แทนที่ทั้งหมด)
- **PATCH** - อัปเดตบาง field
- **DELETE** - ลบข้อมูล

**HTTP Status Codes:**
| Code | ความหมาย |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### 4.2 Postman ใช้ยังไง?

**ขั้นตอน:**
1. สร้าง Collection
2. สร้าง Request (GET/POST/PUT/DELETE)
3. ใส่ URL
4. ใส่ Headers (ถ้ามี)
5. ใส่ Body (สำหรับ POST/PUT)
6. กด Send
7. ดู Response

**Pre-request Script:**
```javascript
// ตั้งค่า environment variable
pm.environment.set("timestamp", new Date().toISOString());
```

**Tests:**
```javascript
// Verify status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Verify response body
pm.test("Response has name", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("name");
});
```

### 4.3 API Automation with RestAssured

**Java Example:**
```java
import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;

@Test
public void testGetUser() {
    given()
        .baseUri("https://api.example.com")
        .header("Authorization", "Bearer token")
    .when()
        .get("/users/1")
    .then()
        .statusCode(200)
        .body("name", equalTo("John"))
        .body("email", containsString("@"));
}
```

---

## 5. Performance Testing

### 5.1 Types of Performance Testing

| ประเภท | จุดประสงค์ |
|--------|-----------|
| **Load Testing** | ทดสอบว่ารับ load ปกติได้ไหม |
| **Stress Testing** | หาจุดที่ระบบพัง |
| **Spike Testing** | ทดสอบ traffic กระทันหัน |
| **Endurance Testing** | ทดสอบระยะยาว |

### 5.2 JMeter Basics

**Components:**
- **Thread Group** - กำหนดจำนวน user
- **HTTP Request** - กำหนด request
- **Listeners** - ดูผลลัพธ์

**ขั้นตอน:**
1. สร้าง Test Plan
2. เพิ่ม Thread Group (จำนวน user, ramp-up, duration)
3. เพิ่ม HTTP Request
4. เพิ่ม Listener (View Results Tree, Summary Report)
5. Run Test

### 5.3 Metrics ที่ต้องรู้

| Metric | คืออะไร | ค่าที่ดี |
|--------|---------|----------|
| **Response Time** | เวลาตอบสนอง | < 2 วินาที |
| **Throughput** | จำนวน request/วินาที | สูง |
| **Error Rate** | อัตรา error | < 1% |
| **CPU Usage** | การใช้ CPU | < 80% |
| **Memory Usage** | การใช้ Memory | < 80% |

---

## 6. Security Testing

### 6.1 OWASP Top 10 (2021)

| ลำดับ | ชื่อ | คำอธิบาย |
|-------|------|---------|
| A01 | Broken Access Control | ควบคุมการเข้าถึงพัง |
| A02 | Cryptographic Failures | การเข้ารหัสผิดพลาด |
| A03 | Injection | SQL Injection, XSS |
| A04 | Insecure Design | ออกแบบไม่ปลอดภัย |
| A05 | Security Misconfiguration | ตั้งค่าผิด |
| A06 | Vulnerable Components | ใช้ library ที่มีช่องโหว่ |
| A07 | Auth Failures | การยืนยันตัวตนพัง |
| A08 | Data Integrity Failures | ข้อมูลไม่สมบูรณ์ |
| A09 | Logging Failures | ไม่มี log ความปลอดภัย |
| A10 | SSRF | Server-Side Request Forgery |

### 6.2 SQL Injection

**คืออะไร:** แทรก SQL code เข้าไปใน input

**ตัวอย่าง:**
```sql
-- ปกติ
SELECT * FROM users WHERE username = 'john' AND password = '123';

-- ถูกโจมตี
SELECT * FROM users WHERE username = '' OR '1'='1' --' AND password = '';
```

**การป้องกัน:**
- Use parameterized queries
- Input validation
- ORM frameworks

### 6.3 XSS (Cross-Site Scripting)

**คืออะไร:** แทรก JavaScript เข้าไปในเว็บ

**ตัวอย่าง:**
```html
<!-- ปกติ -->
<input value="user input">

<!-- ถูกโจมตี -->
<input value=""><script>alert('hacked')</script>
```

**การป้องกัน:**
- Output encoding
- Content Security Policy (CSP)
- Input validation

---

## 7. CI/CD & DevOps

### 7.1 Continuous Integration / Continuous Deployment

```
Developer → Commit → Build → Test → Deploy
                ↑___________________|
                      (Automated)
```

### 7.2 Jenkins Pipeline

**Jenkinsfile:**
```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'deploy script'
            }
        }
    }
}
```

### 7.3 GitHub Actions

```yaml
name: CI/CD Pipeline

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node
      uses: actions/setup-node@v2
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
```

---

## 8. แบบฝึกหัดเตรียมสอบ

### 8.1 คำถามทฤษฎี

**Q1: ความแตกต่างระหว่าง QA และ QC คืออะไร?**
```
ตอบ: QA เน้นกระบวนการป้องกันข้อบกพร่อง (Process-focused)
     QC เน้นการตรวจสอบผลิตภัณฑ์ (Product-focused)
```

**Q2: Test Case ประกอบด้วยอะไรบ้าง?**
```
ตอบ: Test Case ID, Title, Precondition, Steps, Expected Result,
     Actual Result, Status, Priority
```

**Q3: HTTP Status Code 200, 404, 500 หมายถึงอะไร?**
```
ตอบ: 200 = OK, 404 = Not Found, 500 = Internal Server Error
```

**Q4: ทำไมต้องใช้ Page Object Model?**
```
ตอบ: แยก UI elements ออกจาก test logic
     ทำให้ maintenance ง่าย, code reuse, อ่านง่าย
```

### 8.2 คำถามเขียนโค้ด

**Q: เขียน Selenium script สำหรับ login**
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://example.com/login")

# Find elements
driver.find_element(By.ID, "username").send_keys("testuser")
driver.find_element(By.ID, "password").send_keys("password123")
driver.find_element(By.ID, "login-btn").click()

# Verify
assert "Dashboard" in driver.title

driver.quit()
```

**Q: เขียน API test ด้วย Postman/RestAssured**
```java
@Test
public void testGetUser() {
    given()
        .baseUri("https://api.example.com")
    .when()
        .get("/users/1")
    .then()
        .statusCode(200)
        .body("id", equalTo(1));
}
```

### 8.3 Scenario-Based Questions

**Q: พบ Bug ที่ Production ต้องทำยังไง?**
```
1. รีบ report ทีม
2. ประเมินความรุนแรง
3. ถ้า Critical → Rollback หรือ Hotfix
4. Root Cause Analysis
5. เขียน Test Case ป้องกัน
6. Regression Test
```

**Q: มี Feature ใหม่ต้องส่งพรุ่งนี้ แต่ยัง test ไม่ครบ?**
```
1. ประเมิน Risk
2. Test ส่วนสำคัญก่อน (High Priority)
3. Exploratory Testing รวดเร็ว
4. คุยกับ Stakeholder
5. อาจต้อง Delay หรือ Release แบบ Beta
```

---

## 📝 เคล็ดลับการสอบ

1. **เข้าใจ concept** มากกว่าท่องจำ
2. **ฝึกเขียน code** บ่อยๆ
3. **ทำแบบฝึกหัด** จากโจทย์จริง
4. **อ่าน error message** ให้เป็น
5. **รู้ tools** ยอดนิยม (Selenium, Postman, Jira)

---

## 📚 Resources เพิ่มเติม

- [roadmap.sh/qa](https://roadmap.sh/qa) - แผนการเรียนรู้
- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [Postman Learning Center](https://learning.postman.com/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ISTQB Syllabus](https://www.istqb.org/)

---

สู้ๆ นะคะ! 🎓✨
