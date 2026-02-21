# 🎨 5. Frontend Design (ออกแบบหน้าบ้าน)

> หมายเหตุ: สำหรับเว็บทดสอบ ให้โฟกัสเฉพาะ Customer flow เท่านั้น (Seller/Admin เป็น optional ภายหลัง)

## 5.1 Project Structure (Next.js App Router)

```
frontend/
├── app/                          # App Router (Next.js 14+)
│   ├── (auth)/                   # Auth Group (no layout)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── layout.tsx            # Auth layout (no navbar)
│   ├── (shop)/                   # Main Shop Group
│   │   ├── page.tsx              # Home Page
│   │   ├── products/
│   │   ├── categories/
│   │   ├── shops/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── wishlist/
│   │   ├── profile/
│   │   └── layout.tsx            # Main layout with navbar/footer
│   ├── (seller)/                 # Seller Portal
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── layout.tsx            # Seller layout with sidebar
│   ├── (admin)/                  # Admin Dashboard
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── sellers/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── categories/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── layout.tsx            # Admin layout
│   ├── api/                      # API Routes
│   ├── layout.tsx                # Root layout
│   ├── globals.css
│   └── loading.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── common/                   # Shared components
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── breadcrumb/
│   │   ├── pagination/
│   │   ├── search-bar/
│   │   └── loading-skeleton/
│   ├── product/                  # Product components
│   │   ├── product-card/
│   │   ├── product-grid/
│   │   ├── product-gallery/
│   │   ├── product-info/
│   │   ├── product-reviews/
│   │   ├── product-variants/
│   │   └── add-to-cart-button/
│   ├── cart/                     # Cart components
│   │   ├── cart-drawer/
│   │   ├── cart-item/
│   │   ├── cart-summary/
│   │   └── quantity-selector/
│   ├── checkout/                 # Checkout components
│   │   ├── address-form/
│   │   ├── payment-methods/
│   │   ├── order-summary/
│   │   └── checkout-steps/
│   └── forms/                    # Form components
│       ├── login-form/
│       ├── register-form/
│       └── address-form/
│
├── hooks/                        # Custom React Hooks
│   ├── use-auth.ts
│   ├── use-cart.ts
│   ├── use-products.ts
│   ├── use-orders.ts
│   └── use-media-query.ts
│
├── lib/                          # Utilities
│   ├── api.ts                    # API client
│   ├── utils.ts                  # Helper functions
│   ├── constants.ts              # App constants
│   └── validations.ts            # Zod schemas
│
├── stores/                       # State Management (Zustand)
│   ├── auth-store.ts
│   ├── cart-store.ts
│   └── ui-store.ts
│
├── types/                        # TypeScript Types
│   ├── user.ts
│   ├── product.ts
│   ├── order.ts
│   └── api.ts
│
├── public/                       # Static assets
│   ├── images/
│   └── fonts/
│
├── styles/
│   └── tailwind.config.ts
│
├── middleware.ts                 # Next.js middleware
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 5.2 Page Routes & Components

### 🏠 Customer Pages

#### 1. Home Page (`/`)
```typescript
// Components:
- HeroBanner          // แบนเนอร์ใหญ่หน้าแรก
- CategoryGrid        // หมวดหมู่สินค้า
- FeaturedProducts    // สินค้าแนะนำ
- NewArrivals         // สินค้ามาใหม่
- BestSellers         // สินค้าขายดี
- PromoBanner         // โปรโมชั่น
- BrandLogos          // แบรนด์ที่ร่วมรายการ
```

#### 2. Product List Page (`/products`)
```typescript
// URL: /products?category=electronics&minPrice=100&sortBy=price
// Components:
- FilterSidebar       // ตัวกรองด้านซ้าย
  ├── PriceRange
  ├── CategoryList
  ├── RatingFilter
  └── BrandFilter
