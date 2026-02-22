"""
Basic Crawler Template
Simple BeautifulSoup crawler for static websites

Usage:
    python basic_crawler.py https://example.com
"""

import asyncio
import sys
from crawlee.beautifulsoup_crawler import BeautifulSoupCrawler, BeautifulSoupCrawlingContext


async def main(start_url: str) -> None:
    """Run basic crawler."""
    
    # Initialize crawler
    crawler = BeautifulSoupCrawler(
        max_requests_per_crawl=50,  # Limit for safety
    )
    
    @crawler.router.default_handler
    async def handler(context: BeautifulSoupCrawlingContext) -> None:
        """Handle each page."""
        
        # Extract basic data
        title = context.soup.title.text.strip() if context.soup.title else 'No title'
        
        # Get all text content
        body_text = context.soup.get_text(separator=' ', strip=True)[:500]
        
        # Extract all links
        links = [a['href'] for a in context.soup.find_all('a', href=True)]
        
        # Store data
        await context.push_data({
            'url': context.request.url,
            'title': title,
            'snippet': body_text,
            'link_count': len(links),
            'links': links[:10],  # First 10 links only
        })
        
        # Follow links (up to depth limit)
        await context.enqueue_links()
        
        print(f"✓ Crawled: {context.request.url}")
    
    # Run crawler
    print(f"Starting crawl from: {start_url}")
    await crawler.run([start_url])
    print("\n✓ Crawl complete!")
    print("Data saved to: storage/datasets/default/")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python basic_crawler.py <url>")
        print("Example: python basic_crawler.py https://example.com")
        sys.exit(1)
    
    url = sys.argv[1]
    asyncio.run(main(url))
