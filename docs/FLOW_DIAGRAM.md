# TestShop E-Commerce Flow Diagrams

## 📊 System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
    end
    
    subgraph "API Layer"
        B[Next.js API Routes]
        B1[Auth APIs]
        B2[Product APIs]
        B3[Cart APIs]
        B4[Order APIs]
        B5[Payment APIs]
        B6[Admin APIs]
    end
    
    subgraph "Service Layer"
        C[Prisma ORM]
        D[JWT Auth]
    end
    
    subgraph "Data Layer"
        E[(PostgreSQL Database)]
    end
    
    A --> B
    B --> B1 & B2 & B3 & B4 & B5 & B6
    B1 & B2 & B3 & B4 & B5 & B6 --> C
    B1 --> D
    C --> E
```

---

## 🔐 1. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as /api/auth
    participant DB as Database
    participant JWT as JWT Service

    %% Register Flow
    rect rgb(200, 255, 200)
    Note over U,JWT: Register Flow
    U->>A: POST /register<br>{email, password, fullName}
    A->>DB: Check if email exists
    DB-->>A: Email available?
    
    alt Email already exists
        A-->>U: 409 Conflict<br>{error: "Email already exists"}
    else Email available
        A->>A: Hash password (bcrypt)
        A->>DB: Create user
        DB-->>A: User created
        A->>JWT: Generate token
        JWT-->>A: accessToken
        A-->>U: 200 OK<br>{user, accessToken, expiresIn}
    end
    end

    %% Login Flow
    rect rgb(200, 200, 255)
    Note over U,JWT: Login Flow
    U->>A: POST /login<br>{email, password}
    A->>DB: Find user by email
    DB-->>A: User data
    
    alt User not found
        A-->>U: 401 Unauthorized<br>{error: "Invalid credentials"}
    else User found
        A->>A: Compare password
        alt Password invalid
            A-->>U: 401 Unauthorized<br>{error: "Invalid credentials"}
        else Password valid
            A->>JWT: Generate token
            JWT-->>A: accessToken
            A-->>U: 200 OK<br>{user, accessToken, expiresIn}
        end
    end
    end

    %% Logout Flow
    rect rgb(255, 200, 200)
    Note over U,JWT: Logout Flow
    U->>A: POST /logout<br>Authorization: Bearer {token}
    A->>JWT: Verify token
    JWT-->>A: Valid
    A-->>U: 200 OK<br>{success: true}
    end
```

---

## 🛒 2. Shopping Flow (Customer Journey)

```mermaid
flowchart TD
    Start([Start]) --> Browse[Browse Products]
    
    Browse --> ViewProduct[View Product Details]
    ViewProduct --> CheckStock{Stock Available?}
    
    CheckStock -->|No| OutOfStock[Show Out of Stock]
    OutOfStock --> Browse
    
    CheckStock -->|Yes| AddToCart[Add to Cart]
    AddToCart --> ValidateStock{Validate Stock}
    
    ValidateStock -->|Insufficient| ShowError[Show Stock Error]
    ShowError --> ViewProduct
    
    ValidateStock -->|Success| CartUpdated[Cart Updated]
    
    CartUpdated --> ContinueShopping{Continue Shopping?}
    ContinueShopping -->|Yes| Browse
    ContinueShopping -->|No| ViewCart[View Cart]
    
    ViewCart --> ModifyCart{Modify Cart?}
    ModifyCart -->|Update Qty| UpdateCart[Update Quantity]
    ModifyCart -->|Remove| RemoveItem[Remove Item]
    ModifyCart -->|Checkout| CreateOrder[Create Order]
    
    UpdateCart --> ValidateStock2{Validate Stock}
    ValidateStock2 -->|Insufficient| ShowError2[Show Error]
    ShowError2 --> ViewCart
    ValidateStock2 -->|Success| CartUpdated
    
    RemoveItem --> CartUpdated
    
    CreateOrder --> ValidateCart{Cart Valid?}
    ValidateCart -->|Empty| ShowEmpty[Show Cart Empty]
    ShowEmpty --> Browse
    
    ValidateCart -->|Valid| CheckAllStock{Check All Items Stock}
    CheckAllStock -->|Insufficient| ShowStockError[Show Stock Errors]
    ShowStockError --> ViewCart
    
    CheckAllStock -->|All Available| DeductStock[Deduct Stock]
    DeductStock --> CreateOrderRecord[Create Order Record]
    CreateOrderRecord --> ClearCart[Clear Cart]
    ClearCart --> ShowOrder[Show Order Details]
    
    ShowOrder --> Payment{Proceed Payment?}
    Payment -->|Yes| ProcessPayment[Process Payment]
    Payment -->|No| OrderPending[Order Pending]
    
    ProcessPayment --> PaymentSuccess{Payment Success?}
    PaymentSuccess -->|Yes| UpdatePaid[Update Status: PAID]
    PaymentSuccess -->|No| PaymentFailed[Status: FAILED]
    
    UpdatePaid --> OrderComplete([Order Complete])
    PaymentFailed --> OrderPending
    OrderPending --> EndFlow([End])
    OrderComplete --> EndFlow
```

