# 🕵️ HTTPCloak Assistant Skill

OpenClaw Skill สำหรับใช้งาน **httpcloak** — HTTP client ที่หลบ bot detection โดยเลียนแบบ browser

---

## 🎯 httpcloak คืออะไร?

**ทำให้ HTTP requests ของคุณเหมือน browser จริง ๆ**

| สิ่งที่ตรวจจับ | httpcloak ทำ |
|---------------|--------------|
| JA3/JA4 TLS fingerprint | ✅ เลียนแบบ |
| HTTP/2 frames | ✅ เลียนแบบ |
| HTTP/3 QUIC | ✅ เลียนแบบ |
| Header order | ✅ เลียนแบบ |
| ECH (Encrypted SNI) | ✅ รองรับ |

---

## 📦 การติดตั้ง

```bash
# Python
pip install httpcloak

# Node.js
npm install httpcloak

# Go
go get github.com/sardanioss/httpcloak
```

---

## 🚀 ใช้งานผ่าน OpenClaw

```
"ช่วยเขียน code ใช้ httpcloak ดึงข้อมูลจากเว็บที่มี bot protection"
"httpcloak ใช้ยังไง อยากหลบ JA3 fingerprint"
"ตัวอย่าง httpcloak session กับ proxy"
"ECH คืออะไร ใช้กับ httpcloak ยังไง"
```

---

## 💡 ตัวอย่างใช้งาน

### Basic Request
```python
import httpcloak

r = httpcloak.get("https://example.com", preset="chrome-145")
print(r.status_code)  # 200
```

### Web Scraping
```python
session = httpcloak.Session(preset="chrome-145")
session.warmup("https://target.com")  # โหลดเหมือนคนจริง
r = session.get("https://target.com/api")
```

### กับ Proxy
```python
session = httpcloak.Session(
    preset="chrome-145",
    proxy="socks5://user:pass@proxy:1080"
)
```

---

## 🎭 Browser Presets

| Preset | ใช้สำหรับ |
|--------|----------|
| `chrome-145` | Chrome ล่าสุด (แนะนำ) |
| `chrome-145-windows` | Chrome on Windows |
| `chrome-145-macos` | Chrome on macOS |
| `firefox-133` | Firefox |
| `safari-18` | Safari |

---

## ⚠️ ข้อควรระวัง

**ใช้อย่างถูกต้อง:**
- ✅ Web scraping ที่ได้รับอนุญาต
- ✅ API access ตาม ToS
- ✅ ทดสอบระบบของตัวเอง
- ❌ ห้ามใช้เจาะระบบโดยไม่ได้รับอนุญาต

---

## 📚 References

- GitHub: https://github.com/sardanioss/httpcloak
- PyPI: https://pypi.org/project/httpcloak/

---

*สร้างเมื่อ: 2026-02-23*
