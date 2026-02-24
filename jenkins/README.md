# Jenkins CI/CD for TestShop

## 📁 ไฟล์ในโฟลเดอร์นี้

| ไฟล์ | คำอธิบาย |
|------|---------|
| `Jenkinsfile` | Pipeline หลัก (Parallel Testing) |
| `Jenkinsfile-simple` | Pipeline แบบง่าย |
| `docker-compose.yml` | รัน Jenkins ด้วย Docker |
| `scripts/run-api-tests.sh` | Script รัน Test Cases |

---

## 🚀 เริ่มต้นใช้งาน

### วิธีที่ 1: รัน Jenkins ด้วย Docker

```bash
cd jenkins
docker-compose up -d
```

เข้า Jenkins ที่: http://localhost:8080
- Username: `admin`
- Password: `admin123`

### วิธีที่ 2: ใช้ Jenkins ที่มีอยู่แล้ว

1. สร้าง New Item → Pipeline
2. ใน Pipeline Script:
   - เลือก "Pipeline script from SCM"
   - SCM: Git
   - Repository URL: `https://github.com/satoshitcg-del/testshop.git`
   - Script Path: `jenkins/Jenkinsfile`

---

## 🧪 Test Cases ที่รัน

### Parallel Stages
- **Authentication Tests** (5 tests)
- **User Profile Tests** (3 tests)
- **Product Tests** (3 tests)
- **Cart Tests** (2 tests)
- **Order Tests** (2 tests)

### Sequential Stages
- **Admin API Tests**
- **Integration Tests**

---

## 📊 Test Report

หลังรันเสร็จ ดูรายงานได้ที่:
- `test-reports/authentication-report.txt`
- `test-reports/user-profile-report.txt`
- etc.

---

## 📝 การเพิ่ม Test Case ใหม่

แก้ไขไฟล์ `jenkins/scripts/run-api-tests.sh`:

```bash
# เพิ่มใน section ที่ต้องการ
if [ "${GROUP}" = "your-group" ]; then
    test_api "TC-XXX-001: Test Name" \
        "POST" "/api/endpoint" \
        '{"key": "value"}' \
        "200" "${TOKEN}"
fi
```

---

## 🔧 Environment Variables

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|--------|------------|---------|
| `API_BASE_URL` | `https://testshop-lr30.onrender.com` | URL ของ API |
| `TEST_REPORT_DIR` | `test-reports` | โฟลเดอร์เก็บรายงาน |

---

## 📚 คำสั่งที่ใช้บ่อย

### รัน Test บนเครื่องตัวเอง
```bash
# รัน authentication tests
bash jenkins/scripts/run-api-tests.sh authentication TC-AUTH https://testshop-lr30.onrender.com

# รัน product tests
bash jenkins/scripts/run-api-tests.sh products TC-PROD https://testshop-lr30.onrender.com
```

### ดู Logs
```bash
docker logs testshop-jenkins -f
```

### หยุด Jenkins
```bash
docker-compose down
```

---

## 🏗️ Pipeline Stages

```
Checkout
    ↓
Setup
    ↓
Install Dependencies (Parallel)
    ├── Install Newman
    └── Install Frontend Deps
    ↓
API Tests (Parallel)
    ├── Authentication Tests
    ├── User Profile Tests
    ├── Product Tests
    ├── Cart Tests
    └── Order Tests
    ↓
Admin API Tests
    ↓
Integration Tests
    ↓
Generate Reports
    ↓
Publish Results
```

---

## ⚠️ หมายเหตุ

1. **การเชื่อมต่อ API** - ต้องใช้ URL ที่ถูกต้อง
2. **Test Data** - บาง tests ต้องการ user ที่มีอยู่จริง
3. **Parallel Execution** - รัน tests หลายอันพร้อมกันเพื่อความเร็ว
4. **Report** - เก็บผลลัพธ์ในรูปแบบ text และ HTML

---

*สร้างเมื่อ: 2026-02-24*
