---
name: crawlee-assistant
description: Web scraping and browser automation assistant using Crawlee Python library. Use when building web crawlers, scraping data from websites, automating browser interactions, extracting structured data, handling pagination, managing proxies, or bypassing bot protection. Supports BeautifulSoupCrawler, PlaywrightCrawler, and HTTP-only crawling. For legitimate data extraction only.
---

# Crawlee Assistant

Build reliable web scrapers and browser automation with Crawlee Python.

---

## 📦 Installation

```bash
# Full installation with all features
pip install 'crawlee[all]'

# Minimal installation
pip install crawlee

# With specific extras
pip install 'crawlee[beautifulsoup]'
pip install 'crawlee[playwright]'
pip install 'crawlee[curl-impersonate]'

# Install Playwright dependencies
playwright install
```

---

## 🚀 Quick Start

### Using CLI Template

```bash
# Create new crawler project
uvx 'crawlee[cli]' create my-crawler

# Or if crawlee installed
crawlee create my-crawler
```

### Basic BeautifulSoup Crawler

```python
import asyncio
from crawlee.beautifulsoup_crawler import BeautifulSoupCrawler, BeautifulSoupCrawlingContext

async def main():
    crawler = BeautifulSoupCrawler()
    
    @crawler.router.default_handler
    async def handler(context: BeautifulSoupCrawlingContext) -> None:
        # Extract data
        title = context.soup.title.text if context.soup.title else None
        
        await context.push_data({
            'url': context.request.url,
            'title': title,
        })
        
        # Follow links
        await context.enqueue_links()

    await crawler.run(['https://example.com'])

if __name__ == '__main__':
    asyncio.run(main())
```

---

## 🎯 Crawler Types

### 1. BeautifulSoupCrawler

**Best for:** Static HTML pages, simple scraping

```python
from crawlee.beautifulsoup_crawler import BeautifulSoupCrawler

crawler = BeautifulSoupCrawler(
    max_requests_per_crawl=100,
)

@crawler.router.default_handler
async def handler(context):
    # Use BeautifulSoup
    title = context.soup.find('h1').text
    links = context.soup.find_all('a', href=True)
    
    await context.push_data({
        'title': title,
        'link_count': len(links),
    })
```

### 2. PlaywrightCrawler

**Best for:** JavaScript-heavy sites, browser automation

```python
from crawlee.playwright_crawler import PlaywrightCrawler, PlaywrightCrawlingContext

crawler = PlaywrightCrawler(
    headless=True,  # or False to see browser
)

@crawler.router.default_handler
async def handler(context: PlaywrightCrawlingContext) -> None:
    # Interact with page
    await context.page.click('button.load-more')
    await context.page.wait_for_selector('.loaded-content')
    
    # Extract data
    title = await context.page.title()
    content = await context.page.content()
    
    await context.push_data({
        'url': context.request.url,
        'title': title,
    })
```

### 3. ParselCrawler

**Best for:** XPath/CSS selectors, high performance

```python
from crawlee.parsel_crawler import ParselCrawler

crawler = ParselCrawler()

@crawler.router.default_handler
async def handler(context):
    # Use Parsel (similar to Scrapy selectors)
    title = context.selector.css('h1::text').get()
    links = context.selector.css('a::attr(href)').getall()
    
    await context.push_data({
        'title': title,
        'links': links,
    })
```

---

## 📊 Data Extraction Patterns

### Single Item Extraction

```python
async def handler(context):
    data = {
        'url': context.request.url,
        'title': context.soup.title.text.strip() if context.soup.title else None,
        'description': context.soup.find('meta', attrs={'name': 'description'})['content'] if context.soup.find('meta', attrs={'name': 'description'}) else None,
        'h1': context.soup.find('h1').text.strip() if context.soup.find('h1') else None,
    }
    await context.push_data(data)
```

### List Extraction

```python
async def handler(context):
    items = []
    for element in context.soup.select('.product-item'):
        items.append({
            'name': element.select_one('.product-name').text.strip(),
            'price': element.select_one('.product-price').text.strip(),
            'link': element.select_one('a')['href'],
        })
    
    await context.push_data({
        'url': context.request.url,
        'products': items,
        'count': len(items),
    })
```

### E-commerce Product Scraping

```python
async def handler(context):
    product = {
        'url': context.request.url,
        'sku': context.soup.select_one('[data-sku]')['data-sku'],
        'name': context.soup.select_one('h1.product-title').text.strip(),
        'price': context.soup.select_one('.price').text.strip(),
        'description': context.soup.select_one('.description').text.strip(),
        'images': [img['src'] for img in context.soup.select('.product-gallery img')],
        'in_stock': 'in-stock' in context.soup.select_one('.stock-status').get('class', []),
    }
    await context.push_data(product)
```

---

## 🔗 Navigation Patterns

### Follow All Links

```python
@crawler.router.default_handler
async def handler(context):
    # Extract data...
    
    # Enqueue all links on the page
    await context.enqueue_links()
```

### Filtered Links

