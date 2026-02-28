# 📘 Postman Test Scripts Reference Guide 2026

> **Complete reference for writing Postman tests with modern JavaScript (ES6+)**  
> **Last Updated:** February 2026  
> **Postman Version:** v11+

---

## 📋 Table of Contents

1. [Basic Structure](#1-basic-structure)
2. [Response Handling](#2-response-handling)
3. [Chai Assertions (pm.expect)](#3-chai-assertions-pmexpect)
4. [Variables & Data](#4-variables--data)
5. [Test Utilities](#5-test-utilities)
6. [Advanced Patterns](#6-advanced-patterns)
7. [Debugging & Console](#7-debugging--console)
8. [Modern JavaScript in Postman](#8-modern-javascript-in-postman)

---

## 1. Basic Structure

### pm.test() - โครงสร้างพื้นฐาน

```javascript
// รูปแบบพื้นฐาน
pm.test("Test name/description", function () {
    // assertions ต่างๆ
});

// ตัวอย่างจริง
pm.test("Status code should be 200", function () {
    pm.response.to.have.status(200);
});

// หลาย assertions ใน test เดียว
pm.test("Validate user response", function () {
    pm.response.to.have.status(200);
    pm.response.to.have.header("Content-Type");
    
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.email).to.include("@");
});
```

### pm.test.skip() - ข้าม test ชั่วคราว

```javascript
// ใช้ตอนยังไม่อยากรัน test นี้
pm.test.skip("This test is temporarily disabled", function () {
    pm.response.to.have.status(200);
});
```

---

## 2. Response Handling

### pm.response - ข้อมูล Response ทั้งหมด

```javascript
// Response Metadata
pm.response.code;           // Status code (200, 404, etc.)
pm.response.status;         // Status text ("OK", "Not Found")
pm.response.responseTime;   // เวลาที่ใช้ (ms)
pm.response.responseSize;   // ขนาด response (bytes)

// Headers
pm.response.headers;        // Headers ทั้งหมดเป็น array
pm.response.headers.get("Content-Type");  // ดึงค่า header จำเพาะ

// Body
pm.response.text();         // Body เป็น string
pm.response.json();         // Body เป็น JSON object
```

### ตัวอย่างการใช้

```javascript
// Check status code
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

// Check multiple status codes
pm.test("Status is success", () => {
    pm.expect(pm.response.code).to.be.oneOf([200, 201, 202]);
});

// Check response time
pm.test("Response time is less than 500ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Check Content-Type header
pm.test("Content-Type is JSON", () => {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type"))
        .to.include("application/json");
});

// Parse JSON response
pm.test("Response has required fields", () => {
    const response = pm.response.json();
    pm.expect(response).to.have.property("data");
    pm.expect(response.data).to.have.property("id");
});
```

---

## 3. Chai Assertions (pm.expect)

Postman ใช้ **Chai.js BDD syntax** สำหรับ assertions

### 3.1 Equality & Identity

```javascript
const value = "test";
const number = 42;
const obj = { name: "John" };

// Equal (== loose equality)
pm.expect(value).to.equal("test");
pm.expect(number).to.equal(42);

// Eql (deep equality for objects)
pm.expect(obj).to.eql({ name: "John" });

// Strict equal (===)
pm.expect(number).to.equal(42);

// Not equal
pm.expect(value).to.not.equal("other");

// Deep equal (for nested objects)
pm.expect({ a: { b: 1 } }).to.deep.equal({ a: { b: 1 } });
```

### 3.2 Type Checking

```javascript
pm.expect("string").to.be.a('string');
pm.expect(123).to.be.a('number');
pm.expect(true).to.be.a('boolean');
pm.expect([]).to.be.an('array');
pm.expect({}).to.be.an('object');
pm.expect(null).to.be.null;
pm.expect(undefined).to.be.undefined;
pm.expect(() => {}).to.be.a('function');
```

### 3.3 Truthy/Falsy

```javascript
pm.expect(true).to.be.true;
pm.expect(false).to.be.false;
pm.expect(1).to.be.ok;        // truthy
pm.expect(0).to.not.be.ok;    // falsy
pm.expect(null).to.not.exist; // null หรือ undefined
pm.expect("text").to.exist;   // มีค่า
```

### 3.4 Strings

```javascript
const str = "Hello World";

pm.expect(str).to.include("World");     // มีคำนี้
pm.expect(str).to.contain("Hello");     // เหมือน include
pm.expect(str).to.match(/^Hello/);      // Regex match
pm.expect(str).to.have.lengthOf(11);    // ความยาว
pm.expect(str).to.startWith("Hello");   // ขึ้นต้นด้วย
pm.expect(str).to.endWith("World");     // ลงท้ายด้วย
```

### 3.5 Numbers

```javascript
const num = 42;

pm.expect(num).to.be.above(40);         // > 40
pm.expect(num).to.be.below(50);         // < 50
pm.expect(num).to.be.at.least(42);      // >= 42
pm.expect(num).to.be.at.most(42);       // <= 42
pm.expect(num).to.be.within(40, 50);    // 40-50
pm.expect(5.5).to.be.closeTo(5.4, 0.2); // ใกล้เคียง ±0.2
pm.expect(num).to.be.finite;            // ไม่ใช่ Infinity
pm.expect(num).to.be.positive;          // บวก
pm.expect(-num).to.be.negative;         // ลบ
```

### 3.6 Arrays

```javascript
const arr = [1, 2, 3, "test"];

pm.expect(arr).to.include(2);           // มีค่านี้
pm.expect(arr).to.deep.include({ a: 1 });
pm.expect(arr).to.have.lengthOf(4);     // ความยาว
pm.expect(arr).to.not.be.empty;         // ไม่ว่าง
pm.expect([]).to.be.empty;              // ว่าง
pm.expect(arr).to.have.members([1, 2, 3, "test"]);
pm.expect(arr).to.include.members([1, 2]);

// ตรวจสอบ order
pm.expect(arr).to.have.ordered.members([1, 2, 3, "test"]);
```

### 3.7 Objects

```javascript
const obj = {
    id: "123",
    name: "John",
    email: "john@test.com",
    nested: { age: 25 }
};

// Property checks
pm.expect(obj).to.have.property("name");
pm.expect(obj).to.have.property("name", "John");  // property + value
pm.expect(obj).to.have.any.keys("id", "name", "xxx");  // มีอย่างน้อย 1
pm.expect(obj).to.have.all.keys("id", "name", "email"); // มีทั้งหมด
pm.expect(obj).to.include({ name: "John" });

// Deep property (nested)
pm.expect(obj).to.have.deep.property("nested.age", 25);
pm.expect(obj).to.have.nested.property("nested.age");

// ตรวจสอบชนิดข้อมูลของ property
pm.expect(obj.name).to.be.a('string');
pm.expect(obj.nested).to.be.an('object');
```

### 3.8 JSON Schema Validation

```javascript
const schema = {
    type: "object",
    required: ["id", "name", "email"],
    properties: {
        id: { type: "string" },
        name: { type: "string", minLength: 1 },
        email: { type: "string", format: "email" },
        age: { type: "number", minimum: 0 }
    }
};

const response = pm.response.json();
pm.expect(response).to.have.jsonSchema(schema);
```

---

## 4. Variables & Data

### 4.1 Environment Variables

```javascript
// ตั้งค่า
pm.environment.set("token", "abc123");
pm.environment.set("userId", 12345);
pm.environment.set("isActive", true);

// อ่านค่า
const token = pm.environment.get("token");
const userId = pm.environment.get("userId");

// ลบ
pm.environment.unset("token");

// ล้างทั้งหมด (ระวัง!)
pm.environment.clear();

// ตรวจสอบว่ามีไหม
if (pm.environment.has("token")) {
    console.log("Token exists");
}
```

### 4.2 Collection Variables

```javascript
// เหมือน environment แต่ scope อยู่ใน collection
pm.collectionVariables.set("baseUrl", "https://api.example.com");
const url = pm.collectionVariables.get("baseUrl");
pm.collectionVariables.unset("baseUrl");
```

### 4.3 Global Variables

```javascript
// ใช้ข้าม collection
pm.globals.set("sharedToken", "xyz789");
const shared = pm.globals.get("sharedToken");
pm.globals.unset("sharedToken");
```

### 4.4 Data Variables (จาก CSV/JSON)

```javascript
// ใช้ตอน run collection with data file
const email = pm.iterationData.get("email");
const expectedStatus = pm.iterationData.get("expectedStatus");

// ดูว่ามีข้อมูลไหม
if (pm.iterationData.has("optionalField")) {
    const value = pm.iterationData.get("optionalField");
}
```

### 4.5 Dynamic Variables

```javascript
// ใช้ค่าพิเศษของ Postman
const randomUUID = pm.variables.replaceIn("{{$guid}}");           // UUID
const timestamp = pm.variables.replaceIn("{{$timestamp}}");      // Unix timestamp
const randomInt = pm.variables.replaceIn("{{$randomInt}}");      // Random 0-1000
const randomColor = pm.variables.replaceIn("{{$randomColor}}");  // Random color hex

// สร้าง dynamic เอง
const dynamicValue = pm.variables.replaceIn("Hello {{name}}!");
```

---

## 5. Test Utilities

### 5.1 Iteration Info

```javascript
// ตอนรัน collection
pm.test(`Iteration ${pm.info.iteration}: Test name`, () => {
    // pm.info.iteration = รอบที่กำลังรัน (เริ่มจาก 0)
    // pm.info.iterationCount = จำนวนรอบทั้งหมด
});

// ข้าม iteration ถัดไป
if (pm.info.iteration === 0) {
    pm.execution.skipRequest();
}
```

### 5.2 Request Info

```javascript
pm.request.url;           // URL ของ request
pm.request.method;        // GET, POST, etc.
pm.request.headers;       // Headers ที่ส่งไป
pm.request.body;          // Body ที่ส่งไป
```

### 5.3 Conditionals

```javascript
// รัน test ตาม condition
if (pm.response.code === 200) {
    pm.test("Success case", () => {
        const data = pm.response.json();
        pm.expect(data).to.have.property("data");
    });
} else {
    pm.test("Error case", () => {
        const error = pm.response.json();
        pm.expect(error).to.have.property("message");
    });
}
```

### 5.4 Send Another Request (Advanced)

```javascript
// ส่ง request เพิ่มจาก test (ใช้น้อย)
pm.sendRequest("https://api.example.com/health", (err, response) => {
    if (err) {
        console.log(err);
    } else {
        pm.test("Health check", () => {
            pm.expect(response.code).to.equal(200);
        });
    }
});
```

---

## 6. Advanced Patterns

### 6.1 Extract & Chain

```javascript
// เก็บข้อมูลไว้ใช้ request ถัดไป
pm.test("Extract token", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("accessToken");
    
    // เก็บลง environment
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("userId", jsonData.data.user.id);
    pm.environment.set("email", jsonData.data.user.email);
});

// Request ถัดไปใช้แบบนี้:
// Headers: Authorization: Bearer {{accessToken}}
```

### 6.2 Multiple Tests with Loop

```javascript
// ตรวจสอบ array หลาย items
const response = pm.response.json();
const items = response.data.items;

pm.test(`All ${items.length} items have required fields`, () => {
    items.forEach((item, index) => {
        pm.expect(item, `Item ${index}`).to.have.property("id");
        pm.expect(item, `Item ${index}`).to.have.property("name");
        pm.expect(item.price, `Item ${index} price`).to.be.above(0);
    });
});
```

### 6.3 Date/Time Validation

```javascript
// ตรวจสอบ timestamp
const response = pm.response.json();
const createdAt = new Date(response.data.createdAt);
const now = new Date();

pm.test("Created date is valid", () => {
    pm.expect(createdAt).to.be.a('date');
    pm.expect(createdAt.getTime()).to.be.below(now.getTime());
});

// ตรวจสอบ ISO format
pm.test("Date is ISO format", () => {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    pm.expect(response.data.createdAt).to.match(isoRegex);
});
```

### 6.4 JSON Web Token (JWT) Validation

```javascript
// Decode JWT (ไม่ต้องใช้ library ภายนอก)
function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

const token = pm.environment.get("accessToken");
const decoded = decodeJWT(token);

pm.test("JWT has correct claims", () => {
    pm.expect(decoded).to.have.property("id");
    pm.expect(decoded).to.have.property("email");
    pm.expect(decoded.exp).to.be.above(Math.floor(Date.now() / 1000));
});
```

---

## 7. Debugging & Console

### 7.1 Console Methods

```javascript
// Log levels ต่างๆ
console.log("普通 log");
console.info("Info message");
console.warn("Warning!");
console.error("Error occurred!");

// แสดง object
const data = { name: "John", age: 30 };
console.log("User data:", data);

// JSON stringify เพื่อดู structure
console.log("JSON:", JSON.stringify(data, null, 2));

// Template literals
const status = pm.response.code;
console.log(`Status: ${status}, Time: ${pm.response.responseTime}ms`);
```

### 7.2 Visualize (สร้าง HTML ใน response)

```javascript
// สร้าง table แสดงผล
const template = `
<html>
<body>
    <h2>Test Results</h2>
    <table border="1">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Status</td><td>${pm.response.code}</td></tr>
        <tr><td>Time</td><td>${pm.response.responseTime}ms</td></tr>
    </table>
</body>
</html>
`;
pm.visualizer.set(template);
```

---

## 8. Modern JavaScript in Postman

Postman Sandbox รองรับ ES6+ เต็มรูปแบบ:

### 8.1 Arrow Functions

```javascript
// ✅ แนะนำ
pm.test("Test with arrow", () => {
    pm.response.to.have.status(200);
});

// ก็ได้แต่ไม่แนะนำ
pm.test("Test with function", function () {
    pm.response.to.have.status(200);
});
```

### 8.2 const / let (ไม่ใช้ var)

```javascript
// ✅ ถูกต้อง
const jsonData = pm.response.json();
const token = jsonData.data.token;
let retryCount = 0;

// ❌ ไม่แนะนำ
var data = pm.response.json();
```

### 8.3 Destructuring

```javascript
const { id, name, email } = pm.response.json().data;
pm.expect(id).to.exist;
pm.expect(name).to.be.a('string');

// Array destructuring
const [first, second] = pm.response.json().items;
pm.expect(first).to.have.property("id");
```

### 8.4 Template Literals

```javascript
const userId = pm.environment.get("userId");
const message = `User ${userId} created successfully`;

// ใน test name
pm.test(`Verify user ${userId} exists`, () => {
    // ...
});
```

### 8.5 Optional Chaining

```javascript
const response = pm.response.json();

// ✅ ปลอดภัย (ไม่ error ถ้า nested ไม่มี)
const city = response?.data?.address?.city;

// แบบเก่าต้อง check ทีละชั้น
const city = response && response.data && response.data.address && response.data.address.city;
```

### 8.6 Nullish Coalescing

```javascript
const value = response.data.count ?? 0;  // ใช้ 0 ถ้า null หรือ undefined
// ต่างจาก || ตรงที่ "" กับ 0 ไม่ถือว่า falsy
```

### 8.7 Array Methods

```javascript
const items = pm.response.json().data.items;

// map
const ids = items.map(item => item.id);

// filter
const activeItems = items.filter(item => item.status === "active");

// find
const admin = items.find(item => item.role === "admin");

// some/every
const hasAdmin = items.some(item => item.role === "admin");
const allActive = items.every(item => item.status === "active");

// reduce
const total = items.reduce((sum, item) => sum + item.price, 0);
```

---

## 🎯 Quick Reference Card

### คำสั่งที่ใช้บ่อยที่สุด

```javascript
// Response
pm.response.code                          // 200
pm.response.json()                        // Parse JSON
pm.response.text()                        // Raw text
pm.response.headers.get("header-name")    // Header value

// Assertions
pm.response.to.have.status(200)
pm.response.to.have.header("Content-Type")
pm.expect(value).to.equal(expected)
pm.expect(value).to.include("text")
pm.expect(value).to.be.a('string')
pm.expect(array).to.have.lengthOf(3)
pm.expect(object).to.have.property("name")
pm.expect(object).to.have.keys("a", "b", "c")

// Variables
pm.environment.set("key", value)
const val = pm.environment.get("key")

// Info
pm.info.iteration                         // รอบที่รัน
pm.info.requestName                       // ชื่อ request
```

---

## 📚 Additional Resources

- [Postman Official Docs](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/)
- [Chai.js BDD API](https://www.chaijs.com/api/bdd/)
- [Postman Sandbox API](https://learning.postman.com/docs/tests-and-scripts/write-scripts/script-references/postman-sandbox-api-reference/)

---

**สร้างโดย:** เสี่ยวทู่ 🐰  
**สำหรับ:** TestShop QA Team  
**Version:** 2026.1
