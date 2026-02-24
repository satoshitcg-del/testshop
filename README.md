# TestShop E-Commerce API

ระบบร้านค้าออนไลน์แบบ Full-Stack พร้อม API ครบครัน

[![Deploy](https://img.shields.io/badge/Deploy-Render-green)](https://testshop-lr30.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger-blue)](https://testshop-lr30.onrender.com/api/docs)

---

## 🚀 Live Demo

- **Website**: https://testshop-lr30.onrender.com
- **API Base URL**: https://testshop-lr30.onrender.com/api
- **Swagger UI**: https://testshop-lr30.onrender.com/api/docs

---

## 📁 โครงสร้างโปรเจค

```
testshop/
├── frontend/                 # Next.js Frontend + API Routes
│   ├── src/app/api/         # API Routes
│   │   ├── auth/            # Authentication APIs
│   │   ├── products/        # Product APIs
│   │   ├── cart/            # Cart APIs
│   │   ├── orders/          # Order APIs
│   │   ├── payments/        # Payment APIs
│   │   ├── user/            # User Profile APIs
│   │   ├── admin/           # Admin APIs
│   │   └── docs/            # Swagger UI
│   └── prisma/              # Database Schema
│
├── docs/                     # Documentation
│   ├── api/                 # API Documentation
│   │   ├── openapi.yaml     # OpenAPI Spec
│   │   ├── testshop-postman-collection.json
│   │   └── README.md
│   ├── FLOW_DIAGRAM.md      # Flow Diagrams
│   └── TEST_CASES_TH.md     # Test Cases (Thai)
│
├── jenkins/                  # CI/CD
│   ├── Jenkinsfile          # Jenkins Pipeline
│   ├── docker-compose.yml   # Jenkins Docker Setup
│   └── scripts/             # Test Scripts
│
└── README.md                # This file
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL (Render) |
| **ORM** | Prisma |
| **Auth** | JWT (jsonwebtoken) |
| **Password** | bcryptjs |
| **Documentation** | Swagger UI, OpenAPI 3.0 |
| **CI/CD** | Jenkins |

---

## 📚 API Documentation

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| POST | `/api/auth/logout` | ออกจากระบบ |

### 👤 User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | ดูโปรไฟล์ |
| PATCH | `/api/user/profile` | แก้ไขโปรไฟล์ |

### 📦 Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | ดูสินค้าทั้งหมด |
| GET | `/api/products/:slug` | ดูรายละเอียดสินค้า |

### 🛒 Cart (ต้อง Login)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/items` | ดูตะกร้า |
| POST | `/api/cart/items` | เพิ่มสินค้า |
| PATCH | `/api/cart/items` | แก้ไขจำนวน |
| DELETE | `/api/cart/items` | ลบสินค้า |

### 📋 Orders (ต้อง Login)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | รายการคำสั่งซื้อ |
| POST | `/api/orders` | สร้างคำสั่งซื้อ |
| GET | `/api/orders/:id` | ดูรายละเอียด |
| POST | `/api/orders/:id/cancel` | ยกเลิก |

### 👑 Admin (ต้องเป็น Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/admin/products` | จัดการสินค้า |
| GET/PATCH | `/api/admin/orders` | จัดการคำสั่งซื้อ |
| GET | `/api/admin/stats` | สถิติ |

---

## 🧪 Testing

### Postman Collection
```bash
# Download จาก
curl -O https://raw.githubusercontent.com/satoshitcg-del/testshop/main/docs/api/testshop-postman-collection.json

# Import เข้า Postman แล้วเริ่มใช้งาน
```

### Run Tests Locally
```bash
# รัน authentication tests
bash jenkins/scripts/run-api-tests.sh authentication TC-AUTH https://testshop-lr30.onrender.com

# รัน product tests
bash jenkins/scripts/run-api-tests.sh products TC-PROD https://testshop-lr30.onrender.com
```

### Jenkins CI/CD
```bash
cd jenkins
docker-compose up -d

# เข้า http://localhost:8080
# Username: admin, Password: admin123
```

---

## 📖 Documentation

| เอกสาร | ลิงก์ |
|--------|--------|
| **API Spec (Swagger)** | https://testshop-lr30.onrender.com/api/docs |
| **Flow Diagrams** | [docs/FLOW_DIAGRAM.md](docs/FLOW_DIAGRAM.md) |
| **Test Cases (TH)** | [docs/TEST_CASES_TH.md](docs/TEST_CASES_TH.md) |
| **API README** | [docs/api/README.md](docs/api/README.md) |
| **Postman Collection** | [docs/api/testshop-postman-collection.json](docs/api/testshop-postman-collection.json) |

---

## 🎯 Features

### Core Features
- ✅ ระบบสมาชิก (Register/Login/Logout)
- ✅ จัดการสินค้า (ดูรายการ, ค้นหา)
- ✅ ตะกร้าสินค้า (เพิ่ม/ลด/ลบ)
- ✅ สร้างคำสั่งซื้อ (ตรวจสอบ stock อัตโนมัติ)
- ✅ ยกเลิกคำสั่งซื้อ (คืน stock อัตโนมัติ)
- ✅ ระบบชำระเงิน

### Admin Features
- ✅ จัดการสินค้า (CRUD)
- ✅ จัดการคำสั่งซื้อ (อัพเดทสถานะ)
- ✅ Dashboard สถิติ
- ✅ Role-based Access Control

### Technical Features
- ✅ Stock Validation Real-time
- ✅ JWT Authentication
- ✅ API Documentation (Swagger)
- ✅ Comprehensive Test Cases (71 cases)
- ✅ CI/CD Pipeline (Jenkins)

---

## 🔄 Order Status Flow

```
[PENDING] → [PROCESSING] → [SHIPPED] → [DELIVERED]
    ↓
[CANCELLED]
```

---

## 🗄️ Database Schema

```
Users (id, email, passwordHash, fullName, role)
  ↓
Carts → CartItems → Products
  ↓
Orders → OrderItems → Products
```

---

## 👨‍💻 Development

### Setup Local
```bash
# Clone
git clone https://github.com/satoshitcg-del/testshop.git
cd testshop/frontend

# Install
npm install

# Environment
cp .env.example .env.local
# Edit DATABASE_URL

# Database
npx prisma migrate dev
npx prisma db seed

# Run
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📄 License

MIT License

---

## 🤝 Contributing

1. Fork โปรเจค
2. สร้าง Branch ใหม่ (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไป Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

---

<p align="center">Made with ❤️ for TestShop</p>
