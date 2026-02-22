#!/bin/bash
# ALL-IN-ONE: Disable Defender + Setup + Run Tests
# Run as Administrator

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║      ASKMEBILL PENTEST - FULL AUTOMATION                  ║"
echo "║      Disable Defender → Setup → Run Tests                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check admin
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ Please run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click → Run as Administrator" -ForegroundColor Yellow
    pause
    exit 1
}

# Step 1: Disable Windows Defender
echo "STEP 1: Disabling Windows Defender..."
echo "─────────────────────────────────────"

try {
    Set-MpPreference -DisableRealtimeMonitoring $true -ErrorAction Stop
    Set-MpPreference -DisableBehaviorMonitoring $true
    Set-MpPreference -DisableBlockAtFirstSeen $true
    
    # Add exclusions
    $paths = @(
        "$PWD",
        "$env:USERPROFILE\.openclaw",
        "$env:LOCALAPPDATA\ms-playwright",
        "$env:TEMP"
    )
    
    foreach ($path in $paths) {
        if (Test-Path $path) {
            Add-MpPreference -ExclusionPath $path -ErrorAction SilentlyContinue
        }
    }
    
    $processes = @("python.exe", "pythonw.exe", "chromium.exe", "chrome.exe", "node.exe")
    foreach ($proc in $processes) {
        Add-MpPreference -ExclusionProcess $proc -ErrorAction SilentlyContinue
    }
    
    Write-Host "✅ Defender disabled successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not disable Defender (may need manual intervention)" -ForegroundColor Yellow
    Write-Host "   Error: $_" -ForegroundColor Gray
}

echo ""

# Step 2: Check Python
echo "STEP 2: Checking Python..."
echo "─────────────────────────────────────"
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Host "❌ Python not found! Please install Python 3.8+ from python.org" -ForegroundColor Red
    pause
    exit 1
}

python --version
Write-Host "✅ Python found!" -ForegroundColor Green
echo ""

# Step 3: Install Playwright
echo "STEP 3: Installing Playwright..."
echo "─────────────────────────────────────"

Write-Host "Installing playwright package..."
python -m pip install playwright -q

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install playwright" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Installing Chromium browser..."
python -m playwright install chromium

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Chromium" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Playwright installed!" -ForegroundColor Green
echo ""

# Step 4: Run Tests
echo "STEP 4: Running Penetration Tests..."
echo "─────────────────────────────────────"
echo ""
echo "Target: https://sit.askmebill.com/"
echo "Username: uuio11"
echo "2FA Code: 954900"
echo ""
echo "Press any key to start testing..."
pause

echo ""
echo "🚀 Starting automated penetration testing..."
echo ""

python "$PSScriptRoot\askmebill_playwright_test.py"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Testing Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Check results files:"
Get-ChildItem "$PSScriptRoot\askmebill-test-results-*.json" | Select-Object -Last 1
Get-ChildItem "$PSScriptRoot\*.png" | Select-Object Name
echo ""
echo "Press any key to exit..."
pause