```python
async def handler(context):
    # Only follow product links
    await context.enqueue_links(
        selector='a[href*="/product/"]',
        label='product',
    )
```

### Pagination

```python
async def handler(context):
    # Current page data...
    
    # Find next page
    next_link = context.soup.select_one('a.next-page')
    if next_link:
        await context.enqueue_links(
            selector='a.next-page',
        )
```

### URL Patterns

```python
from crawlee import Request

# Add specific URLs
await context.add_requests([
    Request.from_url('https://example.com/page/1', label='listing'),
    Request.from_url('https://example.com/page/2', label='listing'),
])
```

---

## 🏷️ Request Labels

Use labels for different page types:

```python
@crawler.router.handler('listing')
async def listing_handler(context):
    # Handle category/listing pages
    products = context.soup.select('.product')
    for product in products:
        await context.add_requests([{
            'url': product['href'],
            'label': 'product',
        }])

@crawler.router.handler('product')
async def product_handler(context):
    # Handle product detail pages
    await context.push_data({
        'name': context.soup.select_one('h1').text,
        'price': context.soup.select_one('.price').text,
    })

# Start with listing pages
await crawler.run([
    {'url': 'https://example.com/category/electronics', 'label': 'listing'},
])
```

---

## ⚙️ Configuration

### Basic Configuration

```python
from crawlee import Configuration

config = Configuration(
    # Storage
    persist_storage=True,
    
    # Request handling
    max_request_retries=3,
    max_requests_per_crawl=1000,
    
    # Concurrency
    max_concurrency=10,
    
    # Rate limiting
    request_handler_timeout_seconds=60,
    
    # Proxy
    proxy_configuration=None,  # or ProxyConfiguration(...)
)

crawler = BeautifulSoupCrawler(configuration=config)
```

### Proxy Configuration

```python
from crawlee import ProxyConfiguration

# Rotating proxies
proxy_config = ProxyConfiguration(
    proxy_urls=[
        'http://user:pass@proxy1.example.com:8080',
        'http://user:pass@proxy2.example.com:8080',
    ],
)

crawler = BeautifulSoupCrawler(
    proxy_configuration=proxy_config,
)
```

### User Agents & Headers

```python
crawler = BeautifulSoupCrawler(
    additional_http_headers={
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
)
```

---

## 💾 Data Export

### Default Storage

Data automatically saved to `storage/` directory:
- `storage/datasets/default/` — scraped data
- `storage/request_queues/default/` — request queue
- `storage/key_value_stores/default/` — key-value storage

### Export Formats

```python
# JSON (default)
await crawler.run(start_urls)

# Access dataset
dataset = await crawler.get_dataset()
await dataset.export_to_json('output.json')
await dataset.export_to_csv('output.csv')
```

---

## 🛡️ Bot Protection Handling

### Built-in Protection

Crawlee includes automatic:
- User agent rotation
- Request fingerprint randomization
- Session management

### Additional Measures

```python
crawler = PlaywrightCrawler(
    headless=True,
    browser_pool_options={
        'use_incognito_pages': True,
    },
)

@crawler.router.default_handler
async def handler(context: PlaywrightCrawlingContext):
    # Random delays
    await context.page.wait_for_timeout(random.randint(1000, 3000))
    
    # Scroll like human
    await context.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
```

---

## 🔧 Common Patterns

### Login Handling

```python
@crawler.router.handler('login')
async def login_handler(context: PlaywrightCrawlingContext):
    await context.page.fill('input[name="username"]', 'user')
    await context.page.fill('input[name="password"]', 'pass')
    await context.page.click('button[type="submit"]')
    await context.page.wait_for_load_state('networkidle')
```

### Infinite Scroll

```python
async def handler(context: PlaywrightCrawlingContext):
    # Scroll until no more content
    previous_height = 0
    while True:
        await context.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        await context.page.wait_for_timeout(1000)
        
        current_height = await context.page.evaluate('document.body.scrollHeight')
        if current_height == previous_height:
            break
        previous_height = current_height
    
    # Now extract data...
```

### API Scraping

```python
from crawlee.http_crawler import HttpCrawler

crawler = HttpCrawler()

@crawler.router.default_handler
async def handler(context):
    # API returns JSON
    data = context.response.json()
    
    await context.push_data({
        'url': context.request.url,
        'data': data,
    })
```

---

## 📁 Templates

See `templates/` directory for starter templates:

| Template | Description |
|----------|-------------|
| `basic_crawler.py` | Simple BeautifulSoup crawler |
| `ecommerce_scraper.py` | Product scraping with pagination |
| `api_scraper.py` | API endpoint scraping |
| `playwright_automation.py` | Browser automation with Playwright |

---

## 🚀 Running the Crawler

```bash
# Run Python script
python crawler.py

# Data saved to storage/datasets/default/
```

---

## 📚 References

- Documentation: https://crawlee.dev/python/
- GitHub: https://github.com/apify/crawlee-python
- API Reference: https://crawlee.dev/python/api

---

*For legitimate web scraping only. Respect robots.txt and website terms of service.*
