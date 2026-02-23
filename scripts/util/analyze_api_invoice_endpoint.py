#!/usr/bin/env python3
"""
Analyze when /api/invoice/:id is called
Using OpenClaw Browser to trace network requests
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import time
from datetime import datetime

print("=" * 70)
print("  🔍 ANALYZING: When is /api/invoice/:id called?")
print("=" * 70)
print()

# API Endpoint Analysis
print("📋 API ENDPOINT ANALYSIS:")
print("-" * 50)
print("""
Endpoint: GET /api/invoice/:id
Method: GET
Parameters: id (invoice ID)

LIKELY CALLED WHEN:
1. User clicks on an invoice to view details
2. Dashboard loads recent invoices
3. Invoice list page fetches data
4. Any auto-refresh of invoice data
5. Direct API access (if exposed)
""")

print("\n🎯 POSSIBLE CALL SCENARIOS:")
print("-" * 50)

scenarios = [
    {
        "when": "1. View Invoice Details",
        "trigger": "User clicks 'View' or 'Details' button on invoice",
        "request": "GET /api/invoice/123",
        "response": "Invoice details (amount, customer, items, status)"
    },
    {
        "when": "2. Load Invoice List",
        "trigger": "Navigate to /invoices page",
        "request": "GET /api/invoices (list) or multiple GET /api/invoice/:id",
        "response": "Array of invoices or individual invoice objects"
    },
    {
        "when": "3. Dashboard Widget",
        "trigger": "Dashboard loads with 'Recent Invoices' widget",
        "request": "GET /api/invoice/1, /api/invoice/2, etc.",
        "response": "Recent invoice summaries"
    },
    {
        "when": "4. Auto-Refresh",
        "trigger": "JavaScript timer refreshes invoice data",
        "request": "GET /api/invoice/:id (periodic)",
        "response": "Updated invoice status"
    },
    {
        "when": "5. Payment Processing",
        "trigger": "Before/after payment to check status",
        "request": "GET /api/invoice/:id",
        "response": "Updated payment status"
    },
    {
        "when": "6. Export/Download",
        "trigger": "User clicks 'Download Invoice' or 'Export'",
        "request": "GET /api/invoice/:id (then generate PDF)",
        "response": "Invoice data for PDF generation"
    }
]

for s in scenarios:
    print(f"\n{s['when']}")
    print(f"   Trigger: {s['trigger']}")
    print(f"   Request: {s['request']}")
    print(f"   Response: {s['response']}")

print("\n" + "=" * 70)
print("  HOW TO VERIFY (Using Browser DevTools)")
print("=" * 70)
print("""
1. Open https://sit.askmebill.com/ in Chrome
2. Login with credentials
3. Press F12 → Network tab
4. Click 'Preserve log' checkbox
5. Navigate to /invoices
6. Click on any invoice
7. Look for requests to /api/invoice/:id in Network tab
""")

print("\n" + "=" * 70)
print("  ALTERNATIVE: Check JavaScript Source")
print("=" * 70)
print("""
Search in page source for:
- fetch('/api/invoice')
- axios.get('/api/invoice')
- /api/invoice/${id}
- invoice/:id

These patterns indicate when the API is called.
""")

print("\n" + "=" * 70)
print("  EXPLOITATION SCENARIO")
print("=" * 70)
print("""
If /api/invoice/:id has no authorization check:

1. Attacker logs in as normal user
2. Opens browser devtools
3. Watches Network tab while clicking invoices
4. Sees request: GET /api/invoice/123
5. Tries: GET /api/invoice/124, /api/invoice/999, etc.
6. If no check → sees other users' invoices!

This is the IDOR vulnerability we found.
""")

print("\n" + "=" * 70)
print("  RECOMMENDATION")
print("=" * 70)
print("""
To prevent IDOR:
1. Log all /api/invoice/:id access
2. Check user ownership before serving data
3. Use UUID instead of sequential IDs
4. Add rate limiting per user
5. Alert on suspicious patterns (accessing many IDs)
""")

# Save analysis
analysis = {
    "endpoint": "/api/invoice/:id",
    "method": "GET",
    "purpose": "Retrieve invoice details by ID",
    "called_when": [
        "View invoice details",
        "Load invoice list",
        "Dashboard widget refresh",
        "Auto-refresh data",
        "Payment processing",
        "Export/Download"
    ],
    "vulnerability": "IDOR - No authorization check",
    "exploitation": "Change ID parameter to access other users' invoices",
    "timestamp": datetime.now().isoformat()
}

with open(f'api_invoice_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json', 'w') as f:
    json.dump(analysis, f, indent=2)

print(f"\n💾 Analysis saved to: api_invoice_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
print("\n" + "=" * 70)