- ProductGrid         // แสดงสินค้าแบบ Grid
- SortDropdown        // เรียงลำดับ
- Pagination          // แบ่งหน้า
- ActiveFilters       // แสดงตัวกรองที่เลือก
```

#### 3. Product Detail Page (`/products/:slug`)
```typescript
// Components:
- ProductGallery      // รูปภาพสินค้า (Zoom + Thumbnails)
- ProductInfo         // ข้อมูลสินค้า
  ├── ProductTitle
  ├── PriceDisplay
  ├── RatingSummary
  └── StockStatus
- VariantSelector     // เลือกสี/ไซส์
- QuantitySelector    // เลือกจำนวน
- AddToCartButton     // ปุ่มเพิ่มลงตะกร้า
- BuyNowButton        // ปุ่มซื้อเลย
- ProductTabs         // รายละเอียด/รีวิว/สเปค
  ├── DescriptionTab
  ├── SpecificationsTab
  └── ReviewsTab
- RelatedProducts     // สินค้าที่เกี่ยวข้อง
- RecentlyViewed      // ดูล่าสุด
```

#### 4. Cart Page (`/cart`)
```typescript
// Components:
- CartItemList        // รายการสินค้าในตะกร้า
  ├── CartItemCard    // การ์ดสินค้า
  ├── QuantityUpdate  // อัปเดตจำนวน
  └── RemoveButton    // ลบสินค้า
- CartSummary         // สรุปราคา
  ├── Subtotal
  ├── ShippingEstimate
  ├── CouponInput     // ใส่โค้ดส่วนลด
  └── Total
- EmptyCart           // ตะกร้าว่าง
- SaveForLater        // บันทึกไว้ภายหลัง
```

#### 5. Checkout Page (`/checkout`)
```typescript
// Steps: Shipping → Payment → Review → Confirmation
// Components:
- CheckoutSteps       // แสดงขั้นตอน
- ShippingForm        // ที่อยู่จัดส่ง
  ├── AddressSelect   // เลือกจากที่เคยใช้
  └── NewAddressForm  // เพิ่มที่อยู่ใหม่
- PaymentMethods      // วิธีชำระเงิน
  ├── CreditCardForm
  ├── PromptPayQR
  └── TrueMoney
- OrderSummary        // สรุปคำสั่งซื้อ
- PlaceOrderButton    // ยืนยันคำสั่งซื้อ
```

#### 6. Order History (`/orders`)
```typescript
// Components:
- OrderTabs           // แท็บตามสถานะ
  ├── All
  ├── ToPay
  ├── ToShip
  ├── ToReceive
  └── Completed
- OrderCard           // การ์ดแสดงออเดอร์
  ├── OrderHeader     // รหัส, วันที่, สถานะ
  ├── OrderItems      // รายการสินค้า
  └── OrderActions    // ชำระเงิน/ติดตาม/ยกเลิก
```

---

## 5.2.1 Test/MVP Pages (ใช้จริงในเว็บทดสอบ)
- `/` Home
- `/products` Product List
- `/products/:slug` Product Detail
- `/cart` Cart
- `/checkout` Checkout
- `/orders` Order History
- `/login` / `/register`

---

### 🏪 Seller Portal Pages

#### 1. Seller Dashboard (`/seller/dashboard`)
```typescript
// Components:
- StatsCards          // สถิติสรุป
  ├── TotalSales
  ├── TotalOrders
  ├── TotalProducts
  └── TotalCustomers
- SalesChart          // กราฟยอดขาย
- RecentOrders        // ออเดอร์ล่าสุด
- TopProducts         // สินค้าขายดี
- LowStockAlert       // แจ้งเตือนสต็อกต่ำ
```

#### 2. Product Management (`/seller/products`)
```typescript
// Components:
- ProductTable        // ตารางสินค้า
  ├── ProductRow      // แถวสินค้า
  ├── StatusBadge     // สถานะ
  └── ActionButtons   // แก้ไข/ลบ
