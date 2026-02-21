# ⚙️ 6. Backend Design (ออกแบบหลังบ้าน)

## 6.1 Project Structure

```
backend/
├── src/
│   ├── config/                   # Configuration
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── passport.ts
│   │   └── env.ts
│   │
│   ├── modules/                  # Feature Modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schema.ts    # Zod validation
│   │   │   ├── auth.middleware.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.types.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── product.schema.ts
│   │   │   └── product.types.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── order.schema.ts
│   │   │   └── order.types.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── payment.gateway.ts  # Stripe/Omise integration
│   │   │
│   │   ├── sellers/
│   │   ├── shops/
│   │   ├── categories/
│   │   ├── reviews/
│   │   ├── cart/
│   │   ├── notifications/
│   │   └── admin/
│   │
│   ├── shared/                   # Shared utilities
│   │   ├── prisma.ts             # Database client
│   │   ├── redis.ts              # Redis client
│   │   ├── logger.ts
│   │   ├── errors/
│   │   │   ├── app-error.ts
│   │   │   ├── error-handler.ts
│   │   │   └── error-codes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   └── utils/
│   │       ├── password.ts
│   │       ├── token.ts
│   │       ├── slugify.ts
│   │       └── pagination.ts
│   │
│   ├── jobs/                     # Background Jobs
│   │   ├── email.queue.ts
│   │   ├── notification.queue.ts
│   │   └── order.queue.ts
│   │
│   ├── websockets/               # Real-time
│   │   ├── socket.ts
│   │   ├── handlers/
│   │   │   ├── order.handler.ts
│   │   │   ├── chat.handler.ts
│   │   │   └── notification.handler.ts
│   │   └── middleware/
│   │       └── auth.socket.ts
│   │
│   ├── types/                    # Global types
│   │   ├── express.d.ts
│   │   └── common.ts
│   │
│   └── app.ts                    # Express app setup
│   └── server.ts                 # Server entry
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 6.2 Core Services Implementation

### Authentication Service
```typescript
// modules/auth/auth.service.ts
export class AuthService {
  async register(data: RegisterInput) {
    // 1. Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existingUser) throw new ConflictError('Email already exists');

    // 2. Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone,
      }
    });

    // 4. Generate tokens
    const tokens = this.generateTokens(user.id);

    // 5. Store refresh token hash in Redis
    await redis.setex(
      `refresh:${user.id}`,
      7 * 24 * 60 * 60, // 7 days
      tokens.refreshToken
    );

    return { user, tokens };
  }

  async login(email: string, password: string) {
    // 1. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError('Invalid credentials');

    // 2. Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    // 3. Check if active
    if (!user.isActive) throw new ForbiddenError('Account disabled');

    // 4. Generate tokens
    const tokens = this.generateTokens(user.id);

    // 5. Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return { user, tokens };
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}
```

### Product Service
```typescript
// modules/products/product.service.ts
export class ProductService {
  async findAll(filters: ProductFilters) {
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.shopId && { shopId: filters.shopId }),
      ...(filters.minPrice && { price: { gte: filters.minPrice } }),
      ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ]
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { take: 1 },
          shop: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true } },
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: this.getOrderBy(filters.sortBy),
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            rating: true,
          }
        },
        category: true,
        reviews: {
          take: 5,
          include: { user: { select: { fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) throw new NotFoundError('Product not found');

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    });

    return product;
  }

  private getOrderBy(sortBy?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case 'price_asc': return { price: 'asc' };
      case 'price_desc': return { price: 'desc' };
      case 'newest': return { createdAt: 'desc' };
      case 'popular': return { soldCount: 'desc' };
      case 'rating': return { rating: 'desc' };
      default: return { createdAt: 'desc' };
    }
  }
}
```

### Order Service
```typescript
// modules/orders/order.service.ts
export class OrderService {
  async create(userId: string, data: CreateOrderInput) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get cart items
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            }
          }
        }
      });

      if (!cart?.items.length) {
        throw new BadRequestError('Cart is empty');
      }

      // 2. Validate stock
      for (const item of cart.items) {
        const stock = item.variant?.stockQuantity ?? item.product.stockQuantity;
        if (stock < item.quantity) {
          throw new BadRequestError(
            `Insufficient stock for ${item.product.name}`
          );
        }
      }

      // 3. Calculate totals
      const subtotal = cart.items.reduce(
        (sum, item) => sum + (item.priceAtTime * item.quantity),
        0
      );
      const shippingFee = await this.calculateShipping(data.address, cart.items);
      const discount = await this.applyCoupon(data.couponCode, subtotal);
      const total = subtotal + shippingFee - discount;

      // 4. Create order
      const order = await tx.order.create({
        data: {
          userId,
          shopId: cart.items[0].product.shopId, // Simplified - group by shop later
          orderNumber: this.generateOrderNumber(),
          subtotal,
          shippingFee,
          discount,
          totalAmount: total,
          shippingAddress: data.address,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product.name,
              variantName: item.variant?.variantName,
              productImage: item.product.images[0]?.url,
              price: item.priceAtTime,
              quantity: item.quantity,
              subtotal: item.priceAtTime * item.quantity,
            }))
          }
        }
      });

      // 5. Update stock
      for (const item of cart.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { decrement: item.quantity } }
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { decrement: item.quantity } }
          });
        }
      }

      // 6. Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      // 7. Queue notification
      await notificationQueue.add('order-created', { orderId: order.id });

      return order;
    });
  }

  private generateOrderNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${date}-${random}`;
  }
}
```

