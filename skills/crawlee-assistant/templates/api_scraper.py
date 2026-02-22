"""
API Scraper Template
Scrape data from JSON APIs

Usage:
    python api_scraper.py https://api.example.com/items?page=1
"""

import asyncio
import sys
from crawlee.http_crawler import HttpCrawler, HttpCrawlingContext


async def main(start_url: str) -> None:
    """Run API scraper."""
    
    crawler = HttpCrawler(
        max_requests_per_crawl=1000,
        additional_http_headers={
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CrawleeBot/1.0)',
        },
    )
    
    @crawler.router.default_handler
    async def handler(context: HttpCrawlingContext) -> None:
        """Handle API responses."""
        
        try:
            # Parse JSON response
            data = context.response.json()
            
            # Handle different API structures
            items = []
            if isinstance(data, list):
                items = data
            elif isinstance(data, dict):
                # Common patterns: { "data": [...] }, { "results": [...] }, { "items": [...] }
                items = data.get('data') or data.get('results') or data.get('items') or [data]
            
            # Store each item
            if items:
                for item in items:
                    await context.push_data({
                        'source_url': context.request.url,
                        'data': item,
                    })
                print(f"✓ Extracted {len(items)} items from {context.request.url}")
            
            # Handle pagination (common patterns)
            if isinstance(data, dict):
                # Pattern: { "next": "url" }
                if data.get('next') or data.get('nextPage') or data.get('next_url'):
                    next_url = data.get('next') or data.get('nextPage') or data.get('next_url')
                    await context.add_requests([next_url])
                    print(f"  → Next page: {next_url}")
                
                # Pattern: { "page": 1, "total_pages": 10 }
                current_page = data.get('page') or data.get('current_page')
                total_pages = data.get('total_pages') or data.get('totalPages')
                if current_page and total_pages and current_page < total_pages:
                    next_page_url = context.request.url.replace(
                        f'page={current_page}',
                        f'page={current_page + 1}'
                    )
                    await context.add_requests([next_page_url])
                    print(f"  → Next page: {next_page_url}")
                    
        except Exception as e:
            print(f"✗ Error processing {context.request.url}: {e}")
    
    # Run
    print(f"🚀 Starting API scraper: {start_url}")
    await crawler.run([start_url])
    print("\n✓ API scraping complete!")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python api_scraper.py <api_url>")
        print("Example: python api_scraper.py https://api.example.com/items?page=1")
        sys.exit(1)
    
    url = sys.argv[1]
    asyncio.run(main(url))
