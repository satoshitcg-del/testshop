"""
Playwright Automation Template
Browser automation for JavaScript-heavy sites

Usage:
    python playwright_automation.py https://example.com
"""

import asyncio
import sys
from crawlee.playwright_crawler import PlaywrightCrawler, PlaywrightCrawlingContext


async def main(start_url: str) -> None:
    """Run Playwright automation."""
    
    # Initialize with browser options
    crawler = PlaywrightCrawler(
        headless=False,  # Set to True for production
        browser_type='chromium',  # or 'firefox', 'webkit'
        max_requests_per_crawl=20,
    )
    
    @crawler.router.default_handler
    async def handler(context: PlaywrightCrawlingContext) -> None:
        """Handle each page with browser interaction."""
        
        page = context.page
        
        # Wait for dynamic content
        await page.wait_for_load_state('networkidle')
        
        # Example: Handle cookie consent
        try:
            consent_button = await page.query_selector('button[aria-label*="cookie"], .cookie-accept')
            if consent_button:
                await consent_button.click()
                await page.wait_for_timeout(500)
                print("✓ Cookie consent handled")
        except:
            pass
        
        # Example: Click load more button if exists
        try:
            load_more = await page.query_selector('button.load-more, .load-more')
            if load_more and await load_more.is_visible():
                await load_more.click()
                await page.wait_for_timeout(1000)
                print("✓ Loaded more content")
        except:
            pass
        
        # Example: Scroll to bottom (infinite scroll)
        previous_height = 0
        scroll_attempts = 0
        max_scrolls = 5
        
        while scroll_attempts < max_scrolls:
            current_height = await page.evaluate('document.body.scrollHeight')
            if current_height == previous_height:
                break
            
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            await page.wait_for_timeout(1000)
            
            previous_height = current_height
            scroll_attempts += 1
        
        # Extract data after all dynamic content loaded
        title = await page.title()
        
        # Extract using page.evaluate (faster than BeautifulSoup)
        data = await page.evaluate('''() => {
            return {
                title: document.title,
                url: window.location.href,
                headings: Array.from(document.querySelectorAll('h1, h2')).map(h => h.innerText),
                links: Array.from(document.querySelectorAll('a[href]')).map(a => a.href).slice(0, 20),
            };
        }''')
        
        await context.push_data(data)
        print(f"✓ Processed: {title}")
        
        # Follow links
        await context.enqueue_links()
    
    # Run
    print(f"🚀 Starting Playwright automation: {start_url}")
    await crawler.run([start_url])
    print("\n✓ Automation complete!")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python playwright_automation.py <url>")
        print("Example: python playwright_automation.py https://spa-example.com")
        sys.exit(1)
    
    url = sys.argv[1]
    asyncio.run(main(url))
