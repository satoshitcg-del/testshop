# 🗄️ 3. Database Design (ออกแบบฐานข้อมูล)

## 3.1 Entity Relationship Diagram (ERD)

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│      users     │     │    sellers     │     │     shops      │
├────────────────┤     ├────────────────┤     ├────────────────┤
│ id (PK)        │────<│ id (PK)        │>────│ id (PK)        │
│ email          │     │ user_id (FK)   │     │ seller_id (FK) │
│ password_hash  │     │ shop_name      │     │ name           │
│ full_name      │     │ status         │     │ slug           │
│ phone          │     │ verified_at    │     │ description    │
│ avatar_url     │     │ created_at     │     │ logo_url       │
│ role           │     └────────────────┘     │ banner_url     │
│ is_active      │                            │ status         │
│ created_at     │                            │ rating         │
└────────────────┘                            └────────────────┘
         │                                           │
         │    ┌────────────────┐                     │
         │    │    addresses   │                     │
         │    ├────────────────┤                     │
         └───<│ id (PK)        │                     │
              │ user_id (FK)   │                     │
              │ type           │                     │
              │ full_name      │                     │
              │ phone          │                     │
              │ address_line   │                     │
              │ province       │                     │
              │ district       │                     │
              │ postal_code    │                     │
              │ is_default     │                     │
              └────────────────┘                     │
                                                   │
┌────────────────┐     ┌────────────────┐         │
│   categories   │     │    products    │>────────┘
├────────────────┤     ├────────────────┤
│ id (PK)        │     │ id (PK)        │
│ parent_id (FK) │>────│ shop_id (FK)   │
│ name           │     │ category_id(FK)│>────────┐
│ slug           │     │ name           │         │
│ image_url      │     │ slug           │         │
│ sort_order     │     │ description    │         │
│ is_active      │     │ price          │         │
└────────────────┘     │ compare_price  │         │
                       │ sku            │         │
                       │ stock_quantity │         │
                       │ weight         │         │
                       │ status         │         │
                       │ rating         │         │
                       │ sold_count     │         │
                       │ view_count     │         │
                       │ created_at     │         │
                       └────────────────┘         │
                               │                  │
          ┌────────────────────┼──────────────────┘
          │                    │
          ▼                    ▼
┌────────────────┐     ┌────────────────┐
│ product_images │     │ product_variants
├────────────────┤     ├────────────────┤
│ id (PK)        │     │ id (PK)        │
│ product_id(FK) │     │ product_id(FK) │
│ url            │     │ variant_name   │
│ alt_text       │     │ sku            │
│ sort_order     │     │ price_adjust   │
│ is_primary     │     │ stock_quantity │
└────────────────┘     │ image_url      │
                       └────────────────┘

┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│     carts      │     │  cart_items    │     │     orders     │
├────────────────┤     ├────────────────┤     ├────────────────┤
│ id (PK)        │────<│ id (PK)        │     │ id (PK)        │
│ user_id (FK)   │     │ cart_id (FK)   │     │ user_id (FK)   │
│ session_id     │     │ product_id(FK) │     │ shop_id (FK)   │
│ created_at     │     │ variant_id(FK) │     │ order_number   │
└────────────────┘     │ quantity       │     │ status         │
                       │ price_at_time  │     │ payment_status │
                       └────────────────┘     │ total_amount   │
                                             │ shipping_fee   │
                                             │ discount       │
                                             │ final_amount   │
                                             │ shipping_addr  │
                                             │ tracking_no    │
                                             │ note           │
                                             │ created_at     │
                                             └────────────────┘
                                                      │
                       ┌──────────────────────────────┘
                       │
                       ▼
             ┌────────────────┐     ┌────────────────┐
             │  order_items   │     │    payments    │
             ├────────────────┤     ├────────────────┤
             │ id (PK)        │     │ id (PK)        │
             │ order_id (FK)  │     │ order_id (FK)  │
             │ product_id(FK) │     │ method         │
             │ variant_id(FK) │     │ amount         │
             │ product_name   │     │ status         │
             │ variant_name   │     │ transaction_id │
             │ price          │     │ paid_at        │
             │ quantity       │     │ failure_reason │
             │ subtotal       │     │ metadata       │
             └────────────────┘     │ created_at     │
                                    └────────────────┘

┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│    reviews     │     │    coupons     │     │ notifications  │
├────────────────┤     ├────────────────┤     ├────────────────┤
│ id (PK)        │     │ id (PK)        │     │ id (PK)        │
│ product_id(FK) │     │ code           │     │ user_id (FK)   │
│ user_id (FK)   │     │ type           │     │ type           │
│ order_id (FK)  │     │ value          │     │ title          │
│ rating         │     │ min_order      │     │ message        │
│ comment        │     │ max_discount   │     │ data           │
│ images         │     │ usage_limit    │     │ is_read        │
│ is_verified    │     │ used_count     │     │ read_at        │
│ seller_reply   │     │ start_date     │     │ created_at     │
│ created_at     │     │ end_date       │     └────────────────┘
└────────────────┘     │ is_active      │
                       └────────────────┘