- BulkActions         // จัดการหลายรายการ
- ProductFilters      // กรองสินค้า
- AddProductButton    // ปุ่มเพิ่มสินค้า

// Product Form Modal:
- ProductBasicInfo    // ข้อมูลพื้นฐาน
- ProductImages       // อัปโหลดรูปภาพ
- ProductVariants     // ตัวเลือกสินค้า
- ProductPricing      // ราคา
- ProductInventory    // สต็อก
- ProductSEO          // SEO
```

#### 3. Order Management (`/seller/orders`)
```typescript
// Components:
- OrderTable          // ตารางคำสั่งซื้อ
- OrderFilters        // กรองตามสถานะ/วันที่
- OrderDetailModal    // ดูรายละเอียด
- StatusUpdate        // อัปเดตสถานะ
- PrintInvoice        // พิมพ์ใบเสร็จ
```

---

### ⚙️ Admin Dashboard Pages

#### 1. Admin Dashboard (`/admin/dashboard`)
```typescript
// Components:
- SystemStats         // สถิติระบบ
  ├── TotalUsers
  ├── TotalSellers
  ├── TotalOrders
  └── TotalRevenue
- RevenueChart        // กราฟรายได้
- UserGrowthChart     // กราฟผู้ใช้
- RecentActivities    // กิจกรรมล่าสุด
- PendingApprovals    // รายการรออนุมัติ
```

#### 2. User Management (`/admin/users`)
```typescript
// Components:
- UserTable           // ตารางผู้ใช้
- UserFilters         // กรองตาม role/status
- UserDetailModal     // รายละเอียดผู้ใช้
- BanUserButton       // ระงับบัญชี
```

---

## 5.3 Component Specifications

### Product Card
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
    badge?: 'new' | 'sale' | 'bestseller';
  };
  variant?: 'default' | 'compact' | 'horizontal';
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}
```

### Filter Sidebar
```typescript
interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  brands: string[];
  inStock: boolean;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
}
```

---

## 5.4 Key UI Components (shadcn/ui)

```bash
# Install required components
npx shadcn add button
npx shadcn add input
npx shadcn add label
npx shadcn add select
npx shadcn add checkbox
npx shadcn add radio-group
npx shadcn add slider
npx shadcn add tabs
npx shadcn add dialog
npx shadcn add dropdown-menu
npx shadcn add sheet
npx shadcn add toast
npx shadcn add skeleton
npx shadcn add badge
npx shadcn add avatar
npx shadcn add card
npx shadcn add table
npx shadcn add pagination
npx shadcn add breadcrumb
npx shadcn add accordion
npx shadcn add carousel
npx shadcn add calendar
npx shadcn add popover
npx shadcn add separator
npx shadcn add switch
npx shadcn add textarea
npx shadcn add tooltip
```

---

## 5.5 Responsive Breakpoints

```typescript
// Tailwind Config
screens: {
  'xs': '475px',     // Mobile
  'sm': '640px',     // Large Mobile
  'md': '768px',     // Tablet
  'lg': '1024px',    // Laptop
  'xl': '1280px',    // Desktop
  '2xl': '1536px',   // Large Desktop
}

// Mobile-first approach
- Grid: 1 col (mobile) → 2 cols (sm) → 3 cols (md) → 4 cols (lg) → 5 cols (xl)
- Navigation: Hamburger (mobile) → Full navbar (md+)
- Filter: Drawer (mobile) → Sidebar (lg+)
- Cart: Full width (mobile) → Side drawer (md+)
```

---

## 5.6 Key Features Implementation

### 1. Infinite Scroll Products
```typescript
// hooks/use-products.ts
export function useProducts(filters: FilterState) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
```

### 2. Cart State (Zustand + Persist)
```typescript
// stores/cart-store.ts
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
```

### 3. Image Optimization
```typescript
// components/product-image.tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL={product.blurDataUrl}
/>
```
