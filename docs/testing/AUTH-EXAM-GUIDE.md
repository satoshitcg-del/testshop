# 📝 แนวข้อสอบ Automation Postman: Auth Flow (Register & Login)

> **สำหรับ:** TestShop E-Commerce API  
> **ระดับ:** Beginner → Intermediate  
> **เวลา:** 60-90 นาที

---

## 📋 สารบัญ

1. [System Flow - ระบบทำงานยังไง](#1-system-flow)
2. [Server Flow - เซิร์ฟเวอร์ทำงานยังไง](#2-server-flow)
3. [โจทย์ข้อสอบ พร้อมเฉลย](#3-โจทย์ข้อสอบ)
4. [Postman Collection Structure](#4-postman-collection-structure)

---

## 1. System Flow

### 🔐 Authentication Flow ทั้งหมด

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (Postman)                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. REGISTER FLOW                                               │
│  ─────────────────                                              │
│                                                                 │
│  POST /api/auth/register                                        │
│  ├─ Body: {email, password, fullName}                          │
│  │                                                              │
│  │  ┌─────────────────────────────────────────────────────┐    │
│  │  │  SERVER VALIDATION                                │    │
│  │  │  • Check required fields (email, password, full)  │    │
│  │  │  • Check email ซ้ำในฐานข้อมูล                     │    │
│  │  │  • Hash password ด้วย bcrypt (salt rounds: 10)   │    │
│  │  │  • Create user ในตาราง users                      │    │
│  │  │  • Generate JWT token (expires: 7 days)          │    │
│  │  └─────────────────────────────────────────────────────┘    │
│  │                                                              │
│  └─ Response: {success, data: {user, accessToken, expiresIn}}  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. LOGIN FLOW                                                  │
│  ────────────────                                               │
│                                                                 │
│  POST /api/auth/login                                           │
│  ├─ Body: {email, password}                                    │
│  │                                                              │
│  │  ┌─────────────────────────────────────────────────────┐    │
│  │  │  SERVER VALIDATION                                │    │
│  │  │  • Check required fields (email, password)        │    │
│  │  │  • Find user by email                            │    │
│  │  │  • Compare password ด้วย bcrypt.compare()         │    │
│  │  │  • Generate JWT token                             │    │
│  │  └─────────────────────────────────────────────────────┘    │
│  │                                                              │
│  └─ Response: {success, data: {user, accessToken, expiresIn}}  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. AUTHENTICATED REQUESTS                                      │
│  ─────────────────────────                                      │
│                                                                 │
│  ใช้ Token ใน Header ต่อไปนี้:                                  │
│  Authorization: Bearer <accessToken>                           │
│                                                                 │
│  Endpoints ที่ต้องใช้ Token:                                    │
│  • GET    /api/user/profile                                    │
│  • PATCH  /api/user/profile                                    │
│  • GET    /api/cart/items                                      │
│  • POST   /api/cart/items                                      │
│  • GET    /api/orders                                          │
│  • POST   /api/orders                                          │
│  • POST   /api/orders/:id/cancel                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Server Flow

### 🖥️ โค้ดเซิร์ฟเวอร์ทำงานยังไง

#### 2.1 Register Endpoint (`/api/auth/register`)

```typescript
// Step 1: รับข้อมูลจาก Request
const body = await req.json();
const { email, password, fullName } = body || {};

// Step 2: Validate Required Fields
if (!email || !password || !fullName) {
  return Response({ success: false, error: "Missing fields" }, status: 400);
}

// Step 3: Check Email ซ้ำ
const exists = await prisma.user.findUnique({ where: { email } });
if (exists) {
  return Response({ success: false, error: "Email already exists" }, status: 409);
}

// Step 4: Hash Password
const passwordHash = await bcrypt.hash(password, 10);
// bcrypt ทำงาน: password + salt (10 rounds) → hash

// Step 5: Create User ในฐานข้อมูล
const user = await prisma.user.create({
  data: {
    email,
    passwordHash,
    fullName,
    role: "CUSTOMER",  // ค่า default
  },
});

// Step 6: Generate JWT Token
const accessToken = jwt.sign(
  { 
    id: user.id, 
    email: user.email, 
    role: user.role, 
    fullName: user.fullName 
  },
  JWT_SECRET,
  { expiresIn: "7d" }  // Token หมดอายุ 7 วัน
);

// Step 7: Return Response
return Response({
  success: true,
  data: {
    user: { id, email, fullName, role },
    accessToken,
    expiresIn: 3600,  // ❗ ค่านี้ไม่ตรงกับ JWT (bug?)
  }
});
```

#### 2.2 Login Endpoint (`/api/auth/login`)

```typescript
// Step 1: รับ Credentials
const { email, password } = body || {};

// Step 2: Validate
if (!email || !password) {
  return Response({ error: "Missing credentials" }, status: 400);
}

// Step 3: Find User
const user = await prisma.user.findUnique({ where: { email } });
if (!user) {
  // ❗ Security: ไม่บอกว่า email ไม่มี หรือ password ผิด
  return Response({ error: "Invalid email or password" }, status: 401);
}

// Step 4: Compare Password
const ok = await bcrypt.compare(password, user.passwordHash);
// bcrypt.compare(plaintext, hash) → true/false

if (!ok) {
  return Response({ error: "Invalid email or password" }, status: 401);
}

// Step 5: Generate JWT (เหมือน Register)
const accessToken = issueToken({...});

// Step 6: Return
return Response({ success: true, data: {...} });
```

#### 2.3 JWT Verification (สำหรับ Protected Routes)

```typescript
// Middleware ตรวจสอบ Token
function getUserFromRequest(req: Request): AuthUser | null {
  // ดึง header Authorization
  const auth = req.headers.get("authorization");
  
  // ตัดคำว่า "Bearer " ออก
  const token = auth?.replace("Bearer ", "");
  if (!token) return null;
  
  try {
    // Verify token ด้วย secret
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    // Token invalid หรือหมดอายุ
    return null;
  }
}

// ใช้ใน Protected Route
const user = getUserFromRequest(req);
if (!user) {
  return Response({ error: "Unauthorized" }, status: 401);
}
```

---

## 3. โจทย์ข้อสอบ

### 🎯 ข้อ 1: Basic Register Test (5 คะแนน)

**โจทย์:**  
สร้าง Postman request สำหรับสมัครสมาชิกใหม่ และตรวจสอบว่าได้รับ token กลับมา

**Test Script ที่ต้องเขียน:**
```javascript
// Tests tab ใน Postman
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success = true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Response has accessToken", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.accessToken).to.exist;
    // เก็บ token ไว้ใช้ต่อ
    pm.environment.set("accessToken", jsonData.data.accessToken);
});

pm.test("Response has user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.user).to.have.property("id");
    pm.expect(jsonData.data.user).to.have.property("email");
    pm.expect(jsonData.data.user).to.have.property("role", "CUSTOMER");
});
```

**สิ่งที่ต้องเช็ค:**
- ✅ Status code 200
- ✅ `success: true`
- ✅ มี `accessToken` ใน response
- ✅ มี `user` object ครบถ้วน
- ✅ `role` เป็น "CUSTOMER" (default)

---

### 🎯 ข้อ 2: Register Validation Tests (10 คะแนน)

**โจทย์:**  
ทดสอบ validation ของ Register API ทั้งหมด

**2.1 Missing Fields Test**
```javascript
// ส่ง request ไม่มี fullName
pm.test("Status code is 400 for missing fields", function () {
    pm.response.to.have.status(400);
});

pm.test("Error message indicates missing fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(false);
    pm.expect(jsonData.error).to.include("Missing");
});
```

**2.2 Duplicate Email Test**
```javascript
// สมัครด้วย email ที่มีอยู่แล้ว
pm.test("Status code is 409 for duplicate email", function () {
    pm.response.to.have.status(409);
});

pm.test("Error indicates email already exists", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(false);
    pm.expect(jsonData.error).to.include("already exists");
});
```

**2.3 Invalid Email Format Test**
```javascript
// ส่ง email ที่ไม่ใช่ format ถูกต้อง
pm.test("Status code is 400 or handles gracefully", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 400, 422]);
});
```

**สิ่งที่ต้องเช็ค:**
- ✅ Missing field → 400 Bad Request
- ✅ Duplicate email → 409 Conflict
- ✅ Response format ต้องเหมือนกันทุก case

---

### 🎯 ข้อ 3: Login Flow Test (10 คะแนน)

**โจทย์:**  
สร้าง Login test ที่ test ทั้ง success และ failure cases

**3.1 Successful Login**
```javascript
pm.test("Login successful - Status 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns valid token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.accessToken).to.be.a('string');
    pm.expect(jsonData.data.accessToken.split('.')).to.have.lengthOf(3); // JWT format
    pm.environment.set("accessToken", jsonData.data.accessToken);
});

pm.test("Token contains correct user info", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.user.email).to.eql(pm.environment.get("email"));
});
```

**3.2 Invalid Credentials**
```javascript
// Wrong password
pm.test("Invalid password returns 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Error message is generic (security)", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.error).to.eql("Invalid email or password");
    // ❗ ไม่ควรบอกว่า email ไม่มี หรือ password ผิด
});

// Non-existent user
pm.test("Non-existent user returns 401", function () {
    pm.response.to.have.status(401);
});
```

**สิ่งที่ต้องเช็ค:**
- ✅ Valid login → 200 + token
- ✅ Wrong password → 401
- ✅ Non-existent user → 401 (ไม่ใช่ 404 - security)
- ✅ Error message เหมือนกันทั้งสองกรณี

---

### 🎯 ข้อ 4: Token Usage Test (10 คะแนน)

**โจทย์:**  
ทดสอบการใช้ token เรียก Protected Endpoint

**4.1 Valid Token**
```javascript
// GET /api/user/profile with valid token
pm.test("Valid token returns user profile", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("email");
});
```

**4.2 Missing Token**
```javascript
// ไม่ส่ง Authorization header
pm.test("Missing token returns 401", function () {
    pm.response.to.have.status(401);
});
```

**4.3 Invalid Token**
```javascript
// ส่ง token ที่แก้ไขแล้ว
pm.test("Invalid token returns 401", function () {
    pm.response.to.have.status(401);
});
```

**4.4 Expired Token (Bonus)**
```javascript
// ต้องรอ token หมดอายุ หรือ forge expired token
// หรือ test ว่า token มี expiration
pm.test("Token has expiration", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.expiresIn).to.exist;
});
```

---

### 🎯 ข้อ 5: Complete User Journey (15 คะแนน)

**โจทย์:**  
สร้าง Collection ที่ test flow แบบ End-to-End:

```
Step 1: Register new user → เก็บ token
Step 2: Get profile → ใช้ token จากข้อ 1
Step 3: Login → ได้ token ใหม่
Step 4: Get profile → ใช้ token ใหม่
Step 5: Try to register with same email → ต้อง fail
```

**Pre-request Script สำหรับสร้าง unique data:**
```javascript
// สร้าง email ที่ไม่ซ้ำ
const timestamp = new Date().getTime();
const randomEmail = `test${timestamp}@example.com`;
pm.environment.set("randomEmail", randomEmail);
pm.environment.set("randomPassword", "TestPass123!");
pm.environment.set("randomName", `Test User ${timestamp}`);
```

**Post-response Script สำหรับ chain:**
```javascript
// ถ้า register สำเร็จ เก็บ token
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("userId", jsonData.data.user.id);
}
```

---

### 🎯 ข้อ 6: Data-Driven Testing (10 คะแนน)

**โจทย์:**  
ใช้ CSV/JSON เป็น test data สำหรับ test multiple cases

**CSV Data (`test-data.csv`):**
```csv
email,password,fullName,expected_status,description
"valid@test.com","Pass123!","Valid User",200,"Valid registration"
"","Pass123!","No Email",400,"Empty email"
"valid@test.com","","No Password",400,"Empty password"
"invalid-email","Pass123!","Invalid Email",400,"Invalid email format"
"valid@test.com","short","Short Password",200,"Short password (if no validation)"
```

**Postman Test Script:**
```javascript
pm.test(`Test: ${pm.iterationData.get("description")}`, function () {
    const expectedStatus = parseInt(pm.iterationData.get("expected_status"));
    pm.response.to.have.status(expectedStatus);
});
```

---

### 🎯 ข้อ 7: Response Schema Validation (10 คะแนน)

**โจทย์:**  
ใช้ JSON Schema ตรวจสอบ response structure

```javascript
const schema = {
    "type": "object",
    "required": ["success", "data"],
    "properties": {
        "success": { "type": "boolean" },
        "data": {
            "type": "object",
            "required": ["user", "accessToken", "expiresIn"],
            "properties": {
                "user": {
                    "type": "object",
                    "required": ["id", "email", "fullName", "role"],
                    "properties": {
                        "id": { "type": "string" },
                        "email": { "type": "string", "format": "email" },
                        "fullName": { "type": "string" },
                        "role": { "enum": ["CUSTOMER", "ADMIN"] }
                    }
                },
                "accessToken": { "type": "string" },
                "expiresIn": { "type": "number" }
            }
        }
    }
};

pm.test("Response matches schema", function () {
    pm.response.to.have.jsonSchema(schema);
});
```

---

## 4. Postman Collection Structure

### 📁 โครงสร้าง Collection ที่แนะนำ

```
TestShop Auth API
├── 🔐 Authentication
│   ├── POST Register (Success)
│   ├── POST Register (Validation Tests)
│   │   ├── Missing Email
│   │   ├── Missing Password
│   │   └── Duplicate Email
│   ├── POST Login (Success)
│   ├── POST Login (Failure)
│   │   ├── Wrong Password
│   │   └── Non-existent User
│   └── POST Logout
├── 👤 User Profile
│   ├── GET Profile (Authenticated)
│   ├── GET Profile (No Token)
│   └── GET Profile (Invalid Token)
├── 🔄 End-to-End Flow
│   └── Complete User Journey
└── 📊 Data-Driven Tests
    └── Run with CSV
```

### 🔧 Environment Variables

```javascript
// ตัวแปรที่ต้องมีใน Environment
{
  "baseUrl": "https://testshop-lr30.onrender.com",
  "apiVersion": "/api",
  "accessToken": "",
  "refreshToken": "",
  "userId": "",
  "testEmail": "test@example.com",
  "testPassword": "TestPass123!",
  "testFullName": "Test User"
}
```

### 🚀 Newman CLI (Run from command line)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run TestShop-Auth.postman_collection.json \
  -e TestShop-Environment.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export report.html

# Run with data file
newman run TestShop-Auth.postman_collection.json \
  -d test-data.csv \
  --reporters cli,junit \
  --reporter-junit-export results.xml
```

---

## 🎓 Bonus: คำถามทฤษฎี

### 1. ทำไม Login ต้อง return 401 ทั้งกรณี email ไม่มี และ password ผิด?

**เฉลย:**  
เพื่อป้องกัน User Enumeration Attack ถ้าบอกว่า "email ไม่มี" แฮกเกอร์จะรู้ว่า email นั้นไม่มีในระบบ ส่วน "password ผิด" แปลว่า email นั้นมีอยู่

### 2. ทำไม bcrypt ต้องใช้ salt rounds = 10?

**เฉลย:**  
- Salt rounds คือจำนวนรอบในการ hash (2^10 = 1,024 rounds)
- ยิ่งสูงยิ่งปลอดภัยแต่ช้า
- 10 เป็นค่า balance ระหว่าง security และ performance

### 3. JWT token ในระบบนี้มีอายุเท่าไร? มีปัญหาอะไร?

**เฉลย:**  
- JWT มีอายุ 7 วัน (from code: `expiresIn: "7d"`)
- แต่ API return ว่า `expiresIn: 3600` (1 ชั่วโมง) ← **BUG!**
- ค่าไม่ตรงกันระหว่างที่ generate กับที่ return

### 4. Logout ในระบบนี้ทำงานยังไง? มีปัญหาอะไร?

**เฉลย:**  
- Logout แค่ return `{success: true}` แต่ไม่ได้ invalidate token
- Token ยังใช้ได้จนกว่าจะหมดอายุ (7 วัน)
- ถ้าจะทำระบบ Logout จริงๆ ต้องมี Token Blacklist หรือใช้ Short-lived token + Refresh token

---

**สร้างโดย:** เสี่ยวทู่ 🐰  
**สำหรับ:** อิจิ (QA Tester)