```

---

## 3.2 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USER MODULE ====================

enum UserRole {
  CUSTOMER
  SELLER
  ADMIN
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  fullName      String    @map("full_name")
  phone         String?
  avatarUrl     String?   @map("avatar_url")
  role          UserRole  @default(CUSTOMER)
  isActive      Boolean   @default(true) @map("is_active")
  emailVerified DateTime? @map("email_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  addresses     Address[]
  seller        Seller?
  carts         Cart[]
  orders        Order[]
  reviews       Review[]
  wishlist      WishlistItem[]
  notifications Notification[]

  @@map("users")
}

model Address {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  type         String   // SHIPPING, BILLING
  fullName     String   @map("full_name")
  phone        String
  addressLine1 String   @map("address_line_1")
  addressLine2 String?  @map("address_line_2")
  province     String
  district     String
  subDistrict  String   @map("sub_district")
  postalCode   String   @map("postal_code")
  isDefault    Boolean  @default(false) @map("is_default")
  createdAt    DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("addresses")
}

// ==================== SELLER MODULE ====================

enum SellerStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

model Seller {
  id          String       @id @default(uuid())
  userId      String       @unique @map("user_id")
  idCardNumber String      @map("id_card_number")
  bankAccount String       @map("bank_account")
  bankName    String       @map("bank_name")
  status      SellerStatus @default(PENDING)
  verifiedAt  DateTime?    @map("verified_at")
  rejectedReason String?   @map("rejected_reason")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  // Relations
  user  User   @relation(fields: [userId], references: [id])
  shop  Shop?

  @@map("sellers")
}

model Shop {
  id          String     @id @default(uuid())
  sellerId    String     @unique @map("seller_id")
  name        String
  slug        String     @unique
  description String?
  logoUrl     String?    @map("logo_url")
  bannerUrl   String?    @map("banner_url")
  status      String     @default("ACTIVE") // ACTIVE, SUSPENDED
  rating      Float      @default(0)
  reviewCount Int        @default(0) @map("review_count")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  // Relations
  seller   Seller    @relation(fields: [sellerId], references: [id])
  products Product[]
  orders   Order[]

  @@map("shops")
}

// ==================== PRODUCT MODULE ====================

model Category {
  id          String    @id @default(uuid())
  parentId    String?   @map("parent_id")
  name        String
  slug        String    @unique
  description String?
  imageUrl    String?   @map("image_url")
  sortOrder   Int       @default(0) @map("sort_order")
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")

  // Relations
  parent   Category?  @relation("CategoryChildren", fields: [parentId], references: [id])
  children Category[] @relation("CategoryChildren")
  products Product[]

  @@map("categories")
}

enum ProductStatus {
  DRAFT
  ACTIVE
  OUT_OF_STOCK
  INACTIVE
}

model Product {
  id            String        @id @default(uuid())
  shopId        String        @map("shop_id")
  categoryId    String        @map("category_id")
  name          String
  slug          String        @unique
  description   String        @db.Text
  price         Decimal       @db.Decimal(10, 2)
  comparePrice  Decimal?      @map("compare_price") @db.Decimal(10, 2)
  sku           String?
  stockQuantity Int           @default(0) @map("stock_quantity")
  weight        Float         // in grams
  status        ProductStatus @default(DRAFT)
  rating        Float         @default(0)
  reviewCount   Int           @default(0) @map("review_count")
  soldCount     Int           @default(0) @map("sold_count")
  viewCount     Int           @default(0) @map("view_count")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  // Relations
  shop     Shop            @relation(fields: [shopId], references: [id])
  category Category        @relation(fields: [categoryId], references: [id])
  images   ProductImage[]
  variants ProductVariant[]
  reviews  Review[]
  cartItems CartItem[]
  orderItems OrderItem[]
  wishlistItems WishlistItem[]

  @@map("products")
}

model ProductImage {
  id        String  @id @default(uuid())
  productId String  @map("product_id")
  url       String
  altText   String? @map("alt_text")
  sortOrder Int     @default(0) @map("sort_order")
  isPrimary Boolean @default(false) @map("is_primary")

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}

model ProductVariant {
  id            String @id @default(uuid())
  productId     String @map("product_id")
  variantName   String @map("variant_name") // e.g., "Red - Size L"
  sku           String
  priceAdjust   Decimal @default(0) @map("price_adjust") @db.Decimal(10, 2)
  stockQuantity Int     @default(0) @map("stock_quantity")
  imageUrl      String? @map("image_url")

  product   Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  cartItems CartItem[]
  orderItems OrderItem[]

  @@map("product_variants")
}

// ==================== ORDER MODULE ====================

enum OrderStatus {
  PENDING_PAYMENT
  PENDING_CONFIRM
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  COMPLETED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model Cart {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id")
  sessionId String?  @map("session_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user  User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]

  @@map("carts")
}

model CartItem {
  id          String @id @default(uuid())
  cartId      String @map("cart_id")
  productId   String @map("product_id")
  variantId   String? @map("variant_id")
  quantity    Int
  priceAtTime Decimal @map("price_at_time") @db.Decimal(10, 2)

  cart    Cart            @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product         @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])

  @@unique([cartId, productId, variantId])
  @@map("cart_items")
}

model Order {
  id            String        @id @default(uuid())
  userId        String        @map("user_id")
  shopId        String        @map("shop_id")
  orderNumber   String        @unique @map("order_number")
  status        OrderStatus   @default(PENDING_PAYMENT)
  paymentStatus PaymentStatus @default(PENDING) @map("payment_status")
  
  // Amounts
  subtotal      Decimal       @db.Decimal(10, 2)
  shippingFee   Decimal       @map("shipping_fee") @db.Decimal(10, 2)
  discount      Decimal       @default(0) @db.Decimal(10, 2)
  totalAmount   Decimal       @map("total_amount") @db.Decimal(10, 2)
  
  // Shipping
  shippingAddress Json        @map("shipping_address")
  trackingNumber  String?     @map("tracking_number")
  shippedAt       DateTime?   @map("shipped_at")
  deliveredAt     DateTime?   @map("delivered_at")
  
  note          String?
  cancelledReason String?     @map("cancelled_reason")
  cancelledAt   DateTime?     @map("cancelled_at")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  // Relations
  user     User        @relation(fields: [userId], references: [id])
  shop     Shop        @relation(fields: [shopId], references: [id])
  items    OrderItem[]
  payment  Payment?
  review   Review?

  @@map("orders")
}

model OrderItem {
  id           String  @id @default(uuid())
  orderId      String  @map("order_id")
  productId    String  @map("product_id")
  variantId    String? @map("variant_id")
  productName  String  @map("product_name")
  variantName  String? @map("variant_name")
  productImage String? @map("product_image")
  price        Decimal @db.Decimal(10, 2)
  quantity     Int
  subtotal     Decimal @db.Decimal(10, 2)

  order   Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product         @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])

  @@map("order_items")
}

model Payment {
  id            String        @id @default(uuid())
  orderId       String        @unique @map("order_id")
  method        String        // CREDIT_CARD, PROMPTPAY, TRUEMONEY, BANK_TRANSFER
  amount        Decimal       @db.Decimal(10, 2)
  status        PaymentStatus @default(PENDING)
  transactionId String?       @map("transaction_id")
  paidAt        DateTime?     @map("paid_at")
  failureReason String?       @map("failure_reason")
  metadata      Json?
  createdAt     DateTime      @default(now()) @map("created_at")

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@map("payments")
}

// ==================== REVIEW MODULE ====================

model Review {
  id          String   @id @default(uuid())
  productId   String   @map("product_id")
  userId      String   @map("user_id")
  orderId     String   @unique @map("order_id")
  rating      Int      // 1-5
  comment     String?  @db.Text
  images      String[]
  isVerified  Boolean  @default(true) @map("is_verified")
  sellerReply String?  @map("seller_reply") @db.Text
  repliedAt   DateTime? @map("replied_at")
  createdAt   DateTime @default(now()) @map("created_at")

  product Product @relation(fields: [productId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
  order   Order   @relation(fields: [orderId], references: [id])

  @@map("reviews")
}

// ==================== WISHLIST MODULE ====================

model WishlistItem {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  productId String   @map("product_id")
  createdAt DateTime @default(now()) @map("created_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@map("wishlist_items")
}

// ==================== COUPON MODULE ====================

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
}

model Coupon {
  id           String     @id @default(uuid())
  code         String     @unique
  type         CouponType
  value        Decimal    @db.Decimal(10, 2)
  minOrder     Decimal?   @map("min_order") @db.Decimal(10, 2)
  maxDiscount  Decimal?   @map("max_discount") @db.Decimal(10, 2)
  usageLimit   Int?       @map("usage_limit")
  usedCount    Int        @default(0) @map("used_count")
  userLimit    Int        @default(1) @map("user_limit") // per user
  startDate    DateTime   @map("start_date")
  endDate      DateTime   @map("end_date")
  isActive     Boolean    @default(true) @map("is_active")
  createdAt    DateTime   @default(now()) @map("created_at")

  @@map("coupons")
}

// ==================== NOTIFICATION MODULE ====================

model Notification {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  type      String   // ORDER, PROMOTION, SYSTEM
  title     String
  message   String
  data      Json?    // additional payload
  isRead    Boolean  @default(false) @map("is_read")
  readAt    DateTime? @map("read_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}

// ==================== AUDIT LOG ====================

model AuditLog {
  id         String   @id @default(uuid())
  userId     String?  @map("user_id")
  action     String   // CREATE, UPDATE, DELETE, LOGIN, etc.
  entityType String   @map("entity_type")
  entityId   String?  @map("entity_id")
  oldData    Json?    @map("old_data")
  newData    Json?    @map("new_data")
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  @@map("audit_logs")
}
```

---

## 3.3 Indexes (Performance Optimization)

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Product indexes
CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('thai', name || ' ' || COALESCE(description, '')));

-- Order indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_shop ON orders(shop_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Review indexes
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
```