### Payment Service (Stripe Integration)
```typescript
// modules/payments/payment.service.ts
import Stripe from 'stripe';

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }

  async createPaymentIntent(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) throw new NotFoundError('Order not found');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'thb',
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });

    await prisma.payment.create({
      data: {
        orderId,
        method: 'CREDIT_CARD',
        amount: order.totalAmount,
        transactionId: paymentIntent.id,
      }
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(payload: string, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;

    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        }
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'PENDING_CONFIRM',
        }
      })
    ]);

    // Notify seller and customer
    await notificationQueue.add('payment-success', { orderId });
  }
}
```

---

## 6.3 Middleware Stack

```typescript
// app.ts
const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seller', authMiddleware, sellerOnly, sellerRoutes);
app.use('/api/admin', authMiddleware, adminOnly, adminRoutes);

// Webhook (raw body)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Error handling
app.use(errorHandler);
```

---

## 6.4 Background Jobs (BullMQ)

```typescript
// jobs/email.queue.ts
import { Queue, Worker } from 'bullmq';
import { redis } from '../shared/redis';

export const emailQueue = new Queue('emails', { connection: redis });

// Worker
new Worker('emails', async (job) => {
  switch (job.name) {
    case 'welcome':
      await sendWelcomeEmail(job.data);
      break;
    case 'order-confirmation':
      await sendOrderConfirmation(job.data);
      break;
    case 'shipped':
      await sendShippedNotification(job.data);
      break;
  }
}, { connection: redis });

// Usage
await emailQueue.add('welcome', { userId, email }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 }
});
```

---

## 6.5 WebSocket Implementation

```typescript
// websockets/socket.ts
import { Server } from 'socket.io';

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.FRONTEND_URL }
  });

  // Auth middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // Join user room
    socket.join(`user:${socket.userId}`);

    // Order updates
    socket.on('order:subscribe', (orderId) => {
      socket.join(`order:${orderId}`);
    });

    // Chat
    socket.on('chat:join', (roomId) => {
      socket.join(`chat:${roomId}`);
    });

    socket.on('chat:message', async (data) => {
      const message = await saveMessage(data);
      io.to(`chat:${data.roomId}`).emit('chat:message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
}

// Emit notification
export function notifyUser(userId: string, event: string, data: any) {
  io.to(`user:${userId}`).emit(event, data);
}
```
