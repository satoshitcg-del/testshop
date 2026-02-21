# 🚀 8. Deployment Guide (คู่มือการ Deploy)

## 8.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Cloudflare                           │
│              (CDN, DNS, SSL, DDoS Protection)               │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      Vercel                                 │
│              Next.js Frontend + API Routes                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Supabase    │ │    Redis     │ │    Meili     │
│ PostgreSQL   │ │   Upstash    │ │   Search     │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 8.2 Environment Variables

### Frontend (.env.local)
```bash
# App
NEXT_PUBLIC_APP_URL=https://yourshop.com
NEXT_PUBLIC_API_URL=https://yourshop.com/api

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
NEXT_PUBLIC_LINE_CHANNEL_ID=xxx

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_OMISE_PUBLIC_KEY=pkey_live_xxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=xxx
```

### Backend (.env)
```bash
# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourshop.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
DIRECT_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret

# Redis
REDIS_URL=rediss://default:pass@host:6379

# Storage (AWS S3 or Cloudflare R2)
S3_BUCKET=your-bucket
S3_REGION=ap-southeast-1
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com

# Payment
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
OMISE_SECRET_KEY=skey_live_xxx

# Email (Resend/SendGrid)
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@yourshop.com

# Search
MEILISEARCH_HOST=https://search.yourshop.com
MEILISEARCH_API_KEY=xxx
```

---

## 8.3 Database Setup (Supabase)

### 1. Create Project
```bash
# Via Supabase Dashboard
1. Go to https://supabase.com
2. Create new project
3. Choose region: Singapore (closest to Thailand)
4. Save database password securely
```

### 2. Connection String
```bash
# Get connection string from Settings > Database
# Use connection pooling for serverless
DATABASE_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
```

### 3. Run Migrations
```bash
# Local
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### 4. Enable Extensions
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
```

---

## 8.4 Vercel Deployment

### 1. Connect Repository
```bash
# Via Vercel Dashboard
1. Import GitHub repository
2. Framework Preset: Next.js
3. Root Directory: ./frontend
```

### 2. Build Settings
```json
{
  "buildCommand": "prisma generate && next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 3. Environment Variables
Add all env vars in Vercel Dashboard > Settings > Environment Variables

### 4. Vercel.json Config
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

---

## 8.5 Redis Setup (Upstash)

### 1. Create Database
```bash
# Via Upstash Console
1. Go to https://upstash.com
2. Create new Redis database
3. Choose region: Singapore
4. Enable TLS/SSL
```

### 2. Get Connection URL
```bash
# Copy Redis URL from console
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
```

---

## 8.6 Image Storage (Cloudflare R2)

### 1. Create Bucket
```bash
# Via Cloudflare Dashboard
1. Go to R2 > Create bucket
2. Name: yourshop-images
3. Set public access (if needed)
```

### 2. CORS Configuration
```json
[
  {
    "AllowedOrigins": ["https://yourshop.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### 3. API Token
```bash
# Create API token with R2 access
# Permissions: Object Read & Write
```

---

## 8.7 SSL & Domain

### Cloudflare DNS Setup
```
Type    Name            Value                   TTL
A       @               Vercel_IP               Auto
A       www             Vercel_IP               Auto
CNAME   api             cname.vercel-dns.com    Auto
CNAME   search          search-domain.com       Auto
```

### SSL/TLS Settings
```
Overview:
- SSL/TLS encryption mode: Full (strict)

Edge Certificates:
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON
- Minimum TLS Version: 1.2
```

---

## 8.8 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Type check
        run: npm run type-check
        
      - name: Lint
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 8.9 Backup Strategy

### Database Backup
```bash
# Automated via Supabase
- Daily backups (retained 7 days)
- Point-in-time recovery (7 days)

# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### File Backup
```bash
# R2 bucket versioning
- Enable versioning on bucket
- Lifecycle rules for old versions
```

---

## 8.10 Monitoring & Alerts

### Vercel Analytics
```
- Enable in Dashboard
- Track Core Web Vitals
- Monitor API latency
```

### Sentry Error Tracking
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
```

### Uptime Monitoring
```
Services:
- UptimeRobot (free tier)
- Pingdom
- Better Uptime

Alerts to:
- Email
- Slack
- Telegram
```

---

## 8.11 Security Checklist

### Pre-launch
- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all APIs
- [ ] SQL injection prevention (Prisma safe)
- [ ] XSS protection (Next.js handles most)
- [ ] CSRF protection
- [ ] Secure cookies (httpOnly, secure, sameSite)
- [ ] Content Security Policy headers

### Authentication
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens with expiration
- [ ] Refresh token rotation
- [ ] Failed login rate limiting
- [ ] Account lockout after attempts

### Data Protection
- [ ] Database encrypted at rest
- [ ] Backups encrypted
- [ ] PII data handling compliant
- [ ] GDPR/CCPA compliance review

---

## 8.12 Post-Deployment Verification

### Smoke Tests
```bash
# 1. Homepage loads
curl -s -o /dev/null -w "%{http_code}" https://yourshop.com

# 2. API health check
curl https://yourshop.com/api/health

# 3. Product list loads
curl https://yourshop.com/api/products

# 4. Authentication works
# Test login flow manually

# 5. Payment flow
# Test with Stripe test card
```

### Performance Checks
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

### Security Headers Check
```bash
curl -I https://yourshop.com | grep -i "x-\|content-security"
```

---

## 8.13 Rollback Plan

### Database Rollback
```bash
# If migration fails
npx prisma migrate resolve --rolled-back "migration_name"

# Restore from backup
psql $DATABASE_URL < backup_YYYYMMDD.sql
```

### Code Rollback
```bash
# Vercel rollback
# Dashboard > Deployments > Select previous > Promote to Production

# Or via CLI
vercel --rollback
```

---

## 8.14 Test/Preview Environment (สำหรับเว็บทดสอบ)

### Payment (Test Mode เท่านั้น)
- ใช้ Stripe Test Keys (`pk_test_...`, `sk_test_...`)
- ห้ามใช้ live keys ในเว็บทดสอบ

### Database สำหรับทดสอบ
- ใช้ Supabase หรือ Postgres local
- แนะนำสร้าง DB แยกสำหรับ test

### Quick Smoke Tests
- สมัคร/เข้าสู่ระบบได้
- โหลด `/products` ได้
- เพิ่มสินค้าเข้าตะกร้าได้
- Checkout แบบทดสอบได้
