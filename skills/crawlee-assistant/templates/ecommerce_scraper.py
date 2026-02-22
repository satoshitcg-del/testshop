"""
E-commerce Scraper Template
Scrape products with pagination support

Usage:
    python ecommerce_scraper.py https://shop.example.com
"""

import asyncio
import sys
from crawlee.beautifulsoup_crawler import BeautifulSoupCrawler, BeautifulSoupCrawlingContext


async def main(start_url: str) -> None:
    """Run e-commerce scraper."""
    
    crawler = BeautifulSoupCrawler(
        max_requests_per_crawl=100,
    )
    
    @crawler.router.handler('category')
    async def category_handler(context: BeautifulSoupCrawlingContext) -> None:
        """Handle category/listing pages."""
        print(f"📁 Category: {context.request.url}")
        
        # Extract products on this page
        products = context.soup.select('.product-item')  # Adjust selector
        
        for product in products:
            link = product.select_one('a.product-link')
            if link and link.get('href'):
                await context.add_requests([{
                    'url': link['href'],
                    'label': 'product',
                }])
        
        # Handle pagination
        next_page = context.soup.select_one('a.next-page, a[rel="next"]')
        if next_page and next_page.get('href'):
            await context.add_requests([{
                'url': next_page['href'],
                'label': 'category',
            }])
            print(f"  → Next page found")
    
    @crawler.router.handler('product')
    async def product_handler(context: BeautifulSoupCrawlingContext) -> None:
        """Handle product detail pages."""
        print(f"  📦 Product: {context.request.url}")
        
        # Extract product data (adjust selectors for target site)
        product_data = {
            'url': context.request.url,
            'name': _get_text(context.soup, 'h1.product-name, h1.product-title, h1'),
            'price': _get_text(context.soup, '.price, .product-price, [data-price]'),
            'sku': _get_attr(context.soup, '[data-sku], .sku', 'data-sku') or _get_text(context.soup, '.sku'),
            'description': _get_text(context.soup, '.description, .product-description'),
            'brand': _get_text(context.soup, '.brand, .product-brand'),
            'availability': _get_text(context.soup, '.availability, .stock-status'),
            'image_url': _get_attr(context.soup, '.product-image img, .main-image img', 'src'),
        }
        
        await context.push_data(product_data)
    
    # Start crawling
    print(f"🚀 Starting e-commerce scraper: {start_url}")
    await crawler.run([{'url': start_url, 'label': 'category'}])
    print("\n✓ Scraping complete!")


def _get_text(soup, selector: str) -> str | None:
    """Safely extract text."""
    element = soup.select_one(selector)
    return element.text.strip() if element else None


def _get_attr(soup, selector: str, attr: str) -> str | None:
    """Safely extract attribute."""
    element = soup.select_one(selector)
    return element.get(attr) if element else None


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python ecommerce_scraper.py <url>")
        print("Example: python ecommerce_scraper.py https://shop.example.com/category")
        sys.exit(1)
    
    url = sys.argv[1]
    asyncio.run(main(url))
