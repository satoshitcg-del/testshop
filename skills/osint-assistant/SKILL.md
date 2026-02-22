---
name: osint-assistant
description: Open Source Intelligence (OSINT) gathering assistant for legitimate investigations, security research, and authorized reconnaissance. Use when gathering publicly available information about IP addresses, phone numbers, usernames, domains, or conducting footprinting for authorized penetration tests. Includes techniques for IP geolocation, phone number validation, social media reconnaissance, and email investigation. For authorized use only with proper legal justification.
---

# OSINT Assistant

Open Source Intelligence gathering for authorized investigations.

---

## ⚠️ Legal & Ethical Notice

**OSINT must be conducted legally and ethically:**

- ✅ Authorized security assessments
- ✅ Your own infrastructure investigation
- ✅ Public information research with legitimate purpose
- ✅ Law enforcement with proper authorization
- ✅ Bug bounty programs within scope

**Never use for:**
- ❌ Stalking or harassment
- ❌ Unauthorized surveillance
- ❌ Doxxing individuals
- ❌ Identity theft
- ❌ Social engineering attacks

---

## 🎯 OSINT Techniques

### 1. IP Address Investigation

#### Geolocation
```bash
# Using curl and APIs
curl ipinfo.io/8.8.8.8
curl ipapi.co/8.8.8.8/json
curl https://ipwho.is/8.8.8.8

# Using whois
whois 8.8.8.8
```

#### Reverse DNS
```bash
# Find domains on IP
dig -x 8.8.8.8
host 8.8.8.8
```

#### IP Tools
- ipinfo.io
- ip-api.com
- ipwho.is
- whois.domaintools.com
- shodan.io
- censys.io

---

### 2. Phone Number Investigation

#### Validation & Formatting
```python
# Using phonenumbers library
import phonenumbers

number = phonenumbers.parse("+14155552671", None)
print(phonenumbers.is_valid_number(number))
print(phonenumbers.format_number(number, phonenumbers.PhoneNumberFormat.INTERNATIONAL))

# Get carrier info (if available)
from phonenumbers import carrier
carrier.name_for_number(number, "en")

# Get timezone
from phonenumbers import timezone
timezone.time_zones_for_number(number)
```

#### Online Tools
- phonenumbers.io
- numverify.com
- truecaller.com (requires account)
- opencnam.com

#### Number Analysis
| Code | Meaning |
|------|---------|
| +1 | USA/Canada |
| +44 | UK |
| +66 | Thailand |
| +81 | Japan |
| +86 | China |

---

### 3. Username/Social Media Recon

#### Username Search Tools
```bash
# Sherlock - hunt down social media accounts
sherlock username

# Maigret - advanced username search
maigret username

# Social Analyzer
npm run cli -- -l username
```

#### Manual Search Patterns
```
https://twitter.com/username
https://facebook.com/username
https://instagram.com/username
https://github.com/username
https://linkedin.com/in/username
https://reddit.com/user/username
https://tiktok.com/@username
```

#### Profile Analysis
- Profile pictures (reverse image search)
- Bio information
- Connected accounts
- Post timestamps (timezone hints)
- Friend/follower patterns

---

### 4. Email Investigation

#### Verification
```bash
# Verify email format
# Check MX records
dig MX domain.com

# SMTP verification (careful with rate limits)
```

#### Email OSINT Tools
- hunter.io
- voilanorbert.com
- emailrep.io
- haveibeenpwned.com

#### Patterns
```
firstname.lastname@company.com
firstname@company.com
flastname@company.com
firstinitiallastname@company.com
```

---

### 5. Domain Investigation

#### WHOIS
```bash
whois domain.com
whois -h whois.arin.net ip_address
```

#### DNS Enumeration
```bash
# DNS records
dig any domain.com
dig mx domain.com
dig ns domain.com
dig txt domain.com

# Subdomain enumeration
subfinder -d domain.com
amass enum -d domain.com
assetfinder domain.com
```

#### Web Technologies
```bash
# Whatweb
whatweb domain.com

# Wappalyzer
# BuiltWith
```

---

### 6. Image OSINT

#### Reverse Image Search
- Google Images
- TinEye
- Yandex Images
- Bing Visual Search

#### EXIF Data
```bash
# Extract metadata
exiftool image.jpg

# Python
from PIL import Image
from PIL.ExifTags import TAGS

img = Image.open('image.jpg')
exif = img._getexif()
```

---

## 🔧 Tools Reference

### IP Tools
| Tool | Purpose |
|------|---------|
| ipinfo.io | IP geolocation |
| shodan.io | Internet device search |
| censys.io | Internet asset discovery |
| greynoise.io | Threat intelligence |
| abuseipdb.com | IP reputation |

### Phone Tools
| Tool | Purpose |
|------|---------|
| phonenumbers | Python library |
| numverify.com | Number validation |
| truecaller.com | Caller ID |
| twilio.com/lookup | Carrier lookup |

### Social Media
| Tool | Purpose |
|------|---------|
| Sherlock | Username search |
| Maigret | Advanced username OSINT |
| Social Analyzer | Multi-platform analysis |
| WhatsMyName | Username enumeration |

### Domain/Web
| Tool | Purpose |
|------|---------|
| whois | Domain registration |
| subfinder | Subdomain discovery |
| amass | Asset discovery |
| theHarvester | Email harvesting |

---

## 📋 Investigation Workflows

### IP Investigation Workflow
1. Get IP address
2. Check geolocation (ipinfo.io)
3. Reverse DNS lookup
4. Check Shodan/Censys
5. Check reputation (AbuseIPDB)
6. WHOIS lookup
7. Port scan (if authorized)

### Phone Number Workflow
1. Validate format (phonenumbers)
2. Identify carrier/country
3. Search online directories
4. Check social media connections
5. Verify if VOIP or mobile

### Username Workflow
1. Search across platforms (Sherlock)
2. Analyze profiles found
3. Extract profile pictures
4. Reverse image search
5. Timeline analysis
6. Cross-reference information

### Email Workflow
1. Verify format
2. Check breaches (HaveIBeenPwned)
3. Check pattern generators
4. Validate domain
5. Search for public mentions

---

## 🛡️ OPSEC Considerations

### Protecting Your Identity
- Use VPN/Tor for research
- Separate OSINT accounts
- Don't use personal accounts
- Clear browser fingerprints
- Use virtual machines

### Data Handling
- Encrypt collected data
- Limit retention time
- Secure deletion when done
- Follow data protection laws

---

## 📚 Resources

### Tools
- OSINT Framework: https://osintframework.com/
- IntelTechniques: https://inteltechniques.com/
- Bellingcat: https://www.bellingcat.com/

### Learning
- OSINT Curious: https://osintcurious.blog/
- Trace Labs: https://www.tracelabs.org/
- SANS OSINT Course

---

## 🎯 Quick Commands

### IP Quick Check
```bash
# All-in-one IP info
curl -s ipinfo.io/8.8.8.8 | jq .
```

### Phone Quick Check
```python
import phonenumbers
number = phonenumbers.parse("+14155552671")
print(f"Valid: {phonenumbers.is_valid_number(number)}")
print(f"Region: {phonenumbers.region_code_for_number(number)}")
```

### Username Quick Check
```bash
# Quick social media check
for platform in twitter facebook instagram github; do
    curl -s -o /dev/null -w "%{http_code}" https://$platform.com/username
done
```

---

*For authorized investigations only. Always follow applicable laws and regulations.*