---

## 📦 3. Product Management Flow (Admin)

```mermaid
sequenceDiagram
    participant A as Admin
    participant API as /api/admin/products
    participant Auth as Auth Middleware
    participant DB as Database

    %% Authentication Check
    A->>API: Any Request<br>Authorization: Bearer {token}
    API->>Auth: Verify Token
    Auth->>Auth: Check Role = ADMIN
    
    alt Not Admin
        Auth-->>API: 403 Forbidden
        API-->>A: {error: "Admin access required"}
    else Is Admin
        Auth-->>API: Continue
        
        %% Create Product
        rect rgb(200, 255, 200)
        Note over A,DB: Create Product
        A->>API: POST /admin/products<br>{name, slug, price, stock}
        API->>DB: Check slug exists
        DB-->>API: Slug available
        
        alt Slug exists
            API-->>A: 409 Conflict
        else Slug available
            API->>DB: Create product
            DB-->>API: Product created
            API-->>A: 200 OK<br>{product}
        end
        end
        
        %% Update Product
        rect rgb(200, 200, 255)
        Note over A,DB: Update Product
        A->>API: PUT /admin/products/{id}<br>{fields to update}
        API->>DB: Find product
        DB-->>API: Product found
        
        alt Product not found
            API-->>A: 404 Not Found
        else Product found
            API->>DB: Update product
            DB-->>API: Product updated
            API-->>A: 200 OK<br>{product}
        end
        end
        
        %% Delete Product
        rect rgb(255, 200, 200)
        Note over A,DB: Delete Product
        A->>API: DELETE /admin/products/{id}
        API->>DB: Check if in cart/order
        DB-->>API: Product usage status
        
        alt In use
            API-->>A: 400 Bad Request<br>{error: "Cannot delete"}
        else Not in use
            API->>DB: Delete product
            DB-->>API: Deleted
            API-->>A: 200 OK<br>{message: "Deleted"}
        end
        end
    end
```

---

## 📋 4. Order Management Flow

```mermaid
stateDiagram-v2
    [*] --> PENDING: Create Order
    
    PENDING --> PROCESSING: Admin Update Status
    PENDING --> CANCELLED: User Cancel / Admin Cancel
    
    PROCESSING --> SHIPPED: Admin Update Status
    PROCESSING --> CANCELLED: Admin Cancel
    
    SHIPPED --> DELIVERED: Admin Update Status
    SHIPPED --> CANCELLED: Admin Cancel (Exception)
    
    DELIVERED --> [*]: Order Complete
    CANCELLED --> [*]: Order Cancelled
    
    note right of PENDING
        - User can cancel
        - Admin can process or cancel
        - Stock deducted
        - Payment pending
    end note
    
    note right of PROCESSING
        - Admin processing order
        - User cannot cancel
    end note
    
    note right of SHIPPED
        - Order shipped
        - Tracking available
    end note
    
    note right of CANCELLED
        - Stock restored
        - If paid, refund needed
    end note
```

---

## 🔄 5. Stock Management Flow

```mermaid
flowchart LR
    subgraph "Stock Sources"
        A1[Admin Add Product]
        A2[Admin Restock]
        A3[Order Cancelled]
    end
    
    subgraph "Stock Database"
        B[(Product Stock)]
    end
    
    subgraph "Stock Consumption"
        C1[Add to Cart<br>- Validate Only]
        C2[Create Order<br>- Deduct Stock]
        C3[Cart Abandoned<br>- No Change]
    end
    
    A1 -->|Set initial stock| B
    A2 -->|Increase stock| B
    A3 -->|Restore stock| B
    
    B -->|Check available| C1
    B -->|Decrease stock| C2
    
    C1 -.->|Validation only| B
    C2 -->|Stock deducted| B
```

---

## 🔧 6. Cart Flow Detail

