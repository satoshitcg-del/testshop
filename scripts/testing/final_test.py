import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time
import json
from datetime import datetime

results = []

def log(test, status, detail=''):
    results.append({'test': test, 'status': status, 'detail': detail, 'time': datetime.now().isoformat()})
    print(f'[{status}] {test}: {detail}')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context(viewport={'width': 1920, 'height': 1080})
    page = context.new_page()
    
    print('=== Penetration Test - Final Attempt ===')
    
    # Load page
    page.goto('https://sit.askmebill.com/')
    page.wait_for_load_state('networkidle')
    log('Page', 'LOADED', page.title())
    
    # Fill login form
    page.locator('input[name="username"]').fill('uuio11')
    page.locator('input[name="password"]').fill('0897421942@Earth')
    log('Form', 'FILLED', 'Credentials entered')
    
    # Click login
    page.locator('button:has-text("Login")').click()
    log('Login', 'SUBMITTED', 'Waiting for response...')
    
    # Wait longer and check for different outcomes
    time.sleep(10)
    
    current_url = page.url
    log('URL After Wait', 'INFO', current_url)
    
    # Take screenshot
    page.screenshot(path='after_submit.png')
    
    # Check page content for clues
    page_content = page.content()
    
    # Check for specific elements
    if '2fa' in page_content.lower() or 'otp' in page_content.lower() or 'verification' in page_content.lower():
        log('2FA', 'DETECTED', '2FA form may be present')
        
        # Try to find and fill 2FA
        try:
            otp_input = page.locator('input[type="text"]').first
            if otp_input.is_visible():
                otp_input.fill('954900')
                log('2FA', 'FILLED', '954900')
                
                # Submit 2FA
                page.locator('button[type="submit"]').click()
                time.sleep(5)
                log('2FA', 'SUBMITTED', f'New URL: {page.url}')
                page.screenshot(path='after_2fa.png')
        except Exception as e:
            log('2FA', 'ERROR', str(e))
    
    elif 'dashboard' in page_content.lower() or 'home' in page_content.lower() or 'welcome' in page_content.lower():
        log('Login', 'SUCCESS', 'Dashboard detected')
        page.screenshot(path='dashboard.png')
    
    elif 'error' in page_content.lower() or 'invalid' in page_content.lower():
        log('Login', 'FAILED', 'Error message detected')
        # Extract error message
        try:
            error_elem = page.locator('.error, .alert, [role="alert"]').first
            if error_elem.is_visible():
                error_text = error_elem.inner_text()
                log('Error Message', 'FOUND', error_text)
        except:
            pass
    
    else:
        log('Status', 'UNKNOWN', f'URL: {current_url}')
        # Get all text on page for analysis
        body_text = page.locator('body').inner_text()
        log('Page Text', 'EXTRACT', body_text[:500])  # First 500 chars
    
    # Network/Console logs if available
    try:
        logs = page.evaluate("() => { return window.consoleLogs || []; }")
        if logs:
            log('Console', 'LOGS', str(logs))
    except:
        pass
    
    # Save results
    with open(f'final_test_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    browser.close()
    print('=== Test Complete ===')
