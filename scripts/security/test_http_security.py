import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

print('Testing HTTP vs HTTPS Security...')
print('=' * 60)

# Test 1: HTTP
print('\n[1] Testing HTTP (http://sit.askmebill.com/auth/login)...')
try:
    resp = requests.get('http://sit.askmebill.com/auth/login', allow_redirects=False, timeout=10)
    print(f'   Status Code: {resp.status_code}')
    print(f'   Location Header: {resp.headers.get("Location", "No redirect")}')
    
    if resp.status_code in [301, 302, 307, 308]:
        print(f'   ✅ HTTP redirects to HTTPS (Good)')
    elif resp.status_code == 200:
        print(f'   🔴 CRITICAL: HTTP serves content directly!')
        print(f'   🔴 No HTTPS redirect - vulnerable to MITM attacks!')
    else:
        print(f'   ⚠️  Unexpected status: {resp.status_code}')
except Exception as e:
    print(f'   Error: {e}')

# Test 2: HTTPS
print('\n[2] Testing HTTPS (https://sit.askmebill.com/auth/login)...')
try:
    resp = requests.get('https://sit.askmebill.com/auth/login', timeout=10)
    print(f'   Status Code: {resp.status_code}')
    print(f'   Final URL: {resp.url}')
    
    if resp.status_code == 200:
        print(f'   ✅ HTTPS working')
except Exception as e:
    print(f'   Error: {e}')

# Test 3: HSTS Check
print('\n[3] HSTS (HTTP Strict Transport Security) Check...')
try:
    resp = requests.get('https://sit.askmebill.com/auth/login', timeout=10)
    hsts = resp.headers.get('Strict-Transport-Security')
    
    if hsts:
        print(f'   ✅ HSTS Present: {hsts}')
    else:
        print(f'   🔴 HSTS: MISSING')
        print(f'   ⚠️  Vulnerability: Site can be downgraded to HTTP!')
        print(f'   ⚠️  Attack: MITM can intercept HTTP traffic!')
except Exception as e:
    print(f'   Error: {e}')

# Test 4: Login over HTTP (if available)
print('\n[4] Testing Login Form Security...')
try:
    resp = requests.get('http://sit.askmebill.com/auth/login', timeout=10)
    if resp.status_code == 200:
        content = resp.text.lower()
        if 'password' in content:
            print(f'   🔴 CRITICAL: Password field found on HTTP!')
            print(f'   🔴 Credentials sent in PLAIN TEXT!')
            print(f'   🔴 Attack: Sniff credentials on network!')
except Exception as e:
    print(f'   Error: {e}')

print('\n' + '=' * 60)
print('Analysis Complete!')
