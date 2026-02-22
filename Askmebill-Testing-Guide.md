# Askmebill SIT - Testing Guide

**Target:** https://sit.askmebill.com/  
**Environment:** System Integration Testing (SIT)  
**Date:** 2026-02-23  

---

## 🎯 Testing Overview

### Credentials Provided
| Field | Value |
|-------|-------|
| **URL** | https://sit.askmebill.com/ |
| **Username** | uuio11 |
| **Password** | 0897421942@Earth |
| **2FA Code** | 954900 |

### Testing Tools Available
- ✅ OpenClaw Pentest Skills (7 skills)
- ⏸️ Browser automation (requires Chrome extension)
- ✅ Manual testing tools (curl, scripts)

---

## 📋 Testing Phases

### Phase 1: Reconnaissance ✅

**Using OpenClaw Skills:**
```bash
# Use pentest-cheat-sheets skill for quick reference
# Nmap commands from cheat sheets
nmap -sV -sC sit.askmebill.com
nmap --script vuln sit.askmebill.com

# Check security headers
curl -I https://sit.askmebill.com/
```

**Completed:**
- [x] Initial HTTP request analysis
- [x] Header inspection
- [x] SSL/TLS basic check

**Pending:**
- [ ] Full port scan
- [ ] DNS enumeration
- [ ] Subdomain discovery

---

### Phase 2: Authentication Testing ⏸️

**Using pentest-assistant skill:**

#### 2.1 Login Flow Testing
```
Test Steps:
1. Navigate to https://sit.askmebill.com/
2. Enter username: uuio11
3. Enter password: 0897421942@Earth
4. Enter 2FA: 954900
5. Observe behavior

Tests:
- [ ] Successful login
- [ ] 2FA validation
- [ ] Session creation
- [ ] Redirect after login
```

#### 2.2 Authentication Bypass Tests
From **pentest-payloads** skill:
```sql
-- SQL Injection on login (if applicable)
' OR '1'='1
' OR 1=1--
admin'--
'=' 'or'
```

#### 2.3 Brute Force Protection
```
Tests:
- [ ] Multiple failed login attempts
- [ ] Account lockout trigger
- [ ] Lockout duration
- [ ] Unlock mechanism
```

---

### Phase 3: Input Validation Testing ⏸️

**Using pentest-payloads skill:**

#### 3.1 SQL Injection
From `references/sql-payloads.md`:
```sql
-- Entry point detection
'
' OR '1'='1
' UNION SELECT null,null--

-- If MySQL:
' UNION SELECT 1,version()--
' UNION SELECT 1,database()--
```

#### 3.2 XSS Testing
From `references/xss-payloads.md`:
```html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
```

#### 3.3 Command Injection
From `references/command-injection.md`:
```
;id
|whoami
`id`
$(whoami)
```

---

### Phase 4: Session Management ⏸️

**Using pentest-assistant skill:**

#### 4.1 Cookie Analysis
```
Check for:
- [ ] HttpOnly flag
- [ ] Secure flag
- [ ] SameSite attribute
- [ ] Session ID randomness
- [ ] Session timeout
```

#### 4.2 Session Fixation
```
Test:
1. Get session ID before login
2. Login with credentials
3. Check if session ID changes
```

---

### Phase 5: Access Control Testing ⏸️

**Using api-security-checklist:**

#### 5.1 IDOR (Insecure Direct Object Reference)
```
Tests:
- Change IDs in URLs
- /user/1 → /user/2
- /invoice/100 → /invoice/101
- /api/user/1 → /api/user/2
```

#### 5.2 Privilege Escalation
```
Tests:
- [ ] Horizontal (same role, different user)
- [ ] Vertical (user → admin)
- [ ] Forceful browsing to admin pages
```

---

### Phase 6: API Testing ⏸️

**Using API Security Checklist:**

#### 6.1 API Discovery
```
Common endpoints:
/api/v1/
/api/users
/api/invoices
/api/payments
/swagger
/api/docs
/graphql
```

#### 6.2 API Authentication Tests
```bash
# From api-test.sh script
# Test authentication bypass
curl -H "Authorization: invalid" https://sit.askmebill.com/api/user

# Test IDOR
curl -H "Authorization: Bearer TOKEN" https://sit.askmebill.com/api/user/1
curl -H "Authorization: Bearer TOKEN" https://sit.askmebill.com/api/user/2
```

---

## 🛠️ Automated Testing Script

**Using pentest-assistant scripts:**

```bash
# Run reconnaissance
bash skills/pentest-assistant/scripts/recon.sh sit.askmebill.com

# Run API tests (if API discovered)
bash skills/pentest-assistant/scripts/api-test.sh https://sit.askmebill.com/api
```

---

## 📊 Reporting Template

**Using report-template.md:**

### Finding Format
```
### [FINDING-ID] [Title]

**Severity:** 🔴 Critical / 🔴 High / 🟡 Medium / 🟢 Low
**CVSS Score:** [X.X]
**Category:** [OWASP Category]

**Description:**
[Detailed description]

**Proof of Concept:**
```
[Steps to reproduce]
```

**Impact:**
[What can attacker do]

**Remediation:**
[How to fix]

**References:**
- [Link to OWASP/guide]
```

---

## 🔗 Quick Reference Links

### OpenClaw Skills to Use
| Skill | Use For |
|-------|---------|
| `pentest-cheat-sheets` | Quick command reference |
| `pentest-payloads` | SQLi, XSS, Command injection payloads |
| `pentest-assistant` | Testing methodology, report template |
| `osint-assistant` | Reconnaissance (if needed) |

### Testing Checklists
- OWASP Testing Guide: `skills/pentest-assistant/references/`
- API Security: `skills/pentest-assistant/references/api-security-checklist.md`
- OWASP Top 10: `skills/pentest-assistant/references/owasp-top10.md`

---

## ⚠️ Important Notes

### 2FA Code (954900)
- ⏰ **One-time use only**
- 🔄 May expire after use or time limit
- 📱 May require regeneration

### Testing Limitations
- Browser automation currently unavailable
- Manual testing required for authenticated areas
- 2FA flow requires actual browser

### Authorization
- ✅ SIT environment authorized for testing
- ✅ Credentials provided by system owner
- ⚠️ Do not test on production

---

## 📅 Testing Schedule

| Phase | Status | Time Estimate |
|-------|--------|---------------|
| Reconnaissance | ✅ 10% | 30 min |
| Authentication | ⏸️ 0% | 1 hour |
| Input Validation | ⏸️ 0% | 2 hours |
| Session Management | ⏸️ 0% | 1 hour |
| Access Control | ⏸️ 0% | 2 hours |
| API Testing | ⏸️ 0% | 2 hours |
| Business Logic | ⏸️ 0% | 2 hours |
| Reporting | ⏸️ 0% | 2 hours |

**Total Estimated Time:** 12-14 hours

---

## 🎯 Next Steps

### Immediate
1. Enable OpenClaw browser extension
2. Login with provided credentials
3. Explore authenticated functionality
4. Run automated scanner (OWASP ZAP)

### Short Term
1. Complete manual testing checklist
2. Document all findings
3. Rate vulnerabilities (CVSS)
4. Create remediation plan

### Deliverables
1. ✅ Initial Report (this document)
2. ⏸️ Full Pentest Report
3. ⏸️ Vulnerability Details
4. ⏸️ Remediation Guide

---

*Guide generated by OpenClaw Agent (เสี่ยวทู่)*  
*Using OpenClaw Pentest Skills*  
*Date: 2026-02-23*
