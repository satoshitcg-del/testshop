# 🕷️ Crawlee Assistant Skill

OpenClaw Skill สำหรับสร้าง web crawlers และ browser automation ด้วย Crawlee Python

---

## 📦 เกี่ยวกับ Crawlee

Crawlee คือ Python library สำหรับ:
- 🕸️ **Web Scraping** — ดึงข้อมูลจากเว็บไซต์
- 🎭 **Browser Automation** — ควบคุม browser (Playwright)
- 🤖 **Bot Protection Bypass** — หลบ detection
- 🔄 **Proxy Rotation** — สลับ proxy อัตโนมัติ

---

## 📁 โครงสร้าง Skill

```
crawlee-assistant/
├── SKILL.md                         # คู่มือการใช้งานครบถ้วน
├── templates/                       # Starter templates
│   ├── basic_crawler.py            #  crawler พื้นฐาน
│   ├── ecommerce_scraper.py        #  scraper ร้านค้า
│   ├── api_scraper.py              #  API scraping
│   └── playwright_automation.py    #  Browser automation
└── README.md                        # ไฟล์นี้
```

---

## 🚀 การติดตั้ง

```bash
# ติดตั้ง Crawlee
pip install 'crawlee[all]'

# ติดตั้ง Playwright
playwright install
```

---

## 📖 วิธีใช้

### ผ่าน OpenClaw

```
"ช่วยสร้าง crawler ดึงข้อมูลจาก https://example.com"
"เขียน scraper สำหรับ e-commerce site"
"สร้าง bot ที่ใช้ Playwright automation"
"แนะนำวิธี handle pagination ด้วย Crawlee"
```

### ใช้ Templates โดยตรง

```bash
# Basic crawler
python templates/basic_crawler.py https://example.com

# E-commerce scraper
python templates/ecommerce_scraper.py https://shop.example.com

# API scraper
python templates/api_scraper.py https://api.example.com/items

# Playwright automation
python templates/playwright_automation.py https://spa.example.com
```

---

## 🎯 Crawler Types

| Type | เหมาะกับ | ไฟล์ |
|------|---------|------|
| **BeautifulSoupCrawler** | Static HTML | basic_crawler.py |
| **PlaywrightCrawler** | JavaScript-heavy sites | playwright_automation.py |
| **HttpCrawler** | APIs | api_scraper.py |
| **ParselCrawler** | XPath/CSS selectors | - |

---

## 💡 ตัวอย่าง Use Cases

### 1. Scrape ข่าว/บทความ
```python
from crawlee.beautifulsoup_crawler import BeautifulSoupCrawler

crawler = BeautifulSoupCrawler()
# Extract: title, content, author, publish_date
```

### 2. Scrape สินค้า E-commerce
```python
# Extract: name, price, description, images, SKU
# Handle: pagination, product variations
```

### 3. Scrape Social Media (ที่เปิดเผย)
```python
# Extract: posts, timestamps, engagement metrics
```

### 4. Monitor Price Changes
```python
# Run scheduled crawler
# Compare prices, alert on changes
```

### 5. Lead Generation
```python
# Extract: company info, contact details
```

---

## ⚠️ ข้อควรระวัง

**ใช้งานอย่างถูกต้อง:**
- ✅ เคารพ robots.txt
- ✅ อ่าน Terms of Service ของเว็บไซต์
- ✅ ไม่ scrape ข้อมูลส่วนบุคคล
- ✅ ใช้ rate limiting ที่เหมาะสม

---

## 🔗 References

- Crawlee Docs: https://crawlee.dev/python/
- GitHub: https://github.com/apify/crawlee-python
- Playwright: https://playwright.dev/python/

---

*สร้างเมื่อ: 2026-02-23*  
*สำหรับ: OpenClaw Agent*
