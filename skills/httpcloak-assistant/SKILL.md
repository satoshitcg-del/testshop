---
name: httpcloak-assistant
description: HTTP client assistant for bypassing bot detection using httpcloak. Use when making HTTP requests that need to evade TLS fingerprinting, JA3/JA4 detection, HTTP/2 fingerprinting, or Akamai/bot protection systems. Supports browser-identical TLS/HTTP2/HTTP3 fingerprinting, ECH (Encrypted Client Hello), proxy rotation, and session resumption. For legitimate web scraping, API access, and authorized testing only.
---

# HTTPCloak Assistant

Bypass bot detection with browser-identical HTTP requests.

---

## 📦 Installation

### Python
```bash
pip install httpcloak
```

### Node.js
```bash
npm install httpcloak
```

### Go
```bash
go get github.com/sardanioss/httpcloak
```

### C#
```bash
dotnet add package HttpCloak
```

---

## 🎯 What httpcloak Does

Modern bot detection checks:
- **TLS fingerprints** (JA3/JA4)
- **HTTP/2 frames** (settings, window updates)
- **QUIC parameters** (HTTP/3)
- **Header order**
- **ECH (Encrypted Client Hello)**

httpcloak makes your requests **indistinguishable from real browsers**.

---

## 🚀 Quick Start

### Python

```python
import httpcloak

# Simple request with Chrome fingerprint
r = httpcloak.get("https://example.com", preset="chrome-145")
print(r.status_code, r.protocol)  # 200 h2

# POST with JSON
r = httpcloak.post("https://httpbin.org/post",
    json={"key": "value"},
    preset="chrome-145"
)

# Session for multiple requests
session = httpcloak.Session(preset="chrome-145")
r = session.get("https://example.com")
r = session.get("https://example.com/page2")
session.close()
```

### Node.js

```javascript
import httpcloak from "httpcloak";

const session = new httpcloak.Session({ preset: "chrome-145" });
const r = await session.get("https://example.com");
console.log(r.statusCode, r.protocol);
session.close();
```

### Go

```go
import "github.com/sardanioss/httpcloak/client"

c := client.NewClient("chrome-145")
defer c.Close()

resp, _ := c.Get(ctx, "https://example.com", nil)
body, _ := resp.Text()
```

---

## 🔐 Browser Fingerprinting Layers

### TLS Layer
- JA3 / JA4 fingerprints
- GREASE randomization
- Post-quantum X25519MLKEM768
- ECH (Encrypted Client Hello)

### Transport Layer
- HTTP/2 SETTINGS frames
- WINDOW_UPDATE values
- Stream priorities (HPACK)
- QUIC transport parameters
- HTTP/3 GREASE frames

### Header Layer
- Sec-Fetch-* coherence
- Client Hints (Sec-Ch-UA)
- Accept / Accept-Language
- Header ordering
- Cookie persistence

---

## 🎭 Browser Presets

| Preset | Platform | Post-Quantum | HTTP/3 |
|--------|----------|--------------|--------|
| `chrome-145` | Auto | ✅ | ✅ |
| `chrome-145-windows` | Windows | ✅ | ✅ |
| `chrome-145-macos` | macOS | ✅ | ✅ |
| `chrome-145-linux` | Linux | ✅ | ✅ |
| `chrome-145-ios` | iOS | ✅ | ✅ |
| `chrome-145-android` | Android | ✅ | ✅ |
| `firefox-133` | Auto | ❌ | ❌ |
| `safari-18` | macOS | ❌ | ✅ |
| `safari-18-ios` | iOS | ❌ | ✅ |

---

## 🌐 Advanced Features

### ECH (Encrypted Client Hello)

Hide which domain you're connecting to:

```python
session = httpcloak.Session(
    preset="chrome-145",
    ech_from="cloudflare.com"  # Fetches ECH config from DNS
)
# Cloudflare trace shows sni=encrypted
```

### Session Resumption (0-RTT)

```python
# Warm up session
session = httpcloak.Session(preset="chrome-145")
session.get("https://cloudflare.com/")
session.save("session.json")

# Later use
session = httpcloak.Session.load("session.json")
r = session.get("https://target.com/")  # Bot score: 99
```

### HTTP/3 Through Proxies

```python
# SOCKS5 with UDP
session = httpcloak.Session(proxy="socks5://user:pass@proxy:1080")

# MASQUE (CONNECT-UDP)
session = httpcloak.Session(proxy="masque://proxy:443")

# Speculative TLS (faster)
session = httpcloak.Session(
    proxy="socks5://...",
    enable_speculative_tls=True
)
```

### Proxy Rotation

