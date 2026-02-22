#!/bin/bash
# Windows Defender - Temporary Disable for Testing
# Safe method - can be reverted

echo "=========================================="
echo "  Temporary Windows Defender Disable"
echo "  FOR TESTING ENVIRONMENT ONLY"
echo "=========================================="
echo ""

# Check if running as admin
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[!] Please run as Administrator" -ForegroundColor Red
    exit 1
}

echo "[*] Current Defender Status:"
Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled, AntivirusEnabled

echo ""
echo "[*] Disabling Real-time Protection..."
Set-MpPreference -DisableRealtimeMonitoring $true
Set-MpPreference -DisableBehaviorMonitoring $true
Set-MpPreference -DisableBlockAtFirstSeen $true
Set-MpPreference -DisableIOAVProtection $true
Set-MpPreference -DisablePrivacyMode $true

echo "[*] Adding Exclusions..."
# Add paths
$exclusionPaths = @(
    "C:\Users\$env:USERNAME\Documents\GitHub\testshop",
    "C:\Users\$env:USERNAME\.openclaw",
    "C:\Users\$env:USERNAME\AppData\Local\ms-playwright"
)

foreach ($path in $exclusionPaths) {
    if (Test-Path $path) {
        Add-MpPreference -ExclusionPath $path
        Write-Host "  ✓ Excluded: $path" -ForegroundColor Green
    }
}

# Add processes
$exclusionProcesses = @("python.exe", "pythonw.exe", "chromium.exe", "chrome.exe", "node.exe", "code.exe")
foreach ($proc in $exclusionProcesses) {
    Add-MpPreference -ExclusionProcess $proc
    Write-Host "  ✓ Excluded process: $proc" -ForegroundColor Green
}

echo ""
echo "[*] New Defender Status:"
Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled, AntivirusEnabled

echo ""
echo "=========================================="
echo "  ✅ Defender Temporarily Disabled"
echo "  You can now run penetration tests"
echo "=========================================="
echo ""
echo "To re-enable after testing, run:"
echo "  Set-MpPreference -DisableRealtimeMonitoring $false"
echo ""
