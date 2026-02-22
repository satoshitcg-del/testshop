---
name: witr-assistant
description: System process and service diagnostics using witr (Why Is This Running?). Use when investigating running processes, understanding why a service is running, tracing process origins, debugging system resources, analyzing process causality, or troubleshooting mysterious background tasks. Shows process hierarchy, parent processes, service dependencies, container origins, and startup mechanisms.
---

# Witr Assistant

Understand why processes are running on your system.

---

## 📦 Installation

### Quick Install

**Linux/macOS/FreeBSD:**
```bash
curl -fsSL https://raw.githubusercontent.com/pranshuparmar/witr/main/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/pranshuparmar/witr/main/install.ps1 | iex
```

### Package Managers

```bash
# Homebrew (macOS/Linux)
brew install witr

# Conda (macOS/Linux/Windows)
conda install -c conda-forge witr

# Arch Linux (AUR)
yay -S witr-bin
```

### Verify Installation
```bash
witr --version
```

---

## 🎯 What witr Does

witr answers: **"Why is this running?"**

Instead of just showing what processes are running (like `ps`, `top`), witr explains:
- Where did this process come from?
- How was it started?
- What chain of systems is responsible for it?

---

## 🚀 Quick Start

### Basic Usage

```bash
# Check a specific process by PID
witr 1234

# Check a process by name
witr chrome

# Check what is using a port
witr :8080

# Interactive TUI mode
witr
```

### Common Commands

```bash
# Find why a service is running
witr nginx
witr docker
witr python

# Check port usage
witr :3000
witr :8080
witr :5432

# Check all processes (TUI)
witr

# Filter in TUI
# Type /search-term to filter
```

---

## 📋 Use Cases

### 1. Mystery Process Investigation

```bash
# Something is consuming CPU - find out why
witr 12345

# Output shows:
# - Process name and command
# - Parent process chain
# - How it was started (shell, systemd, docker, etc.)
# - Service file if applicable
```

### 2. Port Conflict Resolution

```bash
# Port 8080 is in use - by what and why?
witr :8080

# Shows:
# - Which process owns the port
# - Why that process is running
# - Full startup chain
```

### 3. Service Debugging

```bash
# Why is this service running?
witr postgresql
witr redis-server
witr docker

# Traces back through:
# - systemd/service manager
# - Startup scripts
# - Dependencies
```

### 4. Container Investigation

```bash
# Process running inside Docker?
witr 1234

# Shows:
# - Container ID
# - Image origin
# - Docker run command ancestry
```

### 5. Finding Process Origins

```bash
# Shell script started something
witr suspicious-process

# Shows:
# - Which shell started it
# - The command that started it
# - Parent shell's origin
```

---

## 🔧 Flags & Options

```bash
witr [options] [target]

Options:
  -h, --help          Show help
  -v, --version       Show version
  -j, --json          Output as JSON
  -q, --quiet         Quiet mode
  -t, --tree          Show process tree
```

### JSON Output (for scripting)

```bash
witr -j 1234 | jq .
witr -j :8080
```

---

## 🖥️ Interactive TUI Mode

Launch without arguments for interactive dashboard:

```bash
witr
```

**TUI Navigation:**
| Key | Action |
|-----|--------|
| `↑/↓` | Navigate processes |
| `Enter` | Show details |
| `/` | Search/filter |
| `q` | Quit |
| `r` | Refresh |

---

## 💡 Common Scenarios

### Scenario: High CPU Usage

```bash
# Find PID with high CPU
top
# PID 5678 using 90% CPU

# Investigate
witr 5678

# Output explains:
# - What the process is
# - Who started it
# - Why it's running
```

### Scenario: Unknown Service

```bash
# Something listening on port 3000
lsof -i :3000
# PID 9999

witr 9999

# Shows service origin and startup reason
```

### Scenario: Debugging Startup Issues

```bash
# Service failing to start?
# Check what depends on it
witr service-name

# Shows:
# - Service dependencies
# - Startup chain
# - Configuration files
```

### Scenario: Security Audit

```bash
# Suspicious process found
witr suspicious-pid

# Reveals:
# - How it was started
# - Parent process
# - User context
# - Startup mechanism
```

---

## 🔄 Integration with Other Tools

### With ps/top
```bash
# Find suspicious PID
top

# Investigate with witr
witr <pid>
```

### With lsof
```bash
# Find what uses port
lsof -i :8080

# Get full context
witr :8080
```

### With systemctl
```bash
# Service status
systemctl status nginx

# Full causality
witr nginx
```

### With Docker
```bash
# Container processes
docker ps

# Process origin
witr <container-pid>
```

---

## 📊 Output Examples

### Process Origin
```
$ witr 1234
Process: nginx worker
PID: 1234
Parent: nginx master (1230)
Started by: systemd
Service: nginx.service
Reason: Web server serving traffic
Config: /etc/nginx/nginx.conf
```

### Port Investigation
```
$ witr :3000
Port: 3000
Process: node (4567)
Command: npm start
Directory: /home/user/project
Started: via terminal (bash 1234)
Parent: terminal session
Reason: Development server
```

### Container Process
```
$ witr 5678
Process: python app.py
PID: 5678
Container: myapp_container (abc123)
Image: myapp:latest
Started: docker-compose up
Compose file: /home/user/docker-compose.yml
Reason: Application container
```

---

## 🛠️ Advanced Usage

### Batch Analysis
```bash
# Check multiple processes
for pid in 1234 5678 9012; do
    witr -j $pid >> investigation.json
done
```

### Automated Monitoring
```bash
# Cron job to check suspicious processes
*/5 * * * * witr -j suspicious-service >> /var/log/process-tracking.json
```

### Scripting
```bash
#!/bin/bash
# Check if service should be running
if witr -q nginx; then
    echo "Nginx is running as expected"
else
    echo "Nginx not found - checking..."
fi
```

---

## 🎓 Learning Resources

- GitHub: https://github.com/pranshuparmar/witr
- Documentation: See `witr --help`
- TUI Help: Press `?` in interactive mode

---

## 💻 Platform Support

- ✅ Linux
- ✅ macOS  
- ✅ FreeBSD
- ✅ Windows

---

*witr: Making system causality explicit.*
