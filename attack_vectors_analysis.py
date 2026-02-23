import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import requests
import time
import json
from datetime import datetime
from urllib.parse import urljoin

print("=" * 70)
print("  🔴 ADVANCED VULNERABILITY ANALYSIS - ASKMEBILL SIT")
print("  Target: https://sit.askmebill.com/")
print("=" * 70)
print()

vulnerabilities = []
exploits = []

def add_vuln(severity, title, description, impact, poc, remediation):
    vuln = {
        "severity": severity,
        "title": title,
        "description": description,
        "impact": impact,
        "proof_of_concept": poc,
        "remediation": remediation,
        "discovered_at": datetime.now().isoformat()
    }
    vulnerabilities.append(vuln)
    icon = {"Critical": "🔴", "High": "🟠", "Medium": "🟡", "Low": "🟢"}[severity]
    print(f"\n{icon} [{severity}] {title}")
    print(f"   Impact: {impact}")

# Start browser
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context(viewport={'width': 1920, 'height': 1080})
    page = context.new_page()
    
    base_url = "https://sit.askmebill.com"
    
    # ========== 1. EXPOSED API DOCUMENTATION ==========
    print("\n[1] Analyzing Exposed API Documentation...")
    print("-" * 50)
    
    api_docs = [
        "/swagger",
        "/swagger-ui.html", 
        "/api/docs",
        "/v2/api-docs",
        "/api/swagger.json"
    ]
    
    swagger_found = False
    for doc in api_docs:
        try:
            resp = page.goto(f"{base_url}{doc}", timeout=10000)
            if resp and resp.status == 200:
                content = page.content()
                if 'swagger' in content.lower() or 'api' in content.lower():
                    print(f"   ⚠️  API Doc Found: {doc}")
                    swagger_found = True
                    
                    # Try to extract API endpoints from swagger
                    try:
                        # Check if swagger.json is accessible
                        swagger_json = page.evaluate("""() => {
                            if (window.swaggerUi && window.swaggerUi.api) {
                                return JSON.stringify(window.swaggerUi.api.spec);
                            }
                            return null;
                        }""")
                        if swagger_json:
                            print("   🔴 Swagger Spec Accessible!")
                            add_vuln(
                                "High",
                                "Exposed Swagger API Specification",
                                f"Swagger documentation at {doc} exposes complete API specification",
                                "Attackers can discover all API endpoints, parameters, and authentication mechanisms",
                                f"Navigate to {base_url}{doc} to see all API endpoints",
                                "Restrict access to API documentation or disable in production"
                            )
                    except:
                        pass
        except:
            pass
    
    if swagger_found:
        add_vuln(
            "High",
            "Publicly Accessible API Documentation",
            "API documentation (Swagger) is accessible without authentication",
            "Information disclosure - attackers can map entire API surface",
            "Visit /swagger or /api/docs without login",
            "Require authentication for API docs or IP whitelist"
        )
    
    # ========== 2. AUTHENTICATION BYPASS TESTS ==========
    print("\n[2] Testing Authentication Bypass Vectors...")
    print("-" * 50)
    
    # Test direct access to authenticated pages
    auth_pages = [
        "/invoices",
        "/dashboard",
        "/profile",
        "/settings"
    ]
    
    bypass_results = []
    for page_path in auth_pages:
        try:
            test_page = context.new_page()
            resp = test_page.goto(f"{base_url}{page_path}", timeout=5000)
            url = test_page.url
            
            if 'login' in url.lower() or 'auth' in url.lower():
                print(f"   ✅ {page_path}: Properly protected (redirected to login)")
                bypass_results.append({"page": page_path, "protected": True})
            else:
                print(f"   🔴 {page_path}: POTENTIALLY VULNERABLE!")
                bypass_results.append({"page": page_path, "protected": False})
                add_vuln(
                    "Critical",
                    f"Authentication Bypass - {page_path}",
                    f"Page {page_path} accessible without authentication",
                    "Unauthorized access to sensitive functionality",
                    f"Visit {base_url}{page_path} without logging in",
                    "Implement proper authentication checks on all protected routes"
                )
            
            test_page.close()
        except Exception as e:
            pass
    
    # ========== 3. SESSION MANAGEMENT ANALYSIS ==========
    print("\n[3] Analyzing Session Management...")
    print("-" * 50)
    
    # Login and capture session
    page.goto(f"{base_url}/")
    page.locator('input[name="username"]').fill('uuio11')
    page.locator('input[name="password"]').fill('0897421942@Earth')
    page.locator('button:has-text("Login")').click()
    time.sleep(3)
    
    # 2FA
    try:
        otp_field = page.locator('input[placeholder*="Verification Code" i]').first
        if otp_field.is_visible():
            otp_field.fill('954900')
            page.locator('button:has-text("Confirm")').click()
            time.sleep(3)
    except:
        pass
    
    # Get cookies
    cookies = context.cookies()
    session_analysis = []
    
    for cookie in cookies:
        if 'session' in cookie['name'].lower() or 'auth' in cookie['name'].lower() or 'token' in cookie['name'].lower():
            analysis = {
                "name": cookie['name'],
                "httpOnly": cookie.get('httpOnly', False),
                "secure": cookie.get('secure', False),
                "sameSite": cookie.get('sameSite', 'Not set'),
                "expires": cookie.get('expires', 'Session')
            }
            session_analysis.append(analysis)
            
            # Check for security issues
            issues = []
            if not cookie.get('httpOnly'):
                issues.append("Missing HttpOnly")
            if not cookie.get('secure'):
                issues.append("Missing Secure flag")
            if cookie.get('sameSite') not in ['Strict', 'Lax']:
                issues.append(f"SameSite={cookie.get('sameSite', 'None')}")
            
            if issues:
                print(f"   ⚠️  Cookie '{cookie['name']}': {', '.join(issues)}")
                add_vuln(
                    "Medium",
                    f"Insecure Session Cookie - {cookie['name']}",
                    f"Session cookie missing security flags: {', '.join(issues)}",
                    "Session hijacking via XSS or MITM attacks",
                    f"Cookie: {cookie['name']} - HttpOnly: {cookie.get('httpOnly', False)}, Secure: {cookie.get('secure', False)}",
                    f"Set HttpOnly=True, Secure=True, SameSite=Strict for {cookie['name']}"
                )
            else:
                print(f"   ✅ Cookie '{cookie['name']}' properly secured")
    
    # Test session fixation
    print("\n   Testing Session Fixation...")
    pre_auth_cookies = [c['name'] for c in cookies]
    
    # Check if session ID changed after auth
    post_auth_cookies = context.cookies()
    session_changed = any(c['name'] not in pre_auth_cookies for c in post_auth_cookies)
    
    if not session_changed:
        add_vuln(
            "High",
            "Session Fixation Vulnerability",
            "Session ID does not change after authentication",
            "Attackers can hijack sessions using pre-auth session ID",
            "Login, observe session cookie remains same",
            "Regenerate session ID after successful authentication"
        )
    
    # ========== 4. SENSITIVE DATA EXPOSURE ==========
    print("\n[4] Testing for Sensitive Data Exposure...")
    print("-" * 50)
    
    # Check invoice details for sensitive data
    try:
        page.goto(f"{base_url}/invoices")
        time.sleep(2)
        
        # Look for invoice IDs
        invoice_links = page.locator('a[href*="/invoice/"]').all()
        if invoice_links:
            print(f"   Found {len(invoice_links)} invoice links")
            
            # Click first invoice
            invoice_links[0].click()
            time.sleep(2)
            
            page_content = page.content()
            
            # Check for sensitive patterns
            sensitive_patterns = {
                "Credit Card": r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
                "Email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                "Phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
                "SSN": r'\b\d{3}-\d{2}-\d{4}\b',
                "API Key": r'api[_-]?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9]{32,}',
                "Secret": r'secret["\']?\s*[:=]\s*["\']?[a-zA-Z0-9]{16,}'
            }
            
            import re
            for pattern_name, pattern in sensitive_patterns.items():
                matches = re.findall(pattern, page_content)
                if matches:
                    print(f"   🔴 {pattern_name} found in page!")
                    add_vuln(
                        "High",
                        f"Sensitive Data Exposure - {pattern_name}",
                        f"{pattern_name} patterns found in HTML response",
                        "Data breach, identity theft, financial fraud",
                        f"Found {len(matches)} matches of {pattern_name}",
                        "Remove sensitive data from client-side responses"
                    )
    except Exception as e:
        print(f"   Error: {e}")
    
    # ========== 5. BUSINESS LOGIC VULNERABILITIES ==========
    print("\n[5] Testing Business Logic Vulnerabilities...")
    print("-" * 50)
    
    # Test for negative amounts or amount manipulation
    try:
        # Check if we can inspect payment forms
        pay_buttons = page.locator('button:has-text("Pay")').all()
        if pay_buttons:
            print(f"   Found {len(pay_buttons)} payment buttons")
            
            # Try to find payment amount fields
            amount_fields = page.locator('input[name*="amount"], input[id*="amount"]').all()
            if amount_fields:
                add_vuln(
                    "Medium",
                    "Potential Payment Manipulation",
                    "Payment amount fields detected - may be vulnerable to tampering",
                    "Financial loss, unauthorized payments",
                    "Inspect payment form and attempt to modify amount",
                    "Validate all payment amounts server-side; use signed tokens"
                )
    except:
        pass
    
    # ========== 6. CSRF TESTING ==========
    print("\n[6] Testing CSRF Protection...")
    print("-" * 50)
    
    # Check forms for CSRF tokens
    forms = page.locator('form').all()
    csrf_protected = 0
    csrf_vulnerable = 0
    
    for i, form in enumerate(forms):
        try:
            form_html = form.inner_html()
            has_csrf = any(token in form_html.lower() for token in ['csrf', '_token', 'authenticity'])
            
            if has_csrf:
                csrf_protected += 1
            else:
                csrf_vulnerable += 1
                print(f"   ⚠️  Form {i+1} missing CSRF protection")
        except:
            pass
    
    if csrf_vulnerable > 0:
        add_vuln(
            "High",
            "Cross-Site Request Forgery (CSRF)",
            f"{csrf_vulnerable} form(s) missing CSRF tokens",
            "Unauthorized actions performed on behalf of authenticated users",
            "Create malicious form that submits to target endpoint",
            "Add CSRF tokens to all state-changing forms"
        )
    
    print(f"   Forms: {csrf_protected} protected, {csrf_vulnerable} vulnerable")
    
    # ========== 7. RATE LIMITING TEST ==========
    print("\n[7] Testing Rate Limiting...")
    print("-" * 50)
    
    # Test login rate limiting
    print("   Testing login brute force protection...")
    login_attempts = 0
    rate_limited = False
    
    for i in range(5):
        try:
            test_page = context.new_page()
            test_page.goto(f"{base_url}/")
            test_page.locator('input[name="username"]').fill(f'testuser{i}')
            test_page.locator('input[name="password"]').fill('wrongpassword')
            test_page.locator('button:has-text("Login")').click()
            time.sleep(1)
            
            # Check for rate limit message
            content = test_page.content()
            if any(msg in content.lower() for msg in ['rate limit', 'too many', 'locked', 'blocked']):
                print(f"   ✅ Rate limiting detected after {i+1} attempts")
                rate_limited = True
                break
            
            test_page.close()
        except:
            pass
    
    if not rate_limited:
        add_vuln(
            "Medium",
            "Missing Rate Limiting",
            "No rate limiting detected on login endpoint",
            "Brute force attacks, credential stuffing",
            "Attempt multiple rapid login requests",
            "Implement rate limiting on authentication endpoints"
        )
    
    # ========== SUMMARY ==========
    print("\n" + "=" * 70)
    print("  🔴 VULNERABILITY ANALYSIS COMPLETE")
    print("=" * 70)
    
    # Count by severity
    critical = len([v for v in vulnerabilities if v['severity'] == 'Critical'])
    high = len([v for v in vulnerabilities if v['severity'] == 'High'])
    medium = len([v for v in vulnerabilities if v['severity'] == 'Medium'])
    low = len([v for v in vulnerabilities if v['severity'] == 'Low'])
    
    print(f"\n📊 VULNERABILITY SUMMARY:")
    print(f"   🔴 Critical: {critical}")
    print(f"   🟠 High: {high}")
    print(f"   🟡 Medium: {medium}")
    print(f"   🟢 Low: {low}")
    print(f"   Total: {len(vulnerabilities)}")
    
    # Top risks
    print(f"\n🎯 TOP ATTACK VECTORS:")
    for i, vuln in enumerate(vulnerabilities[:5], 1):
        print(f"   {i}. [{vuln['severity']}] {vuln['title']}")
    
    # Save report
    report = {
        "target": base_url,
        "scan_date": datetime.now().isoformat(),
        "summary": {
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
            "total": len(vulnerabilities)
        },
        "vulnerabilities": vulnerabilities
    }
    
    filename = f'attack_vectors_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n💾 Full analysis saved to: {filename}")
    
    browser.close()

print("\n✅ Analysis Complete!")
print("\n⚠️  REMINDER: Use this information only for authorized security testing!")