```mermaid
sequenceDiagram
    participant U as User
    participant C as /api/cart/items
    participant P as Product Service
    participant DB as Database

    %% Get Cart
    rect rgb(230, 230, 250)
    Note over U,DB: Get Cart
    U->>C: GET /cart/items<br>Authorization: Bearer {token}
    C->>DB: Find cart by userId
    DB-->>C: Cart with items
    C-->>U: 200 OK<br>{cart items}
    end

    %% Add to Cart
    rect rgb(255, 250, 230)
    Note over U,DB: Add to Cart
    U->>C: POST /cart/items<br>{productId, quantity}
    C->>P: Get product stock
    P-->>C: Current stock
    
    alt Stock < Quantity
        C-->>U: 400 Bad Request<br>{error: "Insufficient stock"}
    else Stock available
        C->>DB: Check existing item
        DB-->>C: Existing item?
        
        alt Item exists
            C->>DB: Update quantity
        else New item
            C->>DB: Create cart item
        end
        
        DB-->>C: Cart updated
        C-->>U: 200 OK<br>{cart}
    end
    end

    %% Update Cart
    rect rgb(230, 255, 230)
    Note over U,DB: Update Quantity
    U->>C: PATCH /cart/items<br>{itemId, quantity}
    C->>P: Validate new quantity
    P-->>C: Stock check
    
    alt Stock insufficient
        C-->>U: 400 Error
    else Valid
        C->>DB: Update item
        DB-->>C: Updated
        C-->>U: 200 OK
    end
    end

    %% Remove from Cart
    rect rgb(255, 230, 230)
    Note over U,DB: Remove Item
    U->>C: DELETE /cart/items<br>{itemId}
    C->>DB: Delete item
    DB-->>C: Deleted
    C-->>U: 200 OK<br>{updated cart}
    end
```

---

## 📊 7. Admin Dashboard Stats Flow

```mermaid
flowchart TD
    A[Admin Request Stats] --> B{Auth Check}
    B -->|Not Admin| C[403 Forbidden]
    B -->|Is Admin| D[Calculate Period]
    
    D --> E[Query Database]
    
    subgraph "Parallel Queries"
        E --> E1[Count Users]
        E --> E2[Count Products]
        E --> E3[Count Orders<br>by Period]
        E --> E4[Sum Revenue<br>Paid Orders]
        E --> E5[Count Low Stock]
        E --> E6[Recent Orders]
    end
    
    E1 & E2 & E3 & E4 & E5 & E6 --> F[Aggregate Data]
    
    F --> G[Return Stats]
    G --> H[
        {
          summary: {...},
          ordersByStatus: {...},
          recentOrders: [...]
        }
    ]
```

---

## 🌐 8. API Request/Response Flow

```mermaid
flowchart TD
    Request[HTTP Request] --> Route[API Route Handler]
    
    Route --> AuthCheck{Auth Required?}
    AuthCheck -->|Yes| VerifyToken[Verify JWT Token]
    AuthCheck -->|No| SkipAuth[Skip Auth]
    
    VerifyToken --> ValidToken{Valid?}
    ValidToken -->|No| Return401[401 Unauthorized]
    ValidToken -->|Yes| CheckRole{Admin Only?}
    
    CheckRole -->|Yes| IsAdmin{Is Admin?}
    CheckRole -->|No| Continue
    
    IsAdmin -->|No| Return403[403 Forbidden]
    IsAdmin -->|Yes| Continue
    
    SkipAuth --> Continue[Process Request]
    
    Continue --> Validation[Validate Input]
    Validation --> ValidInput{Valid?}
    ValidInput -->|No| Return400[400 Bad Request]
    ValidInput -->|Yes| BusinessLogic[Business Logic]
    
    BusinessLogic --> DBQuery[Database Query]
    DBQuery --> DB[(PostgreSQL)]
    DB --> DBResult[Query Result]
    
    DBResult --> Success{Success?}
    Success -->|No| Return500[500 Server Error]
    Success -->|Yes| FormatResponse[Format Response]
    
    FormatResponse --> Return200[200 OK<br>{success: true, data}]
    
    Return401 & Return403 & Return400 & Return500 --> ErrorResponse[Return Error<br>{success: false, error}]
    
    Return200 & ErrorResponse --> End([End])
```

---

## 📁 Database Schema Relationship

```mermaid
erDiagram
    USER ||--o{ CART : has
    USER ||--o{ ORDER : places
    
    CART ||--o{ CART_ITEM : contains
    PRODUCT ||--o{ CART_ITEM : "included in"
    
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "includes"
    
    USER {
        string id PK
        string email UK
        string passwordHash
        string fullName
        string role
        datetime createdAt
    }
    
    PRODUCT {
        string id PK
        string name
        string slug UK
        string description
        float price
        int stockQuantity
        datetime createdAt
    }
    
    CART {
        string id PK
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    CART_ITEM {
        string id PK
        string cartId FK
        string productId FK
        int quantity
        float priceAtTime
    }
    
    ORDER {
        string id PK
        string userId FK
        string status
        string paymentStatus
        float subtotal
        float totalAmount
        datetime createdAt
    }
    
    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        string productName
        float price
        int quantity
        float subtotal
    }
```

---

## 🎯 Summary

| Flow | Key Features |
|------|-------------|
| **Authentication** | JWT-based, bcrypt password hashing, role-based access |
| **Shopping** | Stock validation, cart persistence, order creation |
| **Admin Products** | CRUD operations, slug validation, usage check before delete |
| **Orders** | Status workflow, stock management, payment integration |
| **Stock** | Real-time validation, auto-deduct on order, restore on cancel |
| **Dashboard** | Aggregated stats, recent orders, low stock alerts |

---

*Generated for TestShop E-Commerce Platform*