```python
session = httpcloak.Session(preset="chrome-145")

# Switch proxies mid-session
session.set_proxy("http://proxy1.example.com:8080")
r = session.get("https://api.ipify.org")

session.set_proxy("socks5://proxy2.example.com:1080")
r = session.get("https://api.ipify.org")

# Back to direct
session.set_proxy("")
```

### Domain Fronting

```python
# Connect to different host than SNI
client = httpcloak.NewClient("chrome-145",
    connect_to=("public-cdn.com", "actual-backend.internal")
)
```

### Browser Behavior Simulation

```python
# Refresh (F5) - close connections, keep TLS cache
session.refresh()

# Warmup - fetch page + subresources
session.warmup("https://example.com")

# Fork - create parallel "tabs"
tabs = session.fork(10)
for tab in tabs:
    tab.get("https://example.com/page")
```

---

## 📋 Use Cases

### Web Scraping (Bot-Protected Sites)

```python
import httpcloak

session = httpcloak.Session(preset="chrome-145")
session.warmup("https://target.com")

# Now looks like real user
r = session.get("https://target.com/api/data")
data = r.json()
```

### API Access (Akamai/Cloudflare Protected)

```python
session = httpcloak.Session(
    preset="chrome-145",
    ech_from="cloudflare.com"
)

r = session.get("https://protected-api.com/data")
```

### Testing Bot Detection

```python
# Test if your protection detects this
r = httpcloak.get("https://cf.erisa.uk/", preset="chrome-145")
print(r.text)  # Check bot score
```

### Parallel Requests (Multi-Tab)

```python
session = httpcloak.Session(preset="chrome-145")
session.warmup("https://example.com")

# Create 10 parallel tabs
tabs = session.fork(10)

import threading
for i, tab in enumerate(tabs):
    threading.Thread(
        target=lambda t, n: t.get(f"https://example.com/page/{n}"),
        args=(tab, i)
    ).start()
```

---

## 🔧 Configuration

### Protocol Selection

```python
# Force HTTP/3
session = httpcloak.Session(preset="chrome-145", http_version="h3")

# Force HTTP/2
session = httpcloak.Session(preset="chrome-145", http_version="h2")

# Force HTTP/1.1
session = httpcloak.Session(preset="chrome-145", http_version="h1")

# Auto (default - tries h3 first)
session = httpcloak.Session(preset="chrome-145", http_version="auto")
```

### Timeouts & Retries

```python
session = httpcloak.Session(
    preset="chrome-145",
    timeout=30,
    retry=3  # Retry on 429, 500, 502, 503, 504
)
```

### Header Customization

```python
session = httpcloak.Session(preset="chrome-145")

# Get current header order
print(session.get_header_order())

# Set custom order
session.set_header_order([
    "accept-language", "sec-ch-ua", "accept",
    "sec-fetch-site", "user-agent"
])

# Reset to default
session.set_header_order([])
```

### Authentication

```python
# Basic auth
r = httpcloak.get("https://api.example.com",
    auth=("username", "password"),
    preset="chrome-145"
)

# Session-level auth
session = httpcloak.Session(
    preset="chrome-145",
    auth=("username", "password")
)
```

### Streaming

```python
# Stream large downloads
stream = session.get_stream("https://example.com/large-file.zip")
print(f"Size: {stream.content_length} bytes")

with open("file.zip", "wb") as f:
    while True:
        chunk = stream.read(8192)
        if not chunk:
            break
        f.write(chunk)
stream.close()

# Iterator pattern
for chunk in session.get_stream(url).iter_content(chunk_size=8192):
    process(chunk)
```

---

## 🧪 Testing Your Setup

### Check Fingerprint

```bash
# TLS fingerprint
curl https://tls.peet.ws/api/all

# HTTP/3 QUIC fingerprint
curl https://quic.browserleaks.com/

# Cloudflare bot score
curl https://cf.erisa.uk/

# ECH status
curl https://www.cloudflare.com/cdn-cgi/trace
```

### Expected Results

With httpcloak `chrome-145` preset:
- JA3/JA4: Matches real Chrome
- HTTP/2: Akamai fingerprint match
- HTTP/3: QUIC params match
- Bot Score: 99 (Cloudflare)

---

## ⚠️ Legal Notice

**Use responsibly:**
- ✅ Web scraping with permission
- ✅ API access within ToS
- ✅ Security research with authorization
- ✅ Testing your own systems

**Don't use for:**
- ❌ Bypassing security without permission
- ❌ Scraping protected data
- ❌ Attacking systems
- ❌ Violating terms of service

---

## 📚 References

- GitHub: https://github.com/sardanioss/httpcloak
- PyPI: https://pypi.org/project/httpcloak/
- npm: https://www.npmjs.com/package/httpcloak
- Go: https://pkg.go.dev/github.com/sardanioss/httpcloak

---

*Every byte indistinguishable from Chrome.*
