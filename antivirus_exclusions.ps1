# Antivirus Workaround Script
# Run as Administrator

Write-Host "=== Antivirus Configuration for Testing ===" -ForegroundColor Green

# Add exclusions for test directories
$paths = @(
    "D:\Users\nuttawat.jun\Documents\GitHub\testshop",
    "D:\Users\nuttawat.jun\.openclaw",
    "$env:LOCALAPPDATA\ms-playwright"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "Adding exclusion: $path" -ForegroundColor Yellow
        try {
            Add-MpPreference -ExclusionPath $path -ErrorAction Stop
            Write-Host "  ✓ Added" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ Failed: $_" -ForegroundColor Red
        }
    }
}

# Add exclusion for Python/Playwright processes
$processes = @("python.exe", "pythonw.exe", "chromium.exe", "chrome.exe")
foreach ($proc in $processes) {
    Write-Host "Adding process exclusion: $proc" -ForegroundColor Yellow
    try {
        Add-MpPreference -ExclusionProcess $proc -ErrorAction Stop
        Write-Host "  ✓ Added" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Configuration Complete ===" -ForegroundColor Green
Write-Host "If exclusions failed, run PowerShell as Administrator" -ForegroundColor Cyan
