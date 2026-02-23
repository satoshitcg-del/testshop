import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    
    # Try multiple swagger endpoints
    urls = [
        'https://sit.askmebill.com/swagger',
        'https://sit.askmebill.com/api/docs',
        'https://sit.askmebill.com/swagger-ui.html',
        'https://sit.askmebill.com/v2/api-docs'
    ]
    
    for url in urls:
        print(f'\nTrying: {url}')
        print('-' * 50)
        try:
            response = page.goto(url, timeout=10000)
            page.wait_for_timeout(3000)
            
            title = page.title()
            current_url = page.url
            content = page.content().lower()
            
            print(f'  Status: {response.status if response else "N/A"}')
            print(f'  Title: {title}')
            print(f'  Final URL: {current_url}')
            
            # Check for swagger indicators
            swagger_indicators = ['swagger', 'api documentation', 'openapi', 'rest api', 'endpoints']
            found_indicators = [ind for ind in swagger_indicators if ind in content]
            
            if found_indicators:
                print(f'  ✅ Swagger indicators found: {found_indicators}')
                screenshot_name = 'swagger_' + url.split('/')[-1].replace('.', '_') + '.png'
                page.screenshot(path=screenshot_name, full_page=True)
                print(f'  📸 Screenshot saved: {screenshot_name}')
                
                # Try to extract API info
                if 'api' in content and ('get' in content or 'post' in content):
                    print(f'  🔍 API endpoints may be visible!')
            else:
                print(f'  ⚠️  No swagger content detected')
                # Check what kind of page this is
                if 'login' in content:
                    print(f'  🔒 Redirected to login page')
                elif 'askmebill' in content:
                    print(f'  📄 Generic Askmebill page')
                    
        except Exception as e:
            print(f'  ❌ Error: {str(e)[:100]}')
    
    browser.close()
    print('\nDone! Check screenshots.')
