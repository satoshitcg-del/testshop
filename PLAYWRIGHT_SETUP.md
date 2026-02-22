# Playwright Installation for Askmebill Testing

## วิธีติดตั้ง Playwright (ไม่ต้องใช้ OpenClaw Browser)

### Step 1: ติดตั้ง Playwright

```bash
# ติดตั้ง Python package
pip install playwright

# ติดตั้ง Chromium browser
playwright install chromium
```

### Step 2: รันการทดสอบ

```bash
# รัน script
python askmebill_playwright_test.py
```

---

## สิ่งที่ Script ทำ

| Test | รายละเอียด |
|------|-----------|
| **Reconnaissance** | ตรวจสอบ security headers, forms |
| **Login** | ทดสอบ login ด้วย credentials |
| **2FA** | กรอก 2FA code |
| **Authenticated Areas** | ทดสอบ IDOR, เข้าถึงหน้าต่างๆ |
| **Input Validation** | ทดสอบ XSS, SQL injection |

---

## Output Files

- `askmebill-test-results-YYYYMMDD_HHMMSS.json` - ผลการทดสอบ
- `login_filled.png` - Screenshot ตอนกรอก login
- `dashboard.png` - Screenshot หลัง login สำเร็จ

---

## การตั้งค่า Antivirus (ถ้าติด)

ถ้า Antivirus ขัดขวาง:

### Windows Defender
```powershell
# เพิ่ม Exclusion (ต้อง run as Administrator)
Add-MpPreference -ExclusionPath "D:\Users\nuttawat.jun\Documents\GitHub\testshop"
Add-MpPreference -ExclusionPath "D:\Users\nuttawat.jun\.openclaw"
```

### หรือปิดชั่วคราว (ไม่แนะนำใน production)
```powershell
# ปิด Real-time protection (ชั่วคราว)
Set-MpPreference -DisableRealtimeMonitoring $true
```

---

## ทางเลือกอื่น: ใช้ Selenium

ถ้า Playwright มีปัญหา:

```bash
pip install selenium webdriver-manager
```

---

## หมายเหตุ

- **Headless Mode**: ปัจจุบัน set เป็น `headless=False` เพื่อให้เห็น browser
- เปลี่ยนเป็น `headless=True` ถ้าต้องการรัน background
- **2FA Code**: ใช้ได้ครั้งเดียว อาจต้องขอ code ใหม่ถ้าหมดอายุ

---

*สร้างโดย: เสี่ยวทู่ (OpenClaw Agent)*
