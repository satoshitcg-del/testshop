# 🔍 Witr Assistant Skill

OpenClaw Skill สำหรับใช้งาน **witr** (Why Is This Running?) — เครื่องมือตรวจสอบว่าทำไม process ถึงรันอยู่

---

## 🎯 witr คืออะไร?

เครื่องมือที่ตอบคำถาม: **"Why is this running?"**

| เครื่องมือทั่วไป | แสดง | witr | แสดง |
|----------------|------|------|------|
| `ps`, `top` | อะไรกำลังรัน | ✅ | อะไร + **ทำไม** |
| `lsof` | อะไรใช้ port/file | ✅ | + ใครเริ่ม + อย่างไร |
| `systemctl` | สถานะ service | ✅ | + สาเหตุที่รัน |

---

## 📦 การติดตั้ง

### Linux/macOS
```bash
curl -fsSL https://raw.githubusercontent.com/pranshuparmar/witr/main/install.sh | bash
```

### Windows
```powershell
irm https://raw.githubusercontent.com/pranshuparmar/witr/main/install.ps1 | iex
```

### Package Managers
```bash
# macOS/Linux
brew install witr

# Conda
conda install -c conda-forge witr
```

---

## 🚀 วิธีใช้ผ่าน OpenClaw

```
"ช่วยเช็คว่าทำไม process 1234 ถึงรันอยู่"
"port 8080 ถูกใช้โดยอะไร"
"มีอะไรรันอยู่บนเครื่องนี้บ้าง (witr)"
"ทำไม nginx ถึงรัน"
"ช่วยตรวจสอบ service ที่กิน CPU เยอะ"
```

---

## 💡 สถานการณ์ที่ใช้

### 1. Process กิน CPU/Memory เยอะ
```bash
# ดูว่า process ไหนกินทรัพยากร
top

# แล้วใช้ witr ตรวจสอบ
witr <pid>
```

### 2. Port ถูกใช้แล้ว error
```bash
witr :3000
witr :8080
witr :5432
```

### 3. Service ปริศนา
```bash
witr nginx
witr docker
witr python
```

### 4. Interactive mode
```bash
witr
# แล้วกด / เพื่อ search
```

---

## 📚 References

- GitHub: https://github.com/pranshuparmar/witr
- Repology: https://repology.org/project/witr/versions

---

*สร้างเมื่อ: 2026-02-23*
