# TestShop API Documentation

Complete REST API documentation for TestShop E-Commerce platform.

## 📚 Documentation Links

- **Swagger UI**: `https://testshop-lr30.onrender.com/api/docs`
- **OpenAPI Spec**: `docs/api/openapi.yaml`
- **Postman Collection**: `docs/api/testshop-postman-collection.json`

## 🔐 Authentication

### Public APIs (No Authentication Required)
- `GET /api/products` - List products
- `GET /api/products/:slug` - Get product details
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### User APIs (Bearer Token Required)
```
Authorization: Bearer <access_token>
```

- User profile (`/api/user/profile`)
- Cart (`/api/cart/items`)
- Orders (`/api/orders`)
- Payments (`/api/payments/intent`)

### Admin APIs (Admin Role Required)
```
Authorization: Bearer <admin_token>
```

- Product management (`/api/admin/products`)
- Order management (`/api/admin/orders`)
- Dashboard stats (`/api/admin/stats`)

## 📦 API Categories

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new account (password min 8 chars) |
| POST | `/api/auth/login` | Login and get token |
| POST | `/api/auth/logout` | Logout |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get profile |
| PATCH | `/api/user/profile` | Update profile |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| GET | `/api/products/:slug` | Get product |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/items` | Get cart |
| POST | `/api/cart/items` | Add to cart |
| PATCH | `/api/cart/items` | Update quantity |
| DELETE | `/api/cart/items` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List my orders |
| GET | `/api/orders/:id` | Get order |
| POST | `/api/orders` | Create order |
| POST | `/api/orders/:id/cancel` | Cancel order |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/intent` | Pay for order |

### Admin - Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | List all products |
| POST | `/api/admin/products` | Create product |
| GET | `/api/admin/products/:id` | Get product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |

### Admin - Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | List all orders |
| GET | `/api/admin/orders/:id` | Get order |
| PATCH | `/api/admin/orders/:id` | Update status |

### Admin - Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get statistics |

## 🛠️ Using Postman Collection

1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `docs/api/testshop-postman-collection.json`
4. Set environment variables:
   - `baseUrl`: `https://testshop-lr30.onrender.com`
   - `accessToken`: (from login response)
   - `adminToken`: (login as admin)

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## ⚠️ Error Handling

All endpoints return consistent error responses:

| Status Code | Description |
|-------------|-------------|
| 400 | Validation error (invalid input, missing fields) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (non-admin accessing admin endpoints) |
| 404 | Resource not found |
| 409 | Conflict (e.g., email already exists) |
| 500 | Internal server error |

## 🔄 Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
    ↓
CANCELLED
```

## 📈 Stock Management

- **Add to cart**: Checks stock availability
- **Create order**: Deducts stock automatically
- **Cancel order**: Restores stock automatically

## 🌐 Base URLs

- Production: `https://testshop-lr30.onrender.com`
- Local: `http://localhost:3000`
